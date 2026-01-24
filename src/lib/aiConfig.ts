// Utility to fetch AI configuration from backend settings
export const getAIConfig = async () => {
  try {
    // Fetch AI settings from backend
    const [apiKeyResponse, modelResponse, enabledResponse] = await Promise.all([
      fetch('https://api.finonest.com/api/settings/gemini_api_key'),
      fetch('https://api.finonest.com/api/settings/gemini_model'),
      fetch('https://api.finonest.com/api/settings/ai_enabled')
    ]);

    const apiKeyData = await apiKeyResponse.json();
    const modelData = await modelResponse.json();
    const enabledData = await enabledResponse.json();

    return {
      apiKey: apiKeyData.key || 'AIzaSyDZ8XZq09tzFqvuTAbcJlQscS_WUNDbkAI',
      model: modelData.key || 'gemini-2.5-flash-lite',
      enabled: enabledData.key === 'enabled'
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