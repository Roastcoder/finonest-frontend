import { useAuth } from '../contexts/AuthContext';
import { generateAIContext } from './knowledgeBase';
import { generateTrainingData } from './pageDataAggregator';

// Generate enhanced AI prompt with comprehensive knowledge base
export const generateAIPrompt = (userMessage: string): string => {
  const comprehensiveKnowledge = generateTrainingData();
  
  return `You are an expert AI assistant for Finonest, India's fastest growing loan provider. You have been trained on comprehensive knowledge about all our services, processes, and policies.

${comprehensiveKnowledge}

IMPORTANT RESPONSE GUIDELINES:
- Use the comprehensive knowledge base above to provide accurate, detailed responses
- Be conversational, helpful, and professional
- Always relate responses back to Finonest's services and benefits
- Provide specific loan product details including rates, eligibility, and features when relevant
- Guide users through processes step-by-step
- Direct users to apply online at finonest.com or call +919462553887 for personalized assistance
- Mention that final rates and terms are subject to credit profile and approval
- Use emojis and formatting to make responses engaging
- If you don't have specific information, direct users to contact customer support
- Always emphasize Finonest's key advantages: transparency, quick approval, competitive rates, 50+ bank partners

User Question: ${userMessage}

Provide a helpful, detailed response based on the knowledge base above:`;
};

// Utility to fetch AI configuration from backend settings
export const getAIConfig = async () => {
  try {
    const authToken = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    };

    const response = await fetch('https://api.finonest.com/api/settings', { headers });
    
    if (!response.ok) {
      // For non-admin users, return basic enabled config
      return {
        apiKey: 'configured', // Placeholder to indicate it's configured
        model: 'gemini-1.5-flash',
        enabled: true // Enable for all users
      };
    }

    const data = await response.json();
    const settings = data.settings || [];
    
    const getSettingValue = (key: string) => {
      const setting = settings.find((s: any) => s.setting_key === key);
      return setting?.setting_value || '';
    };
    
    const apiKey = getSettingValue('gemini_api_key');
    const enabled = getSettingValue('ai_enabled') === 'enabled';
    
    return {
      apiKey: apiKey || 'configured',
      model: getSettingValue('gemini_model') || 'gemini-1.5-flash',
      enabled: enabled || true // Default to enabled if not set
    };
  } catch (error) {
    console.error('Failed to fetch AI config:', error);
    return {
      apiKey: 'configured',
      model: 'gemini-1.5-flash',
      enabled: true // Enable by default for chat users
    };
  }
};
