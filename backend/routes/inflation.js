import express from 'express';
import path from 'path';
import { PythonShell } from 'python-shell';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get historical inflation data
router.get('/historical', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/Inflation _ data.csv'), 'utf8');
    const rows = data.split('\n').slice(1); // Skip header
    const historicalData = rows.map(row => {
      const [date, cpi, inflation, rate, bankRate] = row.split(',');
      return {
        date,
        cpi: parseFloat(cpi),
        inflation: parseFloat(inflation),
        rate: parseFloat(rate),
        bankRate: parseFloat(bankRate)
      };
    }).filter(item => !isNaN(item.inflation));
    
    res.json(historicalData);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Get inflation forecast
router.get('/forecast', async (req, res) => {
  try {
    console.log('Generating inflation forecast...');
    
    // Read the predictions from the CSV file
    const predictionsPath = path.join(__dirname, '../models/future_predictions.csv');
    const predictionsData = await fs.readFile(predictionsPath, 'utf8');
    const predictions = predictionsData.split('\n')
      .slice(1) // Skip header
      .filter(line => line.trim()) // Remove empty lines
      .map(line => {
        const [date, predicted_inflation, cpi, rate, bankRate] = line.split(',');
        return {
          date,
          value: parseFloat(predicted_inflation),
          cpi: parseFloat(cpi),
          rate: parseFloat(rate),
          bankRate: parseFloat(bankRate)
        };
      });

    // Read historical data
    const historicalData = await fs.readFile(path.join(__dirname, '../data/Inflation _ data.csv'), 'utf8');
    const historicalRows = historicalData.split('\n')
      .slice(1) // Skip header
      .filter(line => line.trim()) // Remove empty lines
      .map(line => {
        const [date, cpi, inflation, rate, bankRate] = line.split(',');
        return {
          date,
          value: parseFloat(inflation),
          cpi: parseFloat(cpi),
          rate: parseFloat(rate),
          bankRate: parseFloat(bankRate)
        };
      })
      .filter(item => !isNaN(item.value));

    // Get last 12 months of historical data
    const last12Months = historicalRows.slice(-12);

    // Combine historical data and predictions
    const forecast = {
      status: 'Moderate Concern',
      data: last12Months,
      forecast: predictions.map(pred => ({
        date: pred.date,
        value: Number(pred.value.toFixed(5)),
        confidence: {
          upper: Number((pred.value * 1.1).toFixed(5)),
          lower: Number((pred.value * 0.9).toFixed(5))
        }
      }))
    };

    console.log('Final forecast object:', forecast);
    res.json(forecast);
  } catch (error) {
    console.error('Error generating forecast:', error);
    res.status(500).json({ error: 'Failed to generate forecast: ' + error.message });
  }
});

export default router; 