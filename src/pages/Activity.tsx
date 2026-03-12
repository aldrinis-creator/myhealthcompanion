import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Footprints, Target, Flame, Clock, TrendingUp, Edit2, X } from "lucide-react";
import ActivityTrends from "@/components/ActivityTrends";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default function ActivityPage() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [goalsDialogOpen, setGoalsDialogOpen] = useState(false);

  const { data: goals } = useQuery({
    queryKey: ["activity-goals", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("activity_goals")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      return data;
    },
  });

  const [goalsForm, setGoalsForm] = useState({ steps: 5000, active_minutes: 30, move_hours: 8 });

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["activity-sessions", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_sessions")
        .select("*")
        .eq("user_id", userId!)
        .order("started_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: plans = [] } = useQuery({
    queryKey: ["workout-plans", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("workout_plans")
        .select("id, plan_name, is_active, source, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const goalsMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        user_id: userId!,
        daily_steps_goal: goalsForm.steps,
        daily_active_minutes_goal: goalsForm.active_minutes,
        daily_move_hours_goal: goalsForm.move_hours,
      };
      if (goals) {
        const { error } = await supabase.from("activity_goals").update(payload).eq("id", goals.id).eq("user_id", userId!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("activity_goals").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activity-goals"] });
      toast.success("Goals updated");
      setGoalsDialogOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  function openGoalsDialog() {
    setGoalsForm({
      steps: goals?.daily_steps_goal ?? 5000,
      active_minutes: goals?.daily_active_minutes_goal ?? 30,
      move_hours: goals?.daily_move_hours_goal ?? 8,
    });
    setGoalsDialogOpen(true);
  }

  const formatDuration = (s: number | null) => {
    if (!s) return "—";
    const m = Math.floor(s / 60);
    return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
  };

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  // Today's summary
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todaySessions = sessions.filter((s) => s.started_at.startsWith(todayStr));
  const todaySteps = todaySessions.reduce((a, s) => a + (s.steps ?? 0), 0);
  const todayCalories = todaySessions.reduce((a, s) => a + (s.calories_estimated ?? 0), 0);
  const todayDuration = todaySessions.reduce((a, s) => a + (s.duration_seconds ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <AppHeader title="Activity Tracker" showBack showTabs={false} onBack={() => navigate("/dashboard")} />

      <main className="max-w-lg mx-auto p-4 space-y-6 pb-32">
        {/* Today summary + goals */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div {...fadeIn} className="bg-white rounded-[24px] shadow-sm p-4 border border-slate-100 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-black uppercase tracking-wider">
              <Footprints className="h-4 w-4" /> Steps Today
            </div>
            <p className="text-2xl font-black text-slate-800">{todaySteps.toLocaleString()}</p>
            {goals && <p className="text-[10px] font-bold text-slate-400">Goal: {goals.daily_steps_goal.toLocaleString()}</p>}
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.05 }} className="bg-white rounded-[24px] shadow-sm p-4 border border-slate-100 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-black uppercase tracking-wider">
              <Flame className="h-4 w-4" /> Calories
            </div>
            <p className="text-2xl font-black text-slate-800">{todayCalories}</p>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="bg-white rounded-[24px] shadow-sm p-4 border border-slate-100 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-black uppercase tracking-wider">
              <Clock className="h-4 w-4" /> Active Time
            </div>
            <p className="text-2xl font-black text-slate-800">{formatDuration(todayDuration)}</p>
            {goals && <p className="text-[10px] font-bold text-slate-400">Goal: {goals.daily_active_minutes_goal}m</p>}
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="bg-white rounded-[24px] shadow-sm p-4 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                <Target className="h-4 w-4" /> Daily Goals
              </div>
              <button onClick={openGoalsDialog} className="p-1 rounded-full hover:bg-slate-50">
                <Edit2 className="h-3 w-3 text-slate-400" />
              </button>
            </div>
            <p className="text-[13px] font-bold text-slate-800">
              {goals ? `${goals.daily_steps_goal} steps · ${goals.daily_active_minutes_goal}m active` : "Not set"}
            </p>
          </motion.div>
        </div>

        {/* Workout Plans */}
        {plans.length > 0 && (
          <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="bg-white rounded-[24px] shadow-sm p-5 border border-slate-100">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#4f46e5]" /> Workout Plans
            </h2>
            <div className="space-y-3">
              {plans.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-[16px] bg-[#f8faff] border border-blue-50/50">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-black text-slate-800">{p.plan_name}</span>
                    <span className="text-[10px] font-bold text-slate-400">{p.source}</span>
                  </div>
                  {p.is_active && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-tighter">Active</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trends */}
        <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
          <ActivityTrends />
        </motion.div>

        {/* Sessions */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="space-y-4">
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest px-1">Recent Sessions</h2>
          {isLoading ? (
            <div className="text-slate-400 text-xs font-bold animate-pulse px-1">Loading sessions…</div>
          ) : sessions.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-slate-100 p-10 text-center shadow-sm">
              <Footprints className="mx-auto h-12 w-12 text-slate-200 mb-3" />
              <p className="text-slate-400 font-bold text-sm">No recorded movement yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Steps</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Cals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sessions.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="text-[12px] font-black text-slate-800">{format(new Date(s.started_at), "MMM d")}</div>
                          <div className="text-[10px] font-bold text-slate-400">{format(new Date(s.started_at), "h:mm a")}</div>
                        </td>
                        <td className="px-4 py-3 text-[13px] font-bold text-slate-700">{s.steps?.toLocaleString() ?? "—"}</td>
                        <td className="px-4 py-3 text-[13px] font-bold text-slate-700">{formatDuration(s.duration_seconds)}</td>
                        <td className="px-4 py-3 text-[13px] font-black text-[#e11d48] text-right">{s.calories_estimated ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Goals dialog */}
      {goalsDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-[#f8f9fc]">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Edit Daily Goals</h2>
              <button onClick={() => setGoalsDialogOpen(false)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); goalsMutation.mutate(); }} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Daily Steps Goal</label>
                <input type="number" min={100} value={goalsForm.steps} onChange={(e) => setGoalsForm({ ...goalsForm, steps: +e.target.value })}
                  className="w-full h-12 px-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Active Minutes Goal</label>
                <input type="number" min={1} value={goalsForm.active_minutes} onChange={(e) => setGoalsForm({ ...goalsForm, active_minutes: +e.target.value })}
                  className="w-full h-12 px-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Move Hours Goal</label>
                <input type="number" min={1} max={24} value={goalsForm.move_hours} onChange={(e) => setGoalsForm({ ...goalsForm, move_hours: +e.target.value })}
                  className="w-full h-12 px-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setGoalsDialogOpen(false)} className="flex-1 h-12 rounded-[16px] border border-slate-100 font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm">Cancel</button>
                <button type="submit" disabled={goalsMutation.isPending} className="flex-1 h-12 rounded-[16px] bg-[#0070c9] text-white font-black text-sm hover:bg-[#005ea9] shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all">
                  {goalsMutation.isPending ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <AppFooter />
    </div>
  );
}
