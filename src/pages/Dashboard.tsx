import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import InflationChart from '../components/dashboard/InflationChart';
import MarketSentiment from '../components/dashboard/MarketSentiment';
import BehaviorInsight from '../components/dashboard/BehaviorInsight';
import RecommendationCard from '../components/dashboard/RecommendationCard';
import { useFinance } from '../context/FinanceContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { 
    user, 
    inflationForecast, 
    marketSentiment, 
    userBehaviorType,
    recommendations,
    refreshData
  } = useFinance();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Simulated spending breakdown data
  const spendingBreakdown = [
    { category: 'Housing', percentage: 35, change: -2 },
    { category: 'Food', percentage: 20, change: 5 },
    { category: 'Transportation', percentage: 15, change: -1 },
    { category: 'Entertainment', percentage: 10, change: 8 },
    { category: 'Utilities', percentage: 8, change: 0 },
    { category: 'Other', percentage: 12, change: -3 }
  ];
  
  // Handle refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      refreshData();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="greeting-section">
          <h1>Welcome back, {user?.name || 'User'}</h1>
          <p>Here's your financial pulse for today</p>
        </div>
        <button 
          className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw size={16} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>
      
      <div className="dashboard-overview">
        <div className="overview-card">
          <h3>Behavior Type</h3>
          <p className="overview-value">{userBehaviorType}</p>
        </div>
        <div className="overview-card">
          <h3>Inflation Status</h3>
          <p className="overview-value">{inflationForecast.status}</p>
        </div>
        <div className="overview-card">
          <h3>Market Sentiment</h3>
          <p className="overview-value">{marketSentiment.status}</p>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="grid-item inflation-section">
          <InflationChart 
            data={inflationForecast.data} 
            forecast={inflationForecast.forecast}
          />
        </div>
        
        <div className="grid-item market-section">
          <MarketSentiment 
            overallSentiment={marketSentiment.overall}
            sectors={marketSentiment.sectors}
          />
        </div>
        
        <div className="grid-item behavior-section">
          <BehaviorInsight 
            behaviorType={userBehaviorType}
            spendingBreakdown={spendingBreakdown}
            savingsRate={user?.savings_rate || 12}
            lastMonthChange={2.5}
          />
        </div>
        
        <div className="grid-item recommendations-section">
          <div className="section-header">
            <h3>Personalized Recommendations</h3>
          </div>
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={index}
                title={rec.title}
                description={rec.description}
                impact={rec.impact}
                category={rec.category}
                actionLink={rec.actionLink}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;