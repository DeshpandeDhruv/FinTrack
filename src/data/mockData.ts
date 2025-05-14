// Mock data for user
export const mockUserData = {
  id: '1',
  name: 'Alex Johnson',
  email: 'demo@fintrack.com',
  risk_tolerance: 'medium',
  spending_habits: 'medium',
  income_range: '$50,000 - $100,000',
  savings_goal: 'Retirement',
  savings_rate: 15,
  profile_complete: 80,
  joined_date: '2023-01-15'
};

// Mock data for inflation forecast
export const mockInflationData = {
  status: 'Moderate Concern',
  data: [
    { date: '2023-01-01', value: 6.5 },
    { date: '2023-02-01', value: 6.4 },
    { date: '2023-03-01', value: 6.0 },
    { date: '2023-04-01', value: 5.7 },
    { date: '2023-05-01', value: 5.3 },
    { date: '2023-06-01', value: 5.0 }
  ],
  forecast: [
    { 
      date: '2023-07-01', 
      value: 4.8,
      confidence: {
        upper: 5.2,
        lower: 4.4
      }
    },
    { 
      date: '2023-08-01', 
      value: 4.6,
      confidence: {
        upper: 5.1,
        lower: 4.1
      }
    },
    { 
      date: '2023-09-01', 
      value: 4.4,
      confidence: {
        upper: 5.0,
        lower: 3.8
      }
    },
    { 
      date: '2023-10-01', 
      value: 4.2,
      confidence: {
        upper: 4.9,
        lower: 3.5
      }
    }
  ]
};

// Mock data for market sentiment
export const mockMarketSentiment = {
  overall: 0.32, // -1 to 1 scale
  status: 'Cautiously Optimistic',
  sectors: [
    {
      name: 'Technology',
      sentiment: 0.68,
      change: 0.15,
      keywords: ['innovation', 'growth', 'AI']
    },
    {
      name: 'Financial Services',
      sentiment: 0.35,
      change: -0.08,
      keywords: ['stability', 'interest rates', 'regulation']
    },
    {
      name: 'Healthcare',
      sentiment: 0.52,
      change: 0.12,
      keywords: ['research', 'biotech', 'innovation']
    },
    {
      name: 'Energy',
      sentiment: -0.22,
      change: -0.35,
      keywords: ['volatility', 'transition', 'regulation']
    },
    {
      name: 'Consumer Goods',
      sentiment: 0.18,
      change: 0.05,
      keywords: ['inflation', 'spending', 'retail']
    },
    {
      name: 'Real Estate',
      sentiment: -0.15,
      change: -0.10,
      keywords: ['interest rates', 'housing', 'commercial']
    }
  ]
};

// Mock recommendations
export const mockRecommendations = [
  {
    id: '1',
    title: 'Increase retirement contributions',
    description: 'Based on your current savings rate and inflation projections, consider increasing your retirement contributions by 3% to maintain your target retirement income.',
    impact: 'high' as const,
    category: 'saving' as const,
    actionLink: '/simulator'
  },
  {
    id: '2',
    title: 'Diversify tech investments',
    description: 'Technology sector sentiment is positive, but your portfolio is heavily weighted. Consider diversifying into healthcare which also shows strong sentiment.',
    impact: 'medium' as const,
    category: 'investment' as const,
    actionLink: '/market-search'
  },
  {
    id: '3',
    title: 'Inflation-proof your budget',
    description: 'With inflation projected to remain above 4%, review your budget for areas that might be most affected, such as groceries and energy costs.',
    impact: 'high' as const,
    category: 'alert' as const,
    actionLink: '/simulator'
  },
  {
    id: '4',
    title: 'Optimize entertainment spending',
    description: 'Your entertainment spending has increased by 15%. Consider reviewing subscription services to identify potential savings without reducing enjoyment.',
    impact: 'low' as const,
    category: 'spending' as const
  }
];