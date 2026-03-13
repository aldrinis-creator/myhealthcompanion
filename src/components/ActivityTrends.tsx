import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";

export default function ActivityTrends() {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const { data: sessions = [] } = useQuery({
    queryKey: ["activity-trends", userId],
    enabled: !!userId,
    queryFn: async () => {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      const { data } = await supabase
        .from("activity_sessions")
        .select("started_at, steps, calories_estimated, duration_seconds")
        .eq("user_id", userId!)
        .gte("started_at", sevenDaysAgo)
        .order("started_at", { ascending: true });
      return data ?? [];
    },
  });

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 text-center">
        <p className="text-slate-400 font-bold text-sm">No activity data for trends yet.</p>
      </div>
    );
  }

  // Group by day
  const dayMap = new Map<string, { steps: number; calories: number }>();
  sessions.forEach((s) => {
    const day = format(new Date(s.started_at), "EEE");
    const existing = dayMap.get(day) || { steps: 0, calories: 0 };
    dayMap.set(day, {
      steps: existing.steps + (s.steps ?? 0),
      calories: existing.calories + (s.calories_estimated ?? 0),
    });
  });

  const maxSteps = Math.max(...Array.from(dayMap.values()).map((v) => v.steps), 1);

  return (
    <div className="bg-white rounded-[24px] shadow-sm p-5 border border-slate-100">
      <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">7-Day Trends</h2>
      <div className="flex items-end justify-between gap-2 h-24">
        {Array.from(dayMap.entries()).map(([day, val]) => (
          <div key={day} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full bg-[#0087c1]/20 rounded-t-lg min-h-[4px]"
              style={{ height: `${(val.steps / maxSteps) * 100}%` }}
            />
            <span className="text-[9px] font-black text-slate-400 uppercase">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
