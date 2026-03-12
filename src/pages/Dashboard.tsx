<import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Heart,
  Moon,
  Plane,
  Activity,
  CalendarCheck,
  Pill,
  TrendingUp,
  Footprints
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import HeartRateMonitor from "@/components/HeartRateMonitor";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useHealthPassport } from "@/hooks/useHealthPassport";

export default function Dashboard() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const userId = session?.user?.id;
  const today = format(new Date(), "yyyy-MM-dd");
  const { passport: passportHook } = useHealthPassport();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name, display_name")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: passport } = useQuery({
    queryKey: ["passport-today", userId, today],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("daily_health_passport")
        .select("total_score, streak_days")
        .eq("user_id", userId!)
        .eq("passport_date", today)
        .maybeSingle();
      return data;
    },
  });

  const handleSOS = async () => {
    toast.error("Emergency SOS Triggered!", {
      description: "Your guardians and emergency services are being notified.",
      duration: 5000,
    });

    if (user) {
      await supabase
        .from("user_activity")
        .update({ sos_status: "active", sos_started_at: new Date().toISOString() })
        .eq("user_id", user.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <AppHeader />

      <main className="max-w-lg mx-auto p-4 space-y-4 pb-32">
        {/* Top Action Card */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white rounded-[32px] shadow-sm p-8 border border-slate-100"
        >
          {/* Quick Actions */}
          <div className="flex gap-4 mb-12">
            <button className="flex-1 h-14 rounded-[16px] bg-[#f5f7ff] text-[#4f46e5] flex items-center justify-between px-5 font-black text-[13px] border border-[#4f46e5]/5 active:scale-95 transition-all">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                <span>Sleep Mode</span>
              </div>
              <span className="text-[#4f46e5]/60 text-[10px] lowercase font-bold">(Active)</span>
            </button>
            <button className="flex-1 h-14 rounded-[16px] bg-[#fff7ed] text-[#ea580c] flex items-center justify-center gap-2 font-black text-[13px] border border-[#ea580c]/5 active:scale-95 transition-all px-5">
              <Plane className="w-5 h-5 rotate-45" /> 
              <span>Check-Out</span>
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <h2 className="text-[28px] font-black text-[#1e293b] leading-tight mb-8 tracking-tight">
              {profile?.first_name || "Aldrin"}, did you<br />Check-In today?
            </h2>

            {/* Heart Area */}
            <div className="relative mb-10 w-full flex flex-col items-center">
               <HeartRateMonitor />
               <div className="mt-8 space-y-1">
                 <p className="text-[#64748b] font-bold text-sm">Tap the heart to Check-In</p>
                 <p className="text-[#94a3b8] font-black text-[10px] uppercase tracking-widest leading-none mt-1">Next check-in: 7:00 AM tomorrow</p>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Health Passport Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[32px] shadow-sm p-8 border border-slate-100 space-y-8"
        >
          <div className="flex flex-col">
            <h3 className="text-[15px] font-black text-[#1e293b] uppercase tracking-[0.1em] mb-1">Daily Health Passport</h3>
            <span className="text-[#94a3b8] font-bold text-[13px]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="50%" cy="50%" r="45%" 
                  fill="none" stroke="#f1f3fd" strokeWidth="10"
                />
                <circle 
                  cx="50%" cy="50%" r="45%" 
                  fill="none" stroke="#e11d48" strokeWidth="10" 
                  strokeDasharray="251" strokeDashoffset={251 - (251 * (passport?.total_score || passportHook?.total_score || 48) / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[28px] font-black text-[#1e293b] leading-none">{passport?.total_score || passportHook?.total_score || 48}</span>
                <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest mt-1">/ 100</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-2">
               <div className="flex items-center gap-2">
                 <div className="w-6 h-[2px] bg-[#64748b]/20 rounded-full" />
                 <span className="text-[13px] font-black text-[#1e293b] tracking-wide">Steady</span>
               </div>
               
               {/* Trend Line SVG */}
               <div className="h-10 w-full mt-2">
                 <svg className="w-full h-full overflow-visible">
                   <path 
                     d="M 0 30 L 40 25 L 80 32 L 120 28 L 160 30" 
                     fill="none" 
                     stroke="#0087c1" 
                     strokeWidth="3" 
                     strokeLinecap="round" 
                     strokeLinejoin="round" 
                   />
                   {[0, 40, 80, 120, 160].map((x, i) => {
                     const y = [30, 25, 32, 28, 30][i];
                     return <circle key={i} cx={x} cy={y} r="3" fill="#0087c1" />;
                   })}
                 </svg>
               </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3 pt-6 border-t border-slate-50">
             <div className="flex items-center justify-between p-4 bg-[#f0fdf4] rounded-[18px] border border-[#dcfce7]">
               <div className="flex items-center gap-3">
                 <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center">
                   <motion.div animate={{ scale: [0, 1] }} transition={{ type: "spring" }}>
                     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                     </svg>
                   </motion.div>
                 </div>
                 <div className="flex items-center gap-2 text-[#065f46]">
                    <Heart className="w-4 h-4 fill-current" />
                    <span className="font-extrabold text-[12px] uppercase tracking-wider">Check-In</span>
                 </div>
               </div>
               <span className="text-[12px] font-black text-[#059669]">15 / 15</span>
             </div>

             <div className="flex items-center justify-between p-4 bg-white rounded-[18px] border border-slate-100">
               <div className="flex items-center gap-3">
                 <div className="w-5 h-5 border-2 border-slate-200 rounded" />
                 <div className="flex items-center gap-2 text-[#1e293b]">
                    <Activity className="w-4 h-4" />
                    <span className="font-extrabold text-[12px] uppercase tracking-wider">Face Scan</span>
                 </div>
               </div>
               <span className="text-[12px] font-black text-[#64748b]">20 / 25</span>
             </div>
          </div>
        </motion.div>
      </main>

      {/* SOS Button */}
      <button 
        onClick={handleSOS}
        className="fixed bottom-10 right-6 w-[72px] h-[72px] bg-[#e11d48] rounded-full flex items-center justify-center text-white font-black text-lg shadow-2xl shadow-red-500/40 z-[60] active:scale-95 transition-all border-[6px] border-white/20"
      >
        SOS
      </button>

      <AppFooter />
    </div>
  );
}
    </div>
  );
}
