import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import './MarketSentiment.css';

interface MarketSentimentProps {
  overallSentiment: number;
  sectors: {
    name: string;
    sentiment: number;
    change: number;
    keywords: string[];
  }[];
}

const MarketSentiment: React.FC<MarketSentimentProps> = ({ overallSentiment, sectors }) => {
  // Helper function to determine sentiment class and icon
  const getSentimentInfo = (value: number) => {
    if (value > 0.7) return { class: 'very-positive', icon: <TrendingUp size={16} /> };
    if (value > 0.3) return { class: 'positive', icon: <TrendingUp size={16} /> };
    if (value > -0.3) return { class: 'neutral', icon: <ArrowRight size={16} /> };
    if (value > -0.7) return { class: 'negative', icon: <TrendingDown size={16} /> };
    return { class: 'very-negative', icon: <TrendingDown size={16} /> };
  };
  
  // Sort sectors by sentiment score (highest first)
  const sortedSectors = [...sectors].sort((a, b) => b.sentiment - a.sentiment);
  
  // Get top 5 sectors
  const topSectors = sortedSectors.slice(0, 5);
  
  // Get overall sentiment info
  const overallInfo = getSentimentInfo(overallSentiment);
  
  return (
    <div className="market-sentiment-container">
      <div className="sentiment-header">
        <h3>Market Sentiment Analysis</h3>
        <div className={`overall-sentiment ${overallInfo.class}`}>
          <span>Overall Market: </span>
          {overallInfo.icon}
          <span>{(overallSentiment * 100).toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="sectors-list">
        {topSectors.map((sector, index) => {
          const sentimentInfo = getSentimentInfo(sector.sentiment);
          
          return (
            <div className="sector-card" key={index}>
              <div className="sector-header">
                <h4>{sector.name}</h4>
                <div className={`sector-sentiment ${sentimentInfo.class}`}>
                  {sentimentInfo.icon}
                  <span>{(sector.sentiment * 100).toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="sector-indicators">
                <div className="sentiment-bar-container">
                  <div 
                    className={`sentiment-bar ${sentimentInfo.class}`}
                    style={{ width: `${Math.abs(sector.sentiment * 100)}%`, marginLeft: sector.sentiment < 0 ? 'auto' : 0 }}
                  ></div>
                </div>
                
                <div className="sector-change">
                  <span>Change: </span>
                  <span className={sector.change >= 0 ? 'positive' : 'negative'}>
                    {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="sector-keywords">
                {sector.keywords.map((keyword, kIndex) => (
                  <span className="keyword" key={kIndex}>{keyword}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketSentiment;