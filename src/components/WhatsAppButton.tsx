<<<<<<< HEAD
import { X, Send, Bot, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getAIConfig, generateAIPrompt } from "@/lib/aiConfig";
import { askFinonestRAG, OLLAMA_MODELS } from "@/lib/ollamaRAG";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [languageSelected, setLanguageSelected] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'hindi' | 'english' | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🙏 Welcome to Finonest AI Assistant!\n\nPlease choose your preferred language:',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiConfig, setAiConfig] = useState({ apiKey: '', model: 'gemini-1.5-flash', enabled: false });
  const [useOllama, setUseOllama] = useState(false);
  const [ollamaModel, setOllamaModel] = useState('llama3.1:8b');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load AI configuration on component mount
    getAIConfig().then(config => {
      console.log('AI Config loaded:', config);
      
      // Auto-switch to Ollama if Gemini is disabled or has no API key
      if (!config.enabled || !config.apiKey) {
        console.log('Gemini unavailable, auto-switching to Ollama');
        setUseOllama(true);
      }
      
      // If the public endpoint returns disabled, try to use admin settings
      if (!config.enabled || !config.apiKey) {
        console.log('Public endpoint disabled, trying admin settings...');
        
        // Try to get admin settings if user has token
        const authToken = localStorage.getItem('token');
        if (authToken) {
          fetch('https://api.finonest.com/api/settings', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            }
          })
          .then(response => response.json())
          .then(data => {
            if (data.settings) {
              const settings = data.settings;
              const getSettingValue = (key: string) => {
                const setting = settings.find((s: any) => s.setting_key === key);
                return setting?.setting_value || '';
              };
              
              const adminConfig = {
                apiKey: getSettingValue('gemini_api_key'),
                model: getSettingValue('gemini_model') || 'gemini-1.5-flash',
                enabled: getSettingValue('ai_enabled') === 'enabled'
              };
              
              console.log('Admin config loaded:', adminConfig);
              if (adminConfig.enabled && adminConfig.apiKey) {
                setAiConfig(adminConfig);
                return;
              }
            }
            
            // If admin settings also fail, use the original config
            setAiConfig(config);
          })
          .catch(error => {
            console.error('Failed to load admin settings:', error);
            setAiConfig(config);
          });
        } else {
          setAiConfig(config);
        }
      } else {
        setAiConfig(config);
      }
    });
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  const handleLanguageSelect = (language: 'hindi' | 'english') => {
    setLanguageSelected(true);
    setSelectedLanguage(language);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: language === 'hindi' ? '🇮🇳 हिंदी' : '🇬🇧 English',
      isUser: true,
      timestamp: new Date()
    };
    
    const welcomeMessage = language === 'hindi'
      ? '🙏 धन्यवाद! मैं फिनोनेस्ट का AI सहायक हूँ। मैं केवल फिनोनेस्ट की लोन सेवाओं के बारे में मदद कर सकता हूँ - होम लोन, पर्सनल लोन, बिज़नेस लोन, कार लोन, और क्रेडिट कार्ड। विस्तृत जानकारी के लिए, आप WhatsApp पर जारी रख सकते हैं!'
      : '🙏 Thank you! I\'m your Finonest AI assistant. I can only help with questions about Finonest\'s loan services - Home Loans, Personal Loans, Business Loans, Car Loans, and Credit Cards. For detailed information, you can continue on WhatsApp!';
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: welcomeMessage,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
  };

  const sendToAI = async (message: string): Promise<string> => {
    // Try Ollama first if enabled or if Gemini fails
    if (useOllama) {
      try {
        console.log('Using Ollama RAG with model:', ollamaModel);
        const response = await askFinonestRAG(message, selectedLanguage || 'english', ollamaModel);
        return response;
      } catch (error) {
        console.error('Ollama failed:', error);
        // Auto-switch to Gemini if Ollama fails
        setUseOllama(false);
      }
    }
    
    // Try Gemini API with auto-switch models
    try {
      return await sendToGemini(message);
    } catch (error) {
      console.error('Gemini failed, switching to Ollama:', error);
      // Auto-switch to Ollama if all Gemini models fail
      setUseOllama(true);
      return await askFinonestRAG(message, selectedLanguage || 'english', ollamaModel);
    }
  };

  const sendToGemini = async (message: string): Promise<string> => {
    // Always try to get fresh config
    const currentConfig = await getAIConfig();
    console.log('Current AI config:', currentConfig);
    
    if (!currentConfig.enabled && !currentConfig.apiKey) {
      return selectedLanguage === 'hindi' 
        ? 'AI सुविधा वर्तमान में अनुपलब्ध है। कृपया हमारी सपोर्ट टीम से +91 9462553887 पर संपर्क करें।'
        : 'AI features are currently disabled. Please contact our support team at +91 9462553887.';
    }

    // Auto-switch models if quota exceeded
    const fallbackModels = [
      'gemini-1.5-flash', 
      'gemini-1.5-pro', 
      'gemini-2.0-flash', 
      'gemini-2.5-flash', 
      'gemini-pro-latest', 
      'gemini-flash-latest',
      'gemini-pro',
      'gemini-1.0-pro'
    ];
    let modelToUse = currentConfig.model;
    
    for (let attempt = 0; attempt < fallbackModels.length + 1; attempt++) {
      try {
        // Simple direct prompt
        const prompt = selectedLanguage === 'hindi'
          ? `आप फिनोनेस्ट के AI सहायक हैं। हिंदी में जवाब दें। फिनोनेस्ट भारत की सबसे तेजी से बढ़ने वाली लोन कंपनी है। हम होम लोन (7.3% से), पर्सनल लोन (9.99% से), बिजनेस लोन (11% से), कार लोन (8.5% से) प्रदान करते हैं। प्रश्न: ${message}`
          : `You are Finonest's AI assistant. Respond in English. Finonest is India's fastest growing loan provider. We offer Home Loans (from 7.3%), Personal Loans (from 9.99%), Business Loans (from 11%), Car Loans (from 8.5%). Question: ${message}`;

        console.log('Trying model:', modelToUse);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${currentConfig.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        });

        console.log('API Response status:', response.status);
        
        if (response.status === 429 && attempt < fallbackModels.length) {
          // Quota exceeded, try next model
          modelToUse = fallbackModels[attempt];
          console.log('Quota exceeded, switching to:', modelToUse);
          continue;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', response.status, errorText);
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);
        
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 
          (selectedLanguage === 'hindi' 
            ? 'मुझे खेद है, मैं आपकी मदद नहीं कर सका। कृपया +91 9462553887 पर संपर्क करें।'
            : 'I apologize, I couldn\'t help with that. Please contact +91 9462553887.');
            
      } catch (error) {
        console.error(`Error with model ${modelToUse}:`, error);
        if (attempt < fallbackModels.length) {
          modelToUse = fallbackModels[attempt];
          console.log('Switching to fallback model:', modelToUse);
          continue;
        }
      }
    }
    
    // All models failed
    return selectedLanguage === 'hindi'
      ? 'तकनीकी समस्या है। कृपया +91 9462553887 पर संपर्क करें।'
      : 'Technical issue. Please contact +91 9462553887.';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Check if this is language selection
    const lowerInput = inputMessage.toLowerCase().trim();
    if (!languageSelected && (lowerInput === 'hindi' || lowerInput === 'हिंदी' || lowerInput === 'english' || lowerInput === 'अंग्रेजी')) {
      setLanguageSelected(true);
      const isHindi = lowerInput === 'hindi' || lowerInput === 'हिंदी';
      
      const welcomeMessage = isHindi 
        ? '🙏 धन्यवाद! मैं फिनोनेस्ट का AI सहायक हूँ। मैं केवल फिनोनेस्ट की लोन सेवाओं के बारे में मदद कर सकता हूँ - होम लोन, पर्सनल लोन, बिज़नेस लोन, कार लोन, और क्रेडिट कार्ड। विस्तृत जानकारी के लिए, आप WhatsApp पर जारी रख सकते हैं!'
        : '🙏 Thank you! I\'m your Finonest AI assistant. I can only help with questions about Finonest\'s loan services - Home Loans, Personal Loans, Business Loans, Car Loans, and Credit Cards. For detailed information, you can continue on WhatsApp!';
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: welcomeMessage,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setInputMessage('');
      return;
    }

    setInputMessage('');
    setIsLoading(true);

    const aiResponse = await sendToAI(inputMessage);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-2 lg:right-6 z-30 flex flex-col items-end gap-4">
      {/* Chat Popup */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden w-80 h-[500px] animate-slide-up flex flex-col backdrop-blur-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm overflow-hidden">
              <img 
                src="/assets/finonest-icon.jpg" 
                alt="Finonest AI" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <Bot className="w-6 h-6 text-white" style={{ display: 'none' }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white">Finonest AI Assistant</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 scroll-smooth"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
                    <img 
                      src="/assets/finonest-icon.jpg" 
                      alt="AI" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <Bot className="w-4 h-4 text-white" style={{ display: 'none' }} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 opacity-70 ${
                    message.isUser ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Language Selection Buttons */}
            {!languageSelected && messages.length === 1 && (
              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={() => handleLanguageSelect('hindi')}
                  className="w-full p-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🇮🇳 हिंदी (Hindi)
                </button>
                <button
                  onClick={() => handleLanguageSelect('english')}
                  className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🇬🇧 English
                </button>
              </div>
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
                  <img 
                    src="/assets/finonest-icon.jpg" 
                    alt="AI" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <Bot className="w-4 h-4 text-white" style={{ display: 'none' }} />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            {/* Invisible div for auto-scroll target */}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Finonest loans & services..."
                  className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* WhatsApp Option */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  const message = "Hi Finonest Team, I need assistance with loan information.";
                  const url = `https://api.whatsapp.com/send/?phone=919462553887&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
                  window.open(url, "_blank");
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Continue on WhatsApp
              </button>
            </div>
=======
import { X } from "lucide-react";
import { useState } from "react";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const defaultMessage = "Hi Finonest Team, I need assistance.";

  const handleWhatsAppClick = () => {
    const url = `https://api.whatsapp.com/send/?phone=919462553887&text=${encodeURIComponent(defaultMessage)}&type=phone_number&app_absent=0`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 flex flex-col items-end gap-3">
      {/* Chat Popup */}
      {isOpen && (
        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden w-80 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-primary p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-2xl">🏦</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-primary-foreground">Finonest Support</h4>
              <p className="text-xs text-primary-foreground/80">Typically replies within minutes</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
            >
              <X className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-muted/30">
            <div className="bg-card rounded-xl p-3 shadow-sm border border-border">
              <p className="text-sm text-foreground">
                👋 Hi there! Looking for a loan? Our experts are ready to help you find the best rates.
              </p>
              <span className="text-xs text-muted-foreground mt-2 block">Just now</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleWhatsAppClick}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Start Chat on WhatsApp
            </button>
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
<<<<<<< HEAD
        className="group relative w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-all duration-300 hover:scale-110 transform"
      >
        {/* Pulse Ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" />
        )}
        
        <span className="relative flex items-center justify-center overflow-hidden rounded-full">
          {isOpen ? (
            <X className="w-4 h-4 text-red-500 transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <>
              <img 
                src="/assets/finonest-icon.jpg" 
                alt="Finonest AI" 
                className="w-8 h-8 object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <Bot className="w-5 h-5 text-blue-500 transition-transform duration-200 group-hover:scale-110" style={{ display: 'none' }} />
            </>
=======
        className={`group relative w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-[#25D366] hover:bg-[#20BD5A]"
        }`}
      >
        {/* Pulse Ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        )}
        
        <span className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
          )}
        </span>

        {/* Notification Badge */}
        {!isOpen && (
<<<<<<< HEAD
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-lg">
            AI
=======
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background">
            1
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
          </span>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
<<<<<<< HEAD
        <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg">
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          Chat with Finonest AI Assistant!
=======
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us!
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;
