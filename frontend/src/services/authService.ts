import { API_BASE_URL, getAuthHeaders } from './config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'vendeur';
  phone?: string;
  storeName?: string;
  address?: string;
  storePhoto?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Register new user
export const register = async (data: {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'vendeur';
  phone?: string;
  storeName?: string;
  address?: string;
  storePhoto?: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const result = await response.json();
  
  // Store token
  localStorage.setItem('authToken', result.token);
  localStorage.setItem('user', JSON.stringify(result.user));
  
  return result;
};

// Login user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const result = await response.json();
  
  // Store token and user
  localStorage.setItem('authToken', result.token);
  localStorage.setItem('user', JSON.stringify(result.user));
  
  return result;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Get user profile from server
export const getProfile = async (): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
};

// Update user profile
export const updateProfile = async (data: {
  name?: string;
  phone?: string;
  storeName?: string;
  address?: string;
}): Promise<{ message: string; user: User }> => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Profile update failed');
  }

  const result = await response.json();
  
  // Update stored user
  localStorage.setItem('user', JSON.stringify(result.user));
  
  return result;
};
