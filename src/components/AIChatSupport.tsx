import { X, Send, Bot, User } from "lucide-react";
import { useState } from "react";
import { generateAIPrompt, getAIConfig } from "@/lib/aiConfig";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [languageSelected, setLanguageSelected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🙏 Welcome to Finonest AI Assistant!\n\nPlease choose your preferred language:\n🇮🇳 हिंदी के लिए \'हिंदी\' टाइप करें\n🇬🇧 Type \'English\' for English\n\nफिनोनेस्ट में आपका स्वागत है! कृपया अपनी भाषा चुनें।',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendToGemini = async (message: string): Promise<string> => {
    try {
      // Get AI configuration
      const config = await getAIConfig();
      
      if (!config.enabled) {
        return 'AI chat is currently unavailable. Please contact our support team at +919462553887 for assistance.';
      }

      // Generate enhanced prompt with knowledge base
      const enhancedPrompt = generateAIPrompt(message);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: enhancedPrompt
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

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I couldn\'t process your request. Please try rephrasing your question or contact our support team at +919462553887.';
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'I\'m having trouble connecting right now. Please try again in a moment or contact our support team directly at +919462553887 for immediate assistance.';
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
    
    // Check if this is language selection
    const lowerInput = inputMessage.toLowerCase().trim();
    if (!languageSelected && (lowerInput === 'hindi' || lowerInput === 'हिंदी' || lowerInput === 'english' || lowerInput === 'अंग्रेजी')) {
      setLanguageSelected(true);
      const isHindi = lowerInput === 'hindi' || lowerInput === 'हिंदी';
      
      const welcomeMessage = isHindi 
        ? '🙏 धन्यवाद! मैं फिनोनेस्ट का AI सहायक हूँ।\n\n💰 मैं आपकी इन सेवाओं में मदद कर सकता हूँ:\n\n🏠 **होम लोन** - 7.3% सालाना से शुरू, ₹5 करोड़ तक\n💰 **पर्सनल लोन** - 9.99% सालाना से, ₹40 लाख तक\n🚗 **कार लोन** - 8.5% सालाना से, नई और पुरानी\n🏢 **बिज़नेस लोन** - 11% सालाना से, ₹50 लाख तक\n\n❓ आप किस बारे में जानना चाहते हैं?'
        : '🙏 Thank you! I\'m Finonest\'s AI Assistant.\n\n💡 I can help you with:\n\n🏠 **Home Loans** - Starting 7.3% p.a., up to ₹5Cr\n💰 **Personal Loans** - From 9.99% p.a., up to ₹40L\n🚗 **Car Loans** - Starting 8.5% p.a., new & used\n🏢 **Business Loans** - From 11% p.a., up to ₹50L\n\n❓ What would you like to know about our financial services?';
      
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
    <div className="fixed bottom-20 lg:bottom-6 right-2 lg:right-6 z-40 flex flex-col items-end gap-4">
      {/* Chat Popup */}
      {isOpen && (
        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden w-80 sm:w-80 w-[calc(100vw-2rem)] max-w-sm h-96 sm:h-96 h-[70vh] max-h-[500px] animate-slide-up flex flex-col">
          {/* Header */}
          <div className="bg-gradient-primary p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
              <img 
                src="/assets/finonest-icon.jpg" 
                alt="Finonest AI" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <Bot className="w-6 h-6 text-primary-foreground" style={{ display: 'none' }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-primary-foreground">AI Assistant</h4>
              <p className="text-xs text-primary-foreground/80">AI Assistant</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
            >
              <X className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                      src="/assets/finonest-icon.jpg" 
                      alt="AI" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <Bot className="w-4 h-4 text-primary" style={{ display: 'none' }} />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-xl text-sm ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img 
                    src="/assets/finonest-icon.jpg" 
                    alt="AI" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <Bot className="w-4 h-4 text-primary" style={{ display: 'none' }} />
                </div>
                <div className="bg-card border border-border p-3 rounded-xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about loans, rates, eligibility..."
                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        }`}
      >
        {/* Pulse Ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
        )}
        
        <span className="relative flex items-center justify-center overflow-hidden rounded-full">
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <>
              <img 
                src="/assets/finonest-icon.jpg" 
                alt="Finonest AI" 
                className="w-10 h-10 object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <Bot className="w-7 h-7 text-white" style={{ display: 'none' }} />
            </>
          )}
        </span>

        {/* Notification Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background">
            AI
          </span>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with AI Assistant!
        </div>
      )}
    </div>
  );
};

export default AIChatSupport;