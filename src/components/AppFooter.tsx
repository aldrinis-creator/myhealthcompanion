import React from 'react';
import { Shield } from 'lucide-react';
import { toast } from "sonner";

interface AppFooterProps {
  onSOS?: () => void;
  className?: string;
  showShield?: boolean;
}

const AppFooter: React.FC<AppFooterProps> = ({ 
  onSOS, 
  className = "",
  showShield = true 
}) => {
  const handleDefaultSOS = () => {
    toast.error("Emergency SOS Triggered!", {
      description: "Your guardians and emergency services are being notified.",
      duration: 5000,
    });
  };

  return (
    <>
      <footer className={`mt-20 text-center space-y-6 pb-32 ${className}`}>
        <p className="text-[#1E293B] font-bold text-sm max-w-sm mx-auto leading-tight px-6">
          In case of emergency, call your local emergency number immediately.
        </p>
        <div className="space-y-3">
          <p className="text-slate-400 text-[10px] leading-relaxed max-w-sm mx-auto px-10">
            © 2024 My Health Companion. All rights reserved. This app provides general health information only. Not a substitute for professional medical advice.
          </p>
          <div className="flex items-center justify-center gap-1 text-slate-500">
            <span role="img" aria-label="cookie" className="text-xs">🍪</span>
            <span className="text-xs underline font-medium cursor-pointer hover:text-[#0087c1] transition-colors">Cookie Settings</span>
          </div>
        </div>
      </footer>

      {/* Floating Global Elements */}
      <button 
        onClick={onSOS || handleDefaultSOS}
        className="fixed bottom-8 right-8 w-20 h-20 bg-[#e11d48] hover:bg-[#be123c] text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 z-50 font-black text-2xl transform transition-all hover:scale-110 active:scale-95 focus:outline-none ring-4 ring-white"
        title="Emergency SOS"
      >
        SOS
      </button>

      {showShield && (
        <div className="fixed bottom-8 left-8 w-12 h-12 bg-white/90 backdrop-blur-md border border-white shadow-xl rounded-2xl flex items-center justify-center z-40 transform hover:rotate-12 transition-transform">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#0087c1]" />
          </div>
        </div>
      )}
    </>
  );
};

export default AppFooter;
