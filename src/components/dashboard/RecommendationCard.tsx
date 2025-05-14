import React, { useState } from 'react';
import { ArrowRight, ThumbsUp, ThumbsDown, BookmarkCheck, Lightbulb } from 'lucide-react';
import './RecommendationCard.css';

interface RecommendationCardProps {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'investment' | 'saving' | 'spending' | 'alert';
  actionLink?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  impact,
  category,
  actionLink
}) => {
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  
  // Get icon based on category
  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'investment':
        return <BookmarkCheck size={18} />;
      case 'saving':
        return <ThumbsUp size={18} />;
      case 'spending':
        return <ArrowRight size={18} />;
      case 'alert':
        return <Lightbulb size={18} />;
      default:
        return <BookmarkCheck size={18} />;
    }
  };
  
  // Get color based on category
  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'investment':
        return 'var(--primary-500)';
      case 'saving':
        return 'var(--success-500)';
      case 'spending':
        return 'var(--secondary-500)';
      case 'alert':
        return 'var(--warning-500)';
      default:
        return 'var(--primary-500)';
    }
  };
  
  // Get impact label styling
  const getImpactStyle = (imp: string) => {
    switch(imp) {
      case 'high':
        return { 
          color: 'var(--success-500)',
          background: 'rgba(34, 197, 94, 0.1)'
        };
      case 'medium':
        return { 
          color: 'var(--warning-500)',
          background: 'rgba(245, 158, 11, 0.1)'
        };
      case 'low':
        return { 
          color: 'var(--neutral-400)',
          background: 'rgba(100, 116, 139, 0.1)'
        };
      default:
        return { 
          color: 'var(--neutral-400)',
          background: 'rgba(100, 116, 139, 0.1)'
        };
    }
  };
  
  const impactStyle = getImpactStyle(impact);
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);
  
  return (
    <div className="recommendation-card" style={{ borderLeftColor: categoryColor }}>
      <div className="rec-card-header">
        <div className="rec-category" style={{ color: categoryColor }}>
          {categoryIcon}
          <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
        </div>
        <div className="rec-impact" style={impactStyle}>
          {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
        </div>
      </div>
      
      <h4 className="rec-title">{title}</h4>
      <p className="rec-description">{description}</p>
      
      <div className="rec-actions">
        {actionLink && (
          <a href={actionLink} className="rec-action-link">
            Learn More <ArrowRight size={14} />
          </a>
        )}
        
        <div className="rec-feedback">
          <button 
            className={`feedback-btn ${feedback === 'helpful' ? 'active' : ''}`}
            onClick={() => setFeedback('helpful')}
            aria-label="Mark as helpful"
          >
            <ThumbsUp size={14} />
          </button>
          <button 
            className={`feedback-btn ${feedback === 'not-helpful' ? 'active' : ''}`}
            onClick={() => setFeedback('not-helpful')}
            aria-label="Mark as not helpful"
          >
            <ThumbsDown size={14} />
          </button>
          <button 
            className={`save-btn ${saved ? 'saved' : ''}`}
            onClick={() => setSaved(!saved)}
            aria-label={saved ? 'Remove from saved' : 'Save recommendation'}
          >
            <BookmarkCheck size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;