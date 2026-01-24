import { Phone, X } from "lucide-react";
import { useState } from "react";

const CallButton = () => {
  const phoneNumber = "+919462553887";

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="fixed bottom-36 lg:bottom-24 right-4 lg:right-6 z-40 flex flex-col items-end gap-3">

      {/* Floating Button */}
      <button
        onClick={handleCallClick}
        className="group relative w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 bg-blue-600 hover:bg-blue-700"
      >
        {/* Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-25" />
        
        <span className="relative flex items-center justify-center">
          <Phone className="w-7 h-7 text-white" />
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