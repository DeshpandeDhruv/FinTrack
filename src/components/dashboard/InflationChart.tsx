import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import './InflationChart.css';

interface InflationChartProps {
  data: {
    date: string;
    value: number;
  }[];
  forecast: {
    date: string;
    value: number;
    confidence?: {
      upper: number;
      lower: number;
    };
  }[];
}

const InflationChart: React.FC<InflationChartProps> = ({ data, forecast }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // This would be replaced with a real chart library like Chart.js or D3.js
    // For now, we'll just simulate a chart using HTML elements
    const historicalData = data.slice(-6);
    const allData = [...historicalData, ...forecast];
    
    // Calculate the max and min values for scaling
    const values = allData.map(item => item.value);
    const maxValue = Math.max(...values) * 1.1; // Add 10% padding
    const minValue = Math.min(...values) * 0.9; // Add 10% padding
    const range = maxValue - minValue;
    
    // Clear any existing chart
    chartRef.current.innerHTML = '';
    
    // Create the chart container
    const chartContainer = document.createElement('div');
    chartContainer.className = 'inflation-chart-visual';
    
    // Create bars for each data point
    allData.forEach((item, index) => {
      const bar = document.createElement('div');
      bar.className = `chart-bar ${index >= historicalData.length ? 'forecast' : 'historical'}`;
      
      // Calculate height based on value
      const height = ((item.value - minValue) / range) * 100;
      bar.style.height = `${height}%`;
      
      // Add a label
      const label = document.createElement('div');
      label.className = 'bar-label';
      label.innerText = new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short',
        year: '2-digit'
      });
      
      // Add a value tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'bar-tooltip';
      tooltip.innerText = `${item.value.toFixed(5)}%`;
      
      bar.appendChild(tooltip);
      bar.appendChild(label);
      chartContainer.appendChild(bar);
      
      // Add confidence interval for forecast bars
      if (index >= historicalData.length && item.confidence) {
        const confidenceElement = document.createElement('div');
        confidenceElement.className = 'confidence-interval';
        
        const upperHeight = ((item.confidence.upper - minValue) / range) * 100;
        const lowerHeight = ((item.confidence.lower - minValue) / range) * 100;
        
        confidenceElement.style.height = `${upperHeight - lowerHeight}%`;
        confidenceElement.style.bottom = `${lowerHeight}%`;
        
        bar.appendChild(confidenceElement);
      }
    });
    
    // Create trend line
    const trendLine = document.createElement('div');
    trendLine.className = 'trend-line';
    chartContainer.appendChild(trendLine);
    
    // Append chart to the container
    chartRef.current.appendChild(chartContainer);
    
    // Add animations after a small delay
    setTimeout(() => {
      const bars = chartContainer.querySelectorAll('.chart-bar');
      bars.forEach((bar, i) => {
        setTimeout(() => {
          (bar as HTMLElement).style.opacity = '1';
          (bar as HTMLElement).style.transform = 'translateY(0)';
        }, i * 100);
      });
    }, 100);
  }, [data, forecast]);
  
  // Calculate current inflation and change
  const currentInflation = data[data.length - 1]?.value || 0;
  const previousInflation = data[data.length - 2]?.value || 0;
  const change = currentInflation - previousInflation;
  const percentChange = (change / previousInflation) * 100;
  
  // Next month forecast
  const nextMonthForecast = forecast[0]?.value || 0;
  const forecastChange = nextMonthForecast - currentInflation;
  
  return (
    <div className="inflation-chart-container">
      <div className="inflation-stats">
        <div className="inflation-main-stat">
          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <h3>Current Inflation</h3>
            <div className="stat-value">{currentInflation.toFixed(5)}%</div>
            <div className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
              {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{Math.abs(percentChange).toFixed(5)}% from last month</span>
            </div>
          </div>
        </div>
        
        <div className="inflation-forecast-stat">
          <h4>Next Month Forecast</h4>
          <div className="forecast-value">{nextMonthForecast.toFixed(5)}%</div>
          <div className={`forecast-change ${forecastChange >= 0 ? 'positive' : 'negative'}`}>
            {forecastChange >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{Math.abs(forecastChange).toFixed(5)}% change expected</span>
          </div>
        </div>
      </div>
      
      <div className="chart-title-section">
        <h3>Inflation Trend & Forecast</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color historical"></div>
            <span>Historical</span>
          </div>
          <div className="legend-item">
            <div className="legend-color forecast"></div>
            <span>Forecast</span>
          </div>
        </div>
      </div>
      
      <div className="chart-container" ref={chartRef}></div>
    </div>
  );
};

export default InflationChart;