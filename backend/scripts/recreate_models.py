import pickle
import numpy as np
from pathlib import Path
import logging
from sklearn.preprocessing import MinMaxScaler
import xgboost as xgb
import tensorflow as tf
import pandas as pd
from datetime import datetime, timedelta

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('model_recreation.log'),
        logging.StreamHandler()
    ]
)

def load_historical_data():
    """Load and prepare historical data."""
    logging.info("Loading historical data...")
    base_path = Path(__file__).parent.parent
    data_path = base_path / 'data' / 'Inflation _ data.csv'
    
    try:
        # Read the CSV file
        df = pd.read_csv(data_path)
        logging.info(f"Successfully loaded CSV file with columns: {df.columns.tolist()}")
        
        # Rename columns to match our expected format
        df = df.rename(columns={
            'observation_date': 'date',
            'Monthly_CPI': 'cpi',
            'Monthly_Inflation': 'inflation',
            'Monthly_Rate': 'rate',
            'Bank Rate': 'bankRate'
        })
        
        # Check if required columns exist
        required_columns = ['date', 'cpi', 'rate', 'bankRate', 'inflation']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        # Convert date column to datetime
        try:
            df['date'] = pd.to_datetime(df['date'])
            logging.info(f"Successfully converted date column. Date range: {df['date'].min()} to {df['date'].max()}")
        except Exception as e:
            logging.error(f"Error converting date column: {str(e)}")
            raise
        
        # Sort by date
        df = df.sort_values('date')
        
        # Remove any rows with NaN values
        initial_rows = len(df)
        df = df.dropna()
        if len(df) < initial_rows:
            logging.warning(f"Removed {initial_rows - len(df)} rows with NaN values")
        
        # Verify we have data
        if len(df) == 0:
            raise ValueError("No valid data remaining after cleaning")
        
        logging.info(f"Final dataset has {len(df)} rows")
        return df
        
    except Exception as e:
        logging.error(f"Error loading historical data: {str(e)}")
        raise

def create_scalers(df):
    """Create and save the scalers using actual data ranges."""
    logging.info("Creating scalers...")
    
    # Create target scaler for inflation
    target_scaler = MinMaxScaler()
    target_scaler.fit(df[['inflation']].values)
    
    # Create feature scalers for CPI, rate, and bankRate
    feature_scalers = MinMaxScaler()
    feature_scalers.fit(df[['cpi', 'rate', 'bankRate']].values)
    
    return target_scaler, feature_scalers

def create_xgboost_model(df, target_scaler, feature_scalers):
    """Create and train XGBoost model using historical data."""
    logging.info("Creating XGBoost model...")
    
    # Prepare features and target
    X = df[['cpi', 'rate', 'bankRate']].values
    y = df['inflation'].values
    
    # Scale the data
    X_scaled = feature_scalers.transform(X)
    y_scaled = target_scaler.transform(y.reshape(-1, 1)).ravel()
    
    # Create and train XGBoost model
    model = xgb.XGBRegressor(
        n_estimators=200,
        learning_rate=0.1,
        max_depth=6,
        random_state=42
    )
    
    # Train the model
    model.fit(X_scaled, y_scaled)
    
    return model

def generate_future_predictions(model, df, target_scaler, feature_scalers, months=12):
    """Generate predictions for future months."""
    logging.info(f"Generating predictions for next {months} months...")
    
    # Get the last known values
    last_date = df['date'].max()
    last_values = df.iloc[-1][['cpi', 'rate', 'bankRate']].values
    
    predictions = []
    current_values = last_values.copy()
    
    for i in range(months):
        # Scale the current values
        current_scaled = feature_scalers.transform(current_values.reshape(1, -1))
        
        # Make prediction
        pred_scaled = model.predict(current_scaled)
        pred = target_scaler.inverse_transform(pred_scaled.reshape(-1, 1))[0][0]
        
        # Calculate next date
        next_date = last_date + timedelta(days=30 * (i + 1))
        
        # Update values for next prediction
        # Simple update rules (you might want to adjust these based on your domain knowledge)
        current_values[0] *= (1 + pred/100)  # Update CPI based on inflation
        current_values[1] = current_values[1] * 0.95 + pred * 0.05  # Update rate
        current_values[2] = current_values[2] * 0.95 + pred * 0.05  # Update bank rate
        
        predictions.append({
            'date': next_date.strftime('%Y-%m-%d'),
            'predicted_inflation': pred,
            'cpi': current_values[0],
            'rate': current_values[1],
            'bankRate': current_values[2]
        })
    
    return predictions

def save_models():
    """Save all models and scalers."""
    base_path = Path(__file__).parent.parent / 'models'
    base_path.mkdir(exist_ok=True)
    
    try:
        # Load historical data
        df = load_historical_data()
        
        # Log data summary
        logging.info("\nData Summary:")
        logging.info(f"Date range: {df['date'].min()} to {df['date'].max()}")
        logging.info(f"Number of records: {len(df)}")
        logging.info("\nColumn statistics:")
        for col in ['cpi', 'rate', 'bankRate', 'inflation']:
            logging.info(f"{col}: min={df[col].min():.2f}, max={df[col].max():.2f}, mean={df[col].mean():.2f}")
        
        # Create and save scalers
        target_scaler, feature_scalers = create_scalers(df)
        
        with open(base_path / 'target_scaler.pkl', 'wb') as f:
            pickle.dump(target_scaler, f, protocol=4)
        logging.info("Saved target_scaler.pkl")
        
        with open(base_path / 'feature_scalers.pkl', 'wb') as f:
            pickle.dump(feature_scalers, f, protocol=4)
        logging.info("Saved feature_scalers.pkl")
        
        # Create and save XGBoost model
        xgb_model = create_xgboost_model(df, target_scaler, feature_scalers)
        with open(base_path / 'xgb_model.pkl', 'wb') as f:
            pickle.dump(xgb_model, f, protocol=4)
        logging.info("Saved xgb_model.pkl")
        
        # Generate and save future predictions
        predictions = generate_future_predictions(xgb_model, df, target_scaler, feature_scalers)
        predictions_df = pd.DataFrame(predictions)
        predictions_df.to_csv(base_path / 'future_predictions.csv', index=False)
        logging.info("Saved future_predictions.csv")
        
        # Log prediction summary
        logging.info("\nPrediction Summary:")
        logging.info(f"Predicted date range: {predictions_df['date'].min()} to {predictions_df['date'].max()}")
        logging.info(f"Predicted inflation range: {predictions_df['predicted_inflation'].min():.2f} to {predictions_df['predicted_inflation'].max():.2f}")
        
        logging.info("All models, scalers, and predictions saved successfully!")
        return True
        
    except Exception as e:
        logging.error(f"Error saving models: {str(e)}")
        return False

def verify_saved_files():
    """Verify that all saved files can be loaded correctly."""
    base_path = Path(__file__).parent.parent / 'models'
    
    try:
        # Verify target scaler
        with open(base_path / 'target_scaler.pkl', 'rb') as f:
            pickle.load(f)
        logging.info("Verified target_scaler.pkl")
        
        # Verify feature scalers
        with open(base_path / 'feature_scalers.pkl', 'rb') as f:
            pickle.load(f)
        logging.info("Verified feature_scalers.pkl")
        
        # Verify XGBoost model
        with open(base_path / 'xgb_model.pkl', 'rb') as f:
            pickle.load(f)
        logging.info("Verified xgb_model.pkl")
        
        # Verify predictions file
        predictions_df = pd.read_csv(base_path / 'future_predictions.csv')
        logging.info(f"Verified future_predictions.csv with {len(predictions_df)} predictions")
        
        return True
    except Exception as e:
        logging.error(f"Error verifying files: {str(e)}")
        return False

if __name__ == "__main__":
    logging.info("Starting model recreation process...")
    
    # First, make sure we have the required dependencies
    try:
        import sklearn
        import xgboost
        import tensorflow
        import pandas
        logging.info("All required dependencies are installed")
    except ImportError as e:
        logging.error(f"Missing dependency: {str(e)}")
        logging.error("Please install required packages: pip install scikit-learn xgboost tensorflow pandas")
        exit(1)
    
    # Save all models
    if save_models():
        # Verify the saved files
        if verify_saved_files():
            logging.info("Model recreation completed successfully!")
        else:
            logging.error("Model verification failed!")
    else:
        logging.error("Model recreation failed!") 