// Utility to fetch AI configuration from backend settings
export const getAIConfig = async () => {
  try {
    // Get auth token (adjust based on your auth implementation)
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
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