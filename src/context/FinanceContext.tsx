import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockUserData, mockInflationData, mockMarketSentiment, mockRecommendations } from '../data/mockData';

type UserBehaviorType = 'Saver' | 'Risk-Taker' | 'Balanced' | 'Conservative' | 'Investor';

interface FinanceContextType {
  user: any;
  isAuthenticated: boolean;
  inflationForecast: any;
  marketSentiment: any;
  userBehaviorType: UserBehaviorType;
  recommendations: any[];
  notifications: any[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  refreshData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inflationForecast, setInflationForecast] = useState<any>(mockInflationData);
  const [marketSentiment, setMarketSentiment] = useState<any>(mockMarketSentiment);
  const [userBehaviorType, setUserBehaviorType] = useState<UserBehaviorType>('Balanced');
  const [recommendations, setRecommendations] = useState<any[]>(mockRecommendations);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('fintrack_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    // Load notifications
    const mockNotifications = [
      {
        id: '1',
        title: 'Inflation Alert',
        message: 'Inflation is projected to rise by 0.5% next month. Consider adjusting your investments.',
        type: 'alert',
        read: false,
        date: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        title: 'Market Sentiment Shift',
        message: 'Technology sector sentiment has improved significantly. Review your tech portfolio.',
        type: 'insight',
        read: false,
        date: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        title: 'Spending Pattern Alert',
        message: 'Your entertainment spending has increased by 15% this month.',
        type: 'alert',
        read: true,
        date: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const userData = mockUserData;
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('fintrack_user', JSON.stringify(userData));
          resolve();
        }, 1000);
      });
    } catch (error) {
      throw new Error('Authentication failed');
    }
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fintrack_user');
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const userData = { ...mockUserData, name, email };
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('fintrack_user', JSON.stringify(userData));
          resolve();
        }, 1000);
      });
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  // Mock update profile function
  const updateUserProfile = async (data: any) => {
    try {
      // In a real app, this would be an API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const updatedUser = { ...user, ...data };
          setUser(updatedUser);
          localStorage.setItem('fintrack_user', JSON.stringify(updatedUser));
          
          // Determine behavior type based on updated profile
          const risk_tolerance = data.risk_tolerance || user.risk_tolerance;
          const spending_habits = data.spending_habits || user.spending_habits;
          
          let behaviorType: UserBehaviorType = 'Balanced';
          
          if (risk_tolerance === 'high' && spending_habits === 'low') {
            behaviorType = 'Investor';
          } else if (risk_tolerance === 'low' && spending_habits === 'low') {
            behaviorType = 'Saver';
          } else if (risk_tolerance === 'high' && spending_habits === 'high') {
            behaviorType = 'Risk-Taker';
          } else if (risk_tolerance === 'low' && spending_habits === 'high') {
            behaviorType = 'Conservative';
          }
          
          setUserBehaviorType(behaviorType);
          resolve();
        }, 1000);
      });
    } catch (error) {
      throw new Error('Profile update failed');
    }
  };

  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Refresh all data
  const refreshData = async () => {
    try {
      // In a real app, these would be separate API calls
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Randomize the mock data slightly
          const updatedInflation = {
            ...mockInflationData,
            data: mockInflationData.data.map(item => ({
              ...item,
              value: item.value * (0.95 + Math.random() * 0.1)
            }))
          };
          
          const updatedSentiment = {
            ...mockMarketSentiment,
            sectors: mockMarketSentiment.sectors.map(sector => ({
              ...sector,
              sentiment: sector.sentiment * (0.9 + Math.random() * 0.2)
            }))
          };
          
          setInflationForecast(updatedInflation);
          setMarketSentiment(updatedSentiment);
          resolve();
        }, 1500);
      });
    } catch (error) {
      throw new Error('Data refresh failed');
    }
  };

  const value = {
    user,
    isAuthenticated,
    inflationForecast,
    marketSentiment,
    userBehaviorType,
    recommendations,
    notifications,
    login,
    logout,
    register,
    updateUserProfile,
    markNotificationAsRead,
    refreshData
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};