import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  Heart, 
  Camera, 
  Activity, 
  Brain, 
  Pill, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  X
} from "lucide-react";
import { useHealthPassport } from "@/hooks/useHealthPassport";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default function HealthPassport() {
  const navigate = useNavigate();
  const { passport, isLoading } = useHealthPassport();

  if (isLoading || !passport) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0087C1]"></div>
      </div>
    );
  }

  const pillars = [
    { title: "Check-In", icon: Heart, score: passport.checkin_score, max: 15, path: "/check-in", linkText: "Check In" },
    { title: "Face Scan", icon: Camera, score: passport.vitals_score, max: 25, path: "/face-scan", linkText: "Scan Now" },
    { title: "Activity", icon: Activity, score: passport.activity_score, max: 25, path: "/activity", linkText: "Track" },
    { title: "Wellness", icon: Brain, score: passport.wellness_score, max: 20, path: "/my-health", linkText: "Check" },
    { title: "Medications", icon: Pill, score: passport.medication_score, max: 15, path: "/medications", linkText: "View" },
  ];

  const trendIcon = {
    improving: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    declining: <TrendingDown className="w-5 h-5 text-rose-500" />,
    stable: <Minus className="w-5 h-5 text-slate-400" />,
  }[passport.trend];

  const trendText = passport.trend.charAt(0).toUpperCase() + passport.trend.slice(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppHeader showBack onBack={() => navigate("/dashboard")} title="Daily Health Passport" />

      <main className="max-w-lg mx-auto p-6 space-y-8 pb-32">
        {/* Main Score Display */}
        <section className="bg-white rounded-[40px] p-10 border border-black/5 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
          <div className="flex flex-col items-center gap-6">
             <div className="text-center space-y-1">
                <h1 className="text-xs font-black text-[#94a3b8] uppercase tracking-[0.3em]">Daily Health Passport</h1>
                <p className="text-sm font-bold text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
             </div>

             <div className="relative flex items-center justify-center">
                {/* Circular Score Gauge */}
                <div className="w-40 h-40 rounded-full border-[10px] border-slate-100 flex flex-col items-center justify-center relative">
                   <span className="text-4xl font-black text-[#1e293b] leading-none mb-1">{passport.total_score}</span>
                   <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">/ 100</span>
                   
                   {/* Gradient stroke simulation */}
                   <svg className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] -rotate-90 pointer-events-none">
                      <circle 
                        cx="50%" cy="50%" r="45%" 
                        fill="none" stroke="currentColor" strokeWidth="10" 
                        strokeDasharray="283" strokeDashoffset={283 - (283 * Math.min(passport.total_score, 100) / 100)}
                        className="text-[#0087C1] transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                   </svg>
                </div>
                
                {/* Trend Info */}
                <div className="absolute top-0 -right-20 flex flex-col items-center gap-1 group">
                   <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-black/5 shadow-sm">
                      {trendIcon}
                      <span className={`text-[11px] font-black ${passport.trend === 'declining' ? 'text-rose-500' : passport.trend === 'improving' ? 'text-emerald-500' : 'text-slate-500'}`}>{trendText}</span>
                   </div>
                   {/* Mini sparkline placeholder */}
                   <div className="w-16 h-8 mt-2 opacity-50 overflow-hidden">
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                         <path d="M0,35 L20,30 L40,32 L60,20 L80,25 L100,28" fill="none" stroke={passport.trend === 'declining' ? '#f43f5e' : '#0087c1'} strokeWidth="4" strokeLinecap="round" />
                      </svg>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Pillars List */}
        <section className="space-y-3">
          {pillars.map((pillar, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={pillar.title}
              onClick={() => navigate(pillar.path)}
              className="bg-[#E2E8F0]/40 hover:bg-[#E2E8F0]/60 p-5 rounded-[24px] flex items-center justify-between group cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                 <div className="w-6 h-6 flex items-center justify-center">
                    {pillar.score > 0 ? (
                       <div className="w-5 h-5 rounded-full bg-[#0087C1] flex items-center justify-center animate-in zoom-in duration-500">
                          <Activity className="w-3 h-3 text-white" />
                       </div>
                    ) : (
                       <X className="w-5 h-5 text-rose-500/50" />
                    )}
                 </div>
                 <div className="flex items-center gap-3">
                    <pillar.icon className="w-5 h-5 text-[#1e293b] opacity-60" />
                    <span className="font-bold text-[#1e293b]">{pillar.title}</span>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <span className="font-black text-[#1e293b] mr-1">{pillar.score}/{pillar.max}</span>
                    <span className="text-[#0087C1] text-xs font-black uppercase hover:underline ml-2">{pillar.linkText} &gt;</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
