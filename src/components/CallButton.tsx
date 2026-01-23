import { Phone, X } from "lucide-react";
import { useState } from "react";

const CallButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "+919462553887";

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="fixed bottom-36 lg:bottom-24 right-4 lg:right-6 z-40 flex flex-col items-end gap-3">
      {/* Call Popup */}
      {isOpen && (
        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden w-80 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white">Call Finonest</h4>
              <p className="text-xs text-white/80">Available 24/7 for support</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Call Body */}
          <div className="p-4 bg-muted/30">
            <div className="bg-card rounded-xl p-3 shadow-sm border border-border">
              <p className="text-sm text-foreground">
                📞 Need immediate assistance? Call us now for instant support with your loan queries.
              </p>
              <span className="text-xs text-muted-foreground mt-2 block">Available now</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleCallClick}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
            >
              <Phone className="w-5 h-5" />
              Call Now: {phoneNumber}
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {/* Pulse Ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-25" />
        )}
        
        <span className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Phone className="w-7 h-7 text-white" />
          )}
        </span>

        {/* Notification Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background">
            •
          </span>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Call us now!
        </div>
      )}
    </div>
  );
};

export default CallButton;