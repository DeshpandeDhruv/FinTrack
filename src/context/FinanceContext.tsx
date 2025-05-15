import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockUserData, mockInflationData, mockMarketSentiment, mockRecommendations } from '../data/mockData';
import axios from 'axios';

type UserBehaviorType = 'Saver' | 'Risk-Taker' | 'Balanced' | 'Conservative' | 'Investor';

interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  risk_tolerance?: 'low' | 'medium' | 'high';
  spending_habits?: 'low' | 'medium' | 'high';
}

interface FinanceContextType {
  user: User | null;
  isAuthenticated: boolean;
  inflationForecast: any;
  marketSentiment: any;
  userBehaviorType: UserBehaviorType;
  recommendations: any[];
  notifications: any[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
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
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        determineUserBehaviorType(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('fintrack_user');
      }
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

  const determineUserBehaviorType = (userData: User) => {
    const risk_tolerance = userData.risk_tolerance || 'medium';
    const spending_habits = userData.spending_habits || 'medium';
    
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
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        determineUserBehaviorType(userData);
        localStorage.setItem('fintrack_user', JSON.stringify(userData));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error('Authentication failed');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fintrack_user');
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username: name,
        email,
        password
      });

      if (response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        determineUserBehaviorType(userData);
        localStorage.setItem('fintrack_user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error('User already exists');
        }
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw new Error('Registration failed');
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const response = await axios.put(`http://localhost:5000/api/users/${user.id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        determineUserBehaviorType(updatedUser);
        localStorage.setItem('fintrack_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      throw new Error('Profile update failed');
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const refreshData = async () => {
    try {
      // Fetch real inflation data
      const inflationResponse = await axios.get('http://localhost:5000/api/inflation/forecast');
      const forecastData = inflationResponse.data;
      
      // Transform the data to match the expected format
      const transformedForecast = {
        status: forecastData.status,
        data: forecastData.data.map((item: any) => ({
          date: item.date,
          value: item.value
        })),
        forecast: forecastData.forecast.map((item: any) => ({
          date: item.date,
          value: item.value,
          confidence: item.confidence
        }))
      };
      
      setInflationForecast(transformedForecast);

      // Get current and predicted interest rates
      const currentRate = forecastData.data[forecastData.data.length - 1]?.rate || 0;
      const previousRate = forecastData.data[forecastData.data.length - 2]?.rate || 0;
      const predictedRate = forecastData.forecast[0]?.rate || currentRate;
      const rateChange = currentRate - previousRate;
      
      // Update market sentiment with real interest rate data
      const updatedSentiment = {
        ...mockMarketSentiment,
        interestRate: {
          current: currentRate,
          predicted: predictedRate,
          change: rateChange,
          trend: rateChange > 0 ? 'up' : rateChange < 0 ? 'down' : 'neutral'
        },
        sectors: mockMarketSentiment.sectors.map(sector => ({
          ...sector,
          sentiment: sector.sentiment * (0.9 + Math.random() * 0.2)
        }))
      };
      
      setMarketSentiment(updatedSentiment);
    } catch (error) {
      console.error('Error refreshing data:', error);
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

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};