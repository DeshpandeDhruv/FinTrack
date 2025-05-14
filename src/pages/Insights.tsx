import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { LineChart, BarChart, PieChart, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import './Insights.css';

const Insights: React.FC = () => {
  const { inflationForecast, marketSentiment, userBehaviorType } = useFinance();
  const [activeTab, setActiveTab] = useState<'market' | 'personal' | 'trends'>('market');

  const marketInsights = [
    {
      title: 'Inflation Forecast',
      value: `${inflationForecast.forecast}%`,
      change: inflationForecast.change,
      trend: inflationForecast.change > 0 ? 'up' : 'down',
      description: 'Projected inflation rate for the next quarter'
    },
    {
      title: 'Market Sentiment',
      value: marketSentiment.overall,
      change: marketSentiment.change,
      trend: marketSentiment.change > 0 ? 'up' : 'down',
      description: 'Overall market sentiment index'
    },
    {
      title: 'Interest Rates',
      value: '4.25%',
      change: 0.25,
      trend: 'up',
      description: 'Current federal interest rate'
    }
  ];

  const personalInsights = [
    {
      title: 'Savings Rate',
      value: '12%',
      change: 2,
      trend: 'up',
      description: 'Your current savings rate'
    },
    {
      title: 'Investment Return',
      value: '8.5%',
      change: 1.2,
      trend: 'up',
      description: 'Year-to-date investment returns'
    },
    {
      title: 'Spending Growth',
      value: '3.2%',
      change: -0.8,
      trend: 'down',
      description: 'Monthly spending growth rate'
    }
  ];

  const marketTrends = [
    {
      sector: 'Technology',
      sentiment: marketSentiment.sectors.technology,
      trend: 'up',
      description: 'Strong growth in AI and cloud computing'
    },
    {
      sector: 'Healthcare',
      sentiment: marketSentiment.sectors.healthcare,
      trend: 'up',
      description: 'Stable growth with innovation in biotech'
    },
    {
      sector: 'Energy',
      sentiment: marketSentiment.sectors.energy,
      trend: 'down',
      description: 'Volatile due to geopolitical factors'
    },
    {
      sector: 'Finance',
      sentiment: marketSentiment.sectors.finance,
      trend: 'neutral',
      description: 'Mixed signals with interest rate changes'
    }
  ];

  return (
    <div className="insights-container">
      <div className="insights-header">
        <h1>Financial Insights</h1>
        <p>Detailed analysis of market trends and your personal finances</p>
      </div>
      
      <div className="insights-tabs">
        <button 
          className={`tab-button ${activeTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveTab('market')}
        >
          <LineChart size={20} />
          Market Analysis
        </button>
        <button 
          className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <PieChart size={20} />
          Personal Finance
        </button>
        <button 
          className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          <BarChart size={20} />
          Market Trends
        </button>
      </div>

      <div className="insights-content">
        {activeTab === 'market' && (
          <div className="market-insights">
            <div className="insights-grid">
              {marketInsights.map((insight, index) => (
                <div key={index} className="insight-card">
                  <h3>{insight.title}</h3>
                  <div className="insight-value">
                    <span className="value">{insight.value}</span>
                    <span className={`change ${insight.trend}`}>
                      {insight.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {insight.change}%
                    </span>
                  </div>
                  <p>{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="personal-insights">
            <div className="insights-grid">
              {personalInsights.map((insight, index) => (
                <div key={index} className="insight-card">
                  <h3>{insight.title}</h3>
                  <div className="insight-value">
                    <span className="value">{insight.value}</span>
                    <span className={`change ${insight.trend}`}>
                      {insight.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {insight.change}%
                    </span>
                  </div>
                  <p>{insight.description}</p>
                </div>
              ))}
            </div>
            <div className="behavior-insight">
              <h3>Your Financial Behavior</h3>
              <p>Based on your spending and investment patterns, you are a <strong>{userBehaviorType}</strong>.</p>
              <div className="behavior-tips">
                <h4>Tips for {userBehaviorType}s:</h4>
                <ul>
                  {userBehaviorType === 'Saver' && (
                    <>
                      <li>Consider diversifying your investments beyond low-risk options</li>
                      <li>Look into tax-advantaged retirement accounts</li>
                    </>
                  )}
                  {userBehaviorType === 'Risk-Taker' && (
                    <>
                      <li>Build an emergency fund for unexpected expenses</li>
                      <li>Consider balancing high-risk investments with stable assets</li>
                    </>
                  )}
                  {userBehaviorType === 'Balanced' && (
                    <>
                      <li>Maintain your current investment strategy</li>
                      <li>Regularly review and rebalance your portfolio</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="market-trends">
            <div className="trends-grid">
              {marketTrends.map((trend, index) => (
                <div key={index} className="trend-card">
                  <div className="trend-header">
                    <h3>{trend.sector}</h3>
                    <span className={`sentiment ${trend.trend}`}>
                      {trend.sentiment}
                    </span>
                  </div>
                  <p>{trend.description}</p>
                  <div className="trend-indicators">
                    <span className={`indicator ${trend.trend}`}>
                      {trend.trend === 'up' ? <TrendingUp size={16} /> : 
                       trend.trend === 'down' ? <TrendingDown size={16} /> : 
                       <DollarSign size={16} />}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;