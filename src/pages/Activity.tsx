import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import { useState } from "react";
import { Footprints, Target, Flame, Clock, TrendingUp, Edit2, X } from "lucide-react";

export default function ActivityPage() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const qc = useQueryClient();
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

  // Today's summary
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todaySessions = sessions.filter((s) => s.started_at.startsWith(todayStr));
  const todaySteps = todaySessions.reduce((a, s) => a + (s.steps ?? 0), 0);
  const todayCalories = todaySessions.reduce((a, s) => a + (s.calories_estimated ?? 0), 0);
  const todayDuration = todaySessions.reduce((a, s) => a + (s.duration_seconds ?? 0), 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your daily movement and workout plans</p>
      </div>

      {/* Today summary + goals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Footprints className="h-4 w-4" />Steps Today</div>
          <p className="text-2xl font-bold text-foreground">{todaySteps.toLocaleString()}</p>
          {goals && <p className="text-xs text-muted-foreground">Goal: {goals.daily_steps_goal.toLocaleString()}</p>}
        </div>
        <div className="bg-card rounded-lg border border-border p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Flame className="h-4 w-4" />Calories</div>
          <p className="text-2xl font-bold text-foreground">{todayCalories}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Clock className="h-4 w-4" />Active Time</div>
          <p className="text-2xl font-bold text-foreground">{formatDuration(todayDuration)}</p>
          {goals && <p className="text-xs text-muted-foreground">Goal: {goals.daily_active_minutes_goal}m</p>}
        </div>
        <div className="bg-card rounded-lg border border-border p-4 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Target className="h-4 w-4" />Daily Goals</div>
            <button onClick={openGoalsDialog} className="p-1 rounded hover:bg-muted"><Edit2 className="h-3.5 w-3.5 text-muted-foreground" /></button>
          </div>
          <p className="text-sm text-foreground">{goals ? `${goals.daily_steps_goal} steps · ${goals.daily_active_minutes_goal}m active` : "Not set"}</p>
        </div>
      </div>

      {/* Workout Plans */}
      {plans.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4" />Workout Plans</h2>
          <div className="space-y-2">
            {plans.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div>
                  <span className="text-sm font-medium text-foreground">{p.plan_name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{p.source}</span>
                </div>
                {p.is_active && <span className="text-xs px-2 py-0.5 rounded-full bg-health-green/10 text-health-green">Active</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Recent Sessions</h2>
        {isLoading ? (
          <div className="text-muted-foreground text-sm animate-pulse">Loading…</div>
        ) : sessions.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-10 text-center">
            <Footprints className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No activity sessions recorded yet.</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Steps</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Distance</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Duration</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Calories</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Avg HR</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-foreground">{format(new Date(s.started_at), "MMM d, h:mm a")}</td>
                    <td className="px-4 py-3 text-foreground">{s.steps?.toLocaleString() ?? "—"}</td>
                    <td className="px-4 py-3 text-foreground">{s.distance_meters ? `${(+s.distance_meters / 1000).toFixed(1)} km` : "—"}</td>
                    <td className="px-4 py-3 text-foreground">{formatDuration(s.duration_seconds)}</td>
                    <td className="px-4 py-3 text-foreground">{s.calories_estimated ?? "—"}</td>
                    <td className="px-4 py-3 text-foreground">{s.avg_heart_rate ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Goals dialog */}
      {goalsDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
          <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-sm mx-4">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Edit Daily Goals</h2>
              <button onClick={() => setGoalsDialogOpen(false)} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); goalsMutation.mutate(); }} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Daily Steps Goal</label>
                <input type="number" min={100} value={goalsForm.steps} onChange={(e) => setGoalsForm({ ...goalsForm, steps: +e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Active Minutes Goal</label>
                <input type="number" min={1} value={goalsForm.active_minutes} onChange={(e) => setGoalsForm({ ...goalsForm, active_minutes: +e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Move Hours Goal</label>
                <input type="number" min={1} max={24} value={goalsForm.move_hours} onChange={(e) => setGoalsForm({ ...goalsForm, move_hours: +e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setGoalsDialogOpen(false)} className="px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={goalsMutation.isPending} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                  {goalsMutation.isPending ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
