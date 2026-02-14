import { useAuth } from '../contexts/AuthContext';
import { generateAIContext } from './knowledgeBase';
import { generateTrainingData } from './pageDataAggregator';

// Generate enhanced AI prompt with comprehensive knowledge base
export const generateAIPrompt = (userMessage: string): string => {
  const comprehensiveKnowledge = generateTrainingData();
  
  // Enhanced Hindi language detection
  const containsHindi = /[\u0900-\u097F]/.test(userMessage);
  const hindiWords = ['क्या', 'कैसे', 'कहाँ', 'कब', 'कौन', 'लोन', 'ऋण', 'पैसा', 'रुपये', 'बैंक', 'ब्याज', 'दर', 'आवेदन', 'मदद', 'सहायता'];
  const containsHindiWords = hindiWords.some(word => userMessage.includes(word));
  
  // Check if user is asking for language preference
  const isLanguageQuery = /^(hi|hello|hey|नमस्ते|हैलो)$/i.test(userMessage.trim());
  
  if (isLanguageQuery) {
    return `You are Finonest's AI assistant. When users greet you with just "hi", "hello", "hey", or "नमस्ते", respond with:

"🙏 Welcome to Finonest! 

Please choose your preferred language:
🇮🇳 हिंदी के लिए 'हिंदी' टाइप करें
🇬🇧 Type 'English' for English

फिनोनेस्ट में आपका स्वागत है! कृपया अपनी भाषा चुनें।"

User Message: ${userMessage}`;
  }
  
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
- LANGUAGE: ${containsHindi || containsHindiWords || userMessage.toLowerCase().includes('हिंदी') ? 'हिंदी में जवाब दें (देवनागरी लिपि में) क्योंकि उपयोगकर्ता हिंदी में बात कर रहा है। सभी जानकारी हिंदी में प्रदान करें।' : 'Respond in English as the user is communicating in English'}
- यदि उपयोगकर्ता हिंदी में पूछता है, तो पूरी तरह से हिंदी में जवाब दें। यदि अंग्रेजी में पूछता है, तो अंग्रेजी में जवाब दें।
- हिंदी उत्तरों में फिनोनेस्ट की सेवाओं के बारे में स्पष्ट और विस्तृत जानकारी दें।

User Question: ${userMessage}

Provide a helpful, detailed response based on the knowledge base above:`;
};

// Utility to fetch AI configuration from backend settings
export const getAIConfig = async () => {
  try {
    const authToken = localStorage.getItem('token');
    
    // Try admin settings first if authenticated
    if (authToken) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };

      const response = await fetch('https://api.finonest.com/api/settings', { headers });
      
      if (response.ok) {
        const data = await response.json();
        const settings = data.settings || [];
        
        const getSettingValue = (key: string) => {
          const setting = settings.find((s: any) => s.setting_key === key);
          return setting?.setting_value || '';
        };
        
        const apiKey = getSettingValue('gemini_api_key');
        const enabled = getSettingValue('ai_enabled') === 'enabled';
        
        return {
          apiKey: apiKey || '',
          model: getSettingValue('gemini_model') || 'gemini-1.5-flash',
          enabled: enabled && !!apiKey
        };
      }
    }
    
    // Fallback to public endpoint for non-authenticated users
    const publicResponse = await fetch('https://api.finonest.com/api/ai-config.php');
    
    if (publicResponse.ok) {
      const config = await publicResponse.json();
      return {
        apiKey: config.apiKey || '',
        model: config.model || 'gemini-1.5-flash',
        enabled: config.enabled && !!config.apiKey
      };
    }
    
    throw new Error('Failed to fetch AI config');
    
  } catch (error) {
    console.error('Failed to fetch AI config:', error);
    return {
      apiKey: '',
      model: 'gemini-1.5-flash',
      enabled: false
    };
  }
};

// Helper function to detect language preference
export const detectLanguagePreference = (message: string): 'hindi' | 'english' | 'unknown' => {
  const lowerMessage = message.toLowerCase().trim();
  
  if (lowerMessage === 'हिंदी' || lowerMessage === 'hindi') return 'hindi';
  if (lowerMessage === 'english' || lowerMessage === 'अंग्रेजी') return 'english';
  
  const containsHindi = /[\u0900-\u097F]/.test(message);
  const hindiWords = ['क्या', 'कैसे', 'कहाँ', 'कब', 'कौन', 'लोन', 'ऋण', 'पैसा', 'रुपये', 'बैंक', 'ब्याज', 'दर', 'आवेदन', 'मदद', 'सहायता'];
  const containsHindiWords = hindiWords.some(word => message.includes(word));
  
  if (containsHindi || containsHindiWords) return 'hindi';
  
  return 'unknown';
};