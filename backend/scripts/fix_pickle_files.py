import pickle
import numpy as np
from pathlib import Path
import logging
import os

# Set up logging with more detail
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('pickle_fix.log'),
        logging.StreamHandler()
    ]
)

def verify_pickle_file(file_path):
    """Verify if a pickle file can be loaded correctly."""
    try:
        with open(file_path, 'rb') as f:
            data = pickle.load(f)
        logging.info(f"Successfully verified {file_path}")
        return True
    except Exception as e:
        logging.error(f"Error verifying {file_path}: {str(e)}")
        return False

def fix_pickle_file(file_path):
    """Fix a pickle file that might have line ending issues."""
    try:
        # First verify the file exists and is readable
        if not os.path.exists(file_path):
            logging.error(f"File does not exist: {file_path}")
            return False
            
        # Try to load the file
        with open(file_path, 'rb') as f:
            data = pickle.load(f)
        
        # Create backup of original file
        backup_path = file_path.with_suffix('.pkl.bak')
        os.rename(file_path, backup_path)
        logging.info(f"Created backup at {backup_path}")
        
        # Resave with proper binary mode and protocol
        with open(file_path, 'wb') as f:
            pickle.dump(data, f, protocol=4)  # Use protocol 4 for better compatibility
        
        # Verify the new file
        if verify_pickle_file(file_path):
            logging.info(f"Successfully fixed {file_path}")
            # Remove backup if everything is okay
            os.remove(backup_path)
            return True
        else:
            # Restore from backup if verification fails
            os.remove(file_path)
            os.rename(backup_path, file_path)
            logging.error(f"Verification failed for {file_path}, restored from backup")
            return False
            
    except Exception as e:
        logging.error(f"Error fixing {file_path}: {str(e)}")
        # Restore from backup if it exists
        backup_path = file_path.with_suffix('.pkl.bak')
        if os.path.exists(backup_path):
            if os.path.exists(file_path):
                os.remove(file_path)
            os.rename(backup_path, file_path)
            logging.info(f"Restored from backup {backup_path}")
        return False

def main():
    base_path = Path(__file__).parent.parent / 'models'
    
    # List of pickle files to fix
    pickle_files = [
        'xgb_model.pkl',
        'target_scaler.pkl',
        'feature_scalers.pkl'
    ]
    
    logging.info("Starting pickle file verification and fix process...")
    
    # First verify all files
    logging.info("\nVerifying pickle files...")
    for file_name in pickle_files:
        file_path = base_path / file_name
        if file_path.exists():
            logging.info(f"\nProcessing {file_name}...")
            if not verify_pickle_file(file_path):
                logging.warning(f"File {file_name} needs fixing")
                fix_pickle_file(file_path)
        else:
            logging.warning(f"File not found: {file_name}")
    
    logging.info("\nProcess completed. Check pickle_fix.log for details.")

if __name__ == "__main__":
    main() 