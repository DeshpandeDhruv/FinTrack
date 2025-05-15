import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const authService = {
  async signup(username: string, email: string, password: string): Promise<AuthResponse> {
    console.log('Making signup request to:', `${API_URL}/signup`);
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        username,
        email,
        password,
      });
      console.log('Signup successful:', response.data);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('User session stored in localStorage');
      }
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('=== Login Request ===');
      console.log('Attempting login with:', { email });
      
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      
      console.log('Login response received:', response.data);
      
      if (response.data.token) {
        console.log('Storing user session...');
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('User session stored successfully');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message
        });
      }
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('user');
    console.log('User session cleared from localStorage');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      console.log('Retrieved user session from localStorage');
      return userData.user;
    }
    console.log('No active user session found');
    return null;
  },

  getToken(): string | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      return userData.token;
    }
    return null;
  },
}; 