import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Globe, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showTabs?: boolean;
  activeTab?: string;
  rightElement?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBack = false, 
  onBack,
  showTabs = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const userInitial = user?.email?.[0].toUpperCase() || 'A';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const isActive = (path: string) => location.pathname === path || (path === '/' && location.pathname === '/dashboard');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/[0.03]">
      <div className="container px-6 max-w-lg mx-auto py-4 space-y-4">
        {/* Top Branding Bar */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            {showBack && (
              <button 
                onClick={handleBack} 
                className="w-10 h-10 -ml-1 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all active:scale-90"
              >
                <ArrowLeft className="w-6 h-6 text-slate-800" />
              </button>
            )}
            <div className="w-[52px] h-[52px] bg-[#0087c1] rounded-[16px] flex items-center justify-center shadow-sm">
              <Heart className="w-7 h-7 text-white fill-current" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-[22px] text-[#1e293b] leading-[1.1] tracking-tight">My Health</h1>
              <h1 className="font-extrabold text-[22px] text-[#1e293b] leading-[1.1] tracking-tight">Companion</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 text-[#1e293b] hover:bg-slate-50 rounded-full flex items-center justify-center transition-all">
               <Globe className="w-6 h-6" /> 
            </button>
            <div 
              onClick={() => navigate('/profile')}
              className="w-11 h-11 bg-[#0087c1] rounded-full flex items-center justify-center text-white font-black text-sm cursor-pointer hover:scale-105 transition-all"
            >
              {userInitial}
            </div>
          </div>
        </div>

        {/* Dynamic Main Navigation Tabs */}
        {showTabs && (
          <div className="flex items-center justify-between gap-2 w-full">
            <button 
              onClick={() => navigate("/")}
              className={`flex-1 h-12 rounded-[14px] font-black text-[13px] transition-all ${
                isActive("/")
                  ? 'bg-[#0087c1] text-white' 
                  : 'bg-white text-[#64748b] hover:text-[#0087c1]'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => navigate("/appointments")}
              className={`flex-[1.2] h-12 rounded-[14px] font-black text-[13px] flex items-center justify-center gap-2 transition-all ${
                isActive("/appointments") 
                  ? 'bg-[#e11d48] text-white shadow-md' 
                  : 'bg-[#e11d48] text-white'
              }`}
            >
              Appointments <span className="bg-black/20 px-2 py-0.5 rounded-full text-[11px] text-white ml-0.5">2</span>
            </button>
            <button 
              onClick={() => navigate("/my-health")}
              className={`flex-1 h-12 rounded-[14px] font-black text-[13px] transition-all ${
                location.pathname.startsWith("/my-health")
                  ? 'bg-[#0087c1] text-white' 
                  : 'bg-white text-[#64748b] hover:text-[#0087c1]'
              }`}
            >
              My Health
            </button>
          </div>
        )}

        {/* Secondary Navigation Links */}
        {showTabs && (
          <div className="flex justify-between items-center text-[12px] font-black text-[#64748b] pt-1 px-1 overflow-x-auto gap-4 whitespace-nowrap scrollbar-hide tracking-wide border-t border-black/[0.01] mt-1">
            <button onClick={() => navigate("/profile")} className={`hover:text-[#1e293b] py-2 transition-colors ${location.pathname === "/profile" ? 'text-[#0087c1]' : ''}`}>My Profile</button>
            <button onClick={() => navigate("/guardian")} className={`hover:text-[#1e293b] py-2 transition-colors ${location.pathname === "/guardian" ? 'text-[#0087c1]' : ''}`}>Guardian</button>
            <button onClick={() => navigate("/vault")} className={`hover:text-[#1e293b] py-2 transition-colors ${location.pathname === "/vault" ? 'text-[#0087c1]' : ''}`}>Secret Vault</button>
            <button onClick={() => navigate("/help")} className={`hover:text-[#1e293b] py-2 transition-colors ${location.pathname === "/help" ? 'text-[#0087c1]' : ''}`}>Help</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
