import sys
import json
import pickle
import numpy as np
import tensorflow as tf
from pathlib import Path
import logging
import os

# Set up logging to file instead of stdout
logging.basicConfig(
    filename='prediction.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)

def load_models_and_scalers():
    logging.info("Loading models and scalers...")
    base_path = Path(__file__).parent.parent / 'models'
    
    # Load LSTM models with compile=False since we only need inference
    logging.info("Loading LSTM models...")
    cpi_model = tf.keras.models.load_model(str(base_path / 'Monthly_CPI_lstm_model.h5'), 
                                         compile=False)
    rate_model = tf.keras.models.load_model(str(base_path / 'Monthly_Rate_lstm_model.h5'),
                                          compile=False)
    bank_rate_model = tf.keras.models.load_model(str(base_path / 'Bank Rate_lstm_model.h5'),
                                               compile=False)
    
    # Load XGBoost model with explicit binary mode
    logging.info("Loading XGBoost model...")
    try:
        with open(base_path / 'xgb_model.pkl', 'rb') as f:
            xgb_model = pickle.load(f)
    except Exception as e:
        logging.error(f"Error loading XGBoost model: {str(e)}")
        raise
    
    # Load scalers with explicit binary mode
    logging.info("Loading scalers...")
    try:
        with open(base_path / 'target_scaler.pkl', 'rb') as f:
            target_scaler = pickle.load(f)
        
        with open(base_path / 'feature_scalers.pkl', 'rb') as f:
            feature_scalers = pickle.load(f)
    except Exception as e:
        logging.error(f"Error loading scalers: {str(e)}")
        raise
    
    logging.info("All models and scalers loaded successfully!")
    return cpi_model, rate_model, bank_rate_model, xgb_model, target_scaler, feature_scalers

def predict(input_data):
    logging.info("\nStarting prediction process...")
    try:
        # Load all models and scalers
        cpi_model, rate_model, bank_rate_model, xgb_model, target_scaler, feature_scalers = load_models_and_scalers()
        
        # Convert input data to numpy arrays
        logging.info("Preparing input data...")
        input_array = np.array([[item['cpi'], item['inflation'], item['rate'], item['bankRate']] 
                               for item in input_data])
        
        # Reshape for LSTM input (samples, time steps, features)
        input_array = input_array.reshape((1, input_array.shape[0], input_array.shape[1]))
        
        logging.info("Making LSTM predictions...")
        # Make LSTM predictions
        cpi_preds = cpi_model.predict(input_array)[0]
        rate_preds = rate_model.predict(input_array)[0]
        bank_rate_preds = bank_rate_model.predict(input_array)[0]
        
        logging.info(f"LSTM predictions: CPI={cpi_preds}, Rate={rate_preds}, Bank Rate={bank_rate_preds}")
        
        # Combine LSTM predictions for XGBoost input
        X = np.column_stack([cpi_preds, rate_preds, bank_rate_preds])
        
        # Scale features
        logging.info("Scaling features for XGBoost...")
        X_scaled = feature_scalers.transform(X)
        
        # Make final prediction using XGBoost
        logging.info("Making XGBoost predictions...")
        prediction = xgb_model.predict(X_scaled)
        
        # Inverse transform prediction
        prediction_original = target_scaler.inverse_transform(prediction.reshape(-1, 1))
        
        final_predictions = prediction_original.flatten().tolist()
        logging.info(f"Final inflation predictions: {final_predictions}")
        
        return final_predictions
    except Exception as e:
        logging.error(f"Error during prediction: {str(e)}")
        raise

if __name__ == "__main__":
    try:
        # Get input data from command line arguments
        input_data = json.loads(sys.argv[1])
        
        # Make predictions
        predictions = predict(input_data)
        
        # Print only the predictions as JSON
        print(json.dumps(predictions))
    except Exception as e:
        logging.error(f"Error during prediction: {str(e)}")
        print(json.dumps({"error": str(e)})) 