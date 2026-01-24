import { X, Send, Bot, User } from "lucide-react";
import { useState, useEffect } from "react";
import { getAIConfig } from "@/lib/aiConfig";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Hi! I\'m your Finonest AI assistant. I can only help with questions about Finonest\'s loan services - Home Loans, Personal Loans, Business Loans, Car Loans, and Credit Cards. For detailed information, you can continue on WhatsApp!',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiConfig, setAiConfig] = useState({ apiKey: '', model: '', enabled: true });

  useEffect(() => {
    // Load AI configuration on component mount
    getAIConfig().then(setAiConfig);
  }, []);

  const sendToGemini = async (message: string): Promise<string> => {
    if (!aiConfig.enabled) {
      return 'AI features are currently disabled. Please contact our support team at +91 9462553887.';
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiConfig.model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': aiConfig.apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Finonest's official AI assistant with web search capabilities. You can search for current finance and loan information from the web, but ONLY provide information related to:
              1. Finonest's services and company information
              2. General finance and loan topics (interest rates, loan types, eligibility criteria)
              3. Current financial market trends
              
              DO NOT provide information about other specific companies or competitors.
              
              About Finonest:
              Finonest is a leading financial services company that helps customers find the best loan options. We work with multiple banks and NBFCs to provide competitive rates and quick approvals.
              
              Meet the Visionary Leaders:
              
              Surya Mohan Roy - Managing Director and Founder:
              The visionary leader behind Finonest's purpose, culture, and long-term strategy. With strong entrepreneurial insight and commitment to innovation, he established the organization with goals of delivering excellence, trust, and value in every service.
              
              Sanam Makkar - Director & Chief Technology Officer (CTO):
              Leads technology vision, product innovation, and digital transformation initiatives. Oversees product development, system architecture, cybersecurity, and cloud infrastructure.
              
              CA Prateek Somani - Chief Financial Officer:
              Leads financial strategy with precision, overseeing budgeting, financial planning, compliance, and risk management for long-term stability.
              
              Prateek Rathore - Executive Director (Sales):
              Leads sales strategy and revenue growth initiatives, overseeing business development, client acquisition, and market expansion.
              
              Atishay Jain - Co-Founder and Director:
              Plays pivotal role in shaping vision, culture, and strategy. Oversees key operations, drives innovation, and ensures seamless execution across teams.
              
              Finonest offers:
              - Home Loans
              - Personal Loans  
              - Business Loans
              - Car Loans
              - Loan Against Property
              - Credit Cards
              - Used Car Loans
              
              Key Benefits:
              - Quick loan approvals
              - Competitive interest rates
              - Multiple banking partners
              - Expert guidance
              - Simple application process
              
              You can provide general finance information and current market trends. If asked about specific Finonest details not available, direct to finonest.com or contact team.
              
              User question: ${message}`
            }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I don\'t have that specific information available. Please check our website at finonest.com or contact our team directly at +91 9462553887.';
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'I don\'t have that information available right now. Please visit finonest.com or contact our support team at +91 9462553887.';
    }
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
    setInputMessage('');
    setIsLoading(true);

    const aiResponse = await sendToGemini(inputMessage);
    
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
    <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 flex flex-col items-end gap-3">
      {/* Chat Popup */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden w-80 h-[500px] animate-slide-up flex flex-col backdrop-blur-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white">Finonest AI Assistant</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-white/80">Online • Powered by Gemini AI</p>
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
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-4 h-4 text-white" />
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
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-4 h-4 text-white" />
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
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-16 h-16 lg:w-18 lg:h-18 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 transform ${
          isOpen 
            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        }`}
      >
        {/* Pulse Ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-ping opacity-30" />
        )}
        
        <span className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-7 h-7 text-white transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <Bot className="w-7 h-7 text-white transition-transform duration-200 group-hover:scale-110" />
          )}
        </span>

        {/* Notification Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-lg animate-bounce">
            AI
          </span>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg">
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          Chat with Finonest AI Assistant!
        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;
