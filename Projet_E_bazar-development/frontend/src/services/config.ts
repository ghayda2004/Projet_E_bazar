// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper to check if backend is available
const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Safe fetch wrapper with better error handling
const safeFetch = async (url: string, options?: RequestInit): Promise<Response | null> => {
  try {
    const response = await fetch(url, {
      ...options,
      signal: options?.signal || AbortSignal.timeout(10000), // 10 second timeout
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        console.error('Request timeout:', url);
      } else if (error.message.includes('Failed to fetch')) {
        console.error('Backend server is not available:', url);
      } else {
        console.error('Network error:', error.message);
      }
    }
    return null;
  }
};

export { API_BASE_URL, getAuthToken, getAuthHeaders, checkBackendHealth, safeFetch };
