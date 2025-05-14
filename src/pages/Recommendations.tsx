import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import RecommendationCard from '../components/dashboard/RecommendationCard';
import './Recommendations.css';

type Impact = 'high' | 'medium' | 'low';
type Category = 'investment' | 'saving' | 'spending' | 'alert';

interface Recommendation {
  title: string;
  description: string;
  impact: Impact;
  category: Category;
  actionLink?: string;
}

const Recommendations: React.FC = () => {
  const { recommendations } = useFinance();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = ['all', 'investment', 'saving', 'spending', 'alert'];
  const impacts = ['all', 'high', 'medium', 'low'];

  const filteredRecommendations = (recommendations as Recommendation[])
    .filter(rec => selectedCategory === 'all' || rec.category === selectedCategory)
    .filter(rec => selectedImpact === 'all' || rec.impact === selectedImpact)
    .sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      const order = sortOrder === 'asc' ? 1 : -1;
      return (impactOrder[a.impact] - impactOrder[b.impact]) * order;
    });

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h1>Personalized Recommendations</h1>
        <p>Custom financial guidance based on your profile and market conditions</p>
      </div>
      
      <div className="recommendations-filters">
        <div className="filter-group">
          <Filter size={18} />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select 
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="filter-select"
          >
            {impacts.map(impact => (
              <option key={impact} value={impact}>
                {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
              </option>
            ))}
          </select>
        </div>

        <button 
          className="sort-button"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
          Sort by Impact
        </button>
      </div>

      <div className="recommendations-grid">
        {filteredRecommendations.map((rec, index) => (
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

      {filteredRecommendations.length === 0 && (
        <div className="no-recommendations">
          <p>No recommendations match your current filters.</p>
          <button 
            className="reset-filters"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedImpact('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Recommendations;