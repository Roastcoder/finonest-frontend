import { useAuth } from '../contexts/AuthContext';

// Utility to fetch AI configuration from backend settings
export const getAIConfig = async (token?: string) => {
  try {
    // Use provided token or get from localStorage
    const authToken = token || localStorage.getItem('token');
    
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };

    // Fetch AI settings from backend
    const [apiKeyResponse, modelResponse, enabledResponse] = await Promise.all([
      fetch('https://api.finonest.com/api/settings/gemini_api_key', { headers }),
      fetch('https://api.finonest.com/api/settings/gemini_model', { headers }),
      fetch('https://api.finonest.com/api/settings/ai_enabled', { headers })
    ]);

    // Check if requests were successful
    if (!apiKeyResponse.ok || !modelResponse.ok || !enabledResponse.ok) {
      throw new Error('Failed to fetch settings - authentication required');
    }

    const apiKeyData = await apiKeyResponse.json();
    const modelData = await modelResponse.json();
    const enabledData = await enabledResponse.json();

    return {
      apiKey: apiKeyData.key || 'AIzaSyDZ8XZq09tzFqvuTAbcJlQscS_WUNDbkAI',
      model: modelData.key || 'gemini-2.5-flash-lite',
      enabled: (enabledData.key === 'enabled') || true
    };
  } catch (error) {
    console.error('Failed to fetch AI config:', error);
    // Return defaults if fetch fails
    return {
      apiKey: 'AIzaSyDZ8XZq09tzFqvuTAbcJlQscS_WUNDbkAI',
      model: 'gemini-2.5-flash-lite',
      enabled: true
    };
  }
};

// React hook version for use in components
export const useAIConfig = () => {
  const { token } = useAuth();
  
  const fetchConfig = async () => {
    if (!token) {
      throw new Error('User not authenticated');
    }
    return getAIConfig(token);
  };
  
  return { fetchConfig };
};