import { Phone, X } from "lucide-react";
import { useState } from "react";

const CallButton = () => {
  const phoneNumber = "+919462553887";

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="fixed bottom-36 lg:bottom-24 right-2 lg:right-6 z-35 flex flex-col items-end gap-3">

      {/* Floating Button */}
      <button
        onClick={handleCallClick}
        className="group relative w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-all duration-300 hover:scale-110"
      >
        {/* Pulse Ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-20" />
        
        <span className="relative flex items-center justify-center">
          <Phone className="w-5 h-5 text-blue-600" />
        </span>

        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background">
          •
        </span>
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Call: {phoneNumber}
      </div>
    </div>
  );
};

export default CallButton;