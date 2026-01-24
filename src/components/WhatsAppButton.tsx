import { X, Send, Bot, User } from "lucide-react";
import { useState } from "react";

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

  const sendToGemini = async (message: string): Promise<string> => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyDZ8XZq09tzFqvuTAbcJlQscS_WUNDbkAI'
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
        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden w-80 h-96 animate-slide-up flex flex-col">
          {/* Header */}
          <div className="bg-gradient-primary p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-primary-foreground">Finonest AI Assistant</h4>
              <p className="text-xs text-primary-foreground/80">Powered by Gemini AI</p>
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
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
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
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
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
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Finonest loans & services..."
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
            
            {/* WhatsApp Option */}
            <div className="pt-2 border-t border-border">
              <button
                onClick={() => {
                  const message = "Hi Finonest Team, I need assistance with loan information.";
                  const url = `https://api.whatsapp.com/send/?phone=919462553887&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
                  window.open(url, "_blank");
                }}
                className="w-full py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
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
        className={`group relative w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        }`}
      >
        {/* Pulse Ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
        )}
        
        <span className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Bot className="w-7 h-7 text-white" />
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
          Finonest AI Assistant!
        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;
