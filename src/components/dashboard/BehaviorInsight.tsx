import React from 'react';
import { PieChart, LineChart, Wallet, CreditCard, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import './BehaviorInsight.css';

interface BehaviorInsightProps {
  behaviorType: string;
  spendingBreakdown: {
    category: string;
    percentage: number;
    change: number;
  }[];
  savingsRate: number;
  lastMonthChange: number;
}

const BehaviorInsight: React.FC<BehaviorInsightProps> = ({ 
  behaviorType, 
  spendingBreakdown, 
  savingsRate,
  lastMonthChange
}) => {
  // Helper function to get behavior type details
  const getBehaviorDetails = (type: string) => {
    switch(type) {
      case 'Saver':
        return {
          icon: <Wallet size={20} />,
          description: 'Prefers low-risk investments with consistent savings habits.',
          color: 'var(--success-500)'
        };
      case 'Risk-Taker':
        return {
          icon: <PieChart size={20} />,
          description: 'Favors high-risk investments with variable spending patterns.',
          color: 'var(--error-500)'
        };
      case 'Balanced':
        return {
          icon: <LineChart size={20} />,
          description: 'Maintains equilibrium between spending, saving and investing.',
          color: 'var(--primary-500)'
        };
      case 'Conservative':
        return {
          icon: <CreditCard size={20} />,
          description: 'Consistent spending with minimal investment risk tolerance.',
          color: 'var(--warning-500)'
        };
      case 'Investor':
        return {
          icon: <ArrowUpCircle size={20} />,
          description: 'Prioritizes portfolio growth with strategic financial planning.',
          color: 'var(--secondary-500)'
        };
      default:
        return {
          icon: <Wallet size={20} />,
          description: 'Financial behavior profile based on spending and investment patterns.',
          color: 'var(--primary-500)'
        };
    }
  };
  
  const behaviorDetails = getBehaviorDetails(behaviorType);
  
  return (
    <div className="behavior-insight-container">
      <div className="behavior-header">
        <h3>Spending Behavior Profile</h3>
      </div>
      
      <div className="behavior-type-card" style={{ borderColor: behaviorDetails.color }}>
        <div className="behavior-icon" style={{ backgroundColor: behaviorDetails.color }}>
          {behaviorDetails.icon}
        </div>
        <div className="behavior-content">
          <h4>{behaviorType} Profile</h4>
          <p>{behaviorDetails.description}</p>
        </div>
      </div>
      
      <div className="behavior-stats">
        <div className="stat-card">
          <div className="stat-title">Monthly Savings Rate</div>
          <div className="stat-value">{savingsRate}%</div>
          <div className={`stat-change ${lastMonthChange >= 0 ? 'positive' : 'negative'}`}>
            {lastMonthChange >= 0 ? 
              <ArrowUpCircle size={14} /> : 
              <ArrowDownCircle size={14} />
            }
            <span>{Math.abs(lastMonthChange)}% from last month</span>
          </div>
        </div>
      </div>
      
      <div className="spending-breakdown">
        <h4>Spending Breakdown</h4>
        
        <div className="breakdown-list">
          {spendingBreakdown.map((item, index) => (
            <div className="breakdown-item" key={index}>
              <div className="breakdown-category">
                <span>{item.category}</span>
                <span className="breakdown-percentage">{item.percentage}%</span>
              </div>
              <div className="breakdown-bar-container">
                <div 
                  className="breakdown-bar"
                  style={{ 
                    width: `${item.percentage}%`,
                    backgroundColor: index % 2 === 0 ? 'var(--primary-500)' : 'var(--secondary-500)'
                  }}
                ></div>
              </div>
              <div className={`breakdown-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                {item.change >= 0 ? 
                  <ArrowUpCircle size={12} /> : 
                  <ArrowDownCircle size={12} />
                }
                <span>{Math.abs(item.change)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BehaviorInsight;