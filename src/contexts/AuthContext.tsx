import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Set up axios defaults using environment variable
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  axios.defaults.baseURL = apiUrl;
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  // Configure axios response interceptor for better error handling
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        throw new Error(error.response.data.message || 'An error occurred with the request');
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Unable to connect to the server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request
        throw new Error('An error occurred while processing your request.');
      }
    }
  );

  // Check if token exists and set up authentication state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          try {
            const decoded: any = jwtDecode(token);
            
            if (decoded.exp * 1000 < Date.now()) {
              localStorage.removeItem('token');
              setIsAuthenticated(false);
              setUser(null);
            } else {
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              
              const response = await axios.get('/users/me');
              setUser(response.data);
              setIsAuthenticated(true);
            }
          } catch (error) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response = await axios.post('/auth/register', { 
        firstName, 
        lastName, 
        email, 
        password 
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        throw new Error('Unable to connect to the server. Please check if the server is running and try again.');
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email: string) => {
    try {
      await axios.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await axios.post(`/auth/reset-password`, { token, password });
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await axios.put('/users/password', { currentPassword, newPassword });
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};