import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { format, subDays, subWeeks, subMonths, startOfDay, startOfWeek, startOfMonth } from "date-fns";

type Period = "daily" | "weekly" | "monthly";
type Metric = "steps" | "avg_heart_rate" | "duration_minutes";

const METRIC_LABELS: Record<Metric, string> = {
  steps: "Steps",
  avg_heart_rate: "Avg Heart Rate",
  duration_minutes: "Active Minutes",
};

function linearRegression(data: { x: number; y: number }[]) {
  const n = data.length;
  if (n < 2) return null;
  const sumX = data.reduce((s, d) => s + d.x, 0);
  const sumY = data.reduce((s, d) => s + d.y, 0);
  const sumXY = data.reduce((s, d) => s + d.x * d.y, 0);
  const sumX2 = data.reduce((s, d) => s + d.x * d.x, 0);
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null;
  const m = (n * sumXY - sumX * sumY) / denom;
  const b = (sumY - m * sumX) / n;
  return { m, b };
}

export default function ActivityTrends() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>("daily");
  const [metric, setMetric] = useState<Metric>("steps");

  const rangeStart = useMemo(() => {
    const now = new Date();
    if (period === "daily") return subDays(now, 14);
    if (period === "weekly") return subWeeks(now, 12);
    return subMonths(now, 6);
  }, [period]);

  const { data: sessions } = useQuery({
    queryKey: ["activity-trends", user?.id, period, rangeStart.toISOString()],
    queryFn: async () => {
      const { data } = await supabase
        .from("activity_sessions")
        .select("started_at, steps, avg_heart_rate, duration_seconds")
        .eq("user_id", user!.id)
        .gte("started_at", rangeStart.toISOString())
        .order("started_at");
      return data || [];
    },
    enabled: !!user,
  });

  const { data: goals } = useQuery({
    queryKey: ["activity-goals", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("activity_goals")
        .select("daily_steps_goal, daily_active_minutes_goal")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const chartData = useMemo(() => {
    if (!sessions?.length) return [];
    const buckets: Record<string, { values: number[]; label: string }> = {};

    sessions.forEach((s) => {
      const d = new Date(s.started_at);
      let key: string, label: string;
      if (period === "daily") {
        key = format(startOfDay(d), "yyyy-MM-dd");
        label = format(d, "MMM d");
      } else if (period === "weekly") {
        const w = startOfWeek(d, { weekStartsOn: 1 });
        key = format(w, "yyyy-MM-dd");
        label = format(w, "MMM d");
      } else {
        key = format(startOfMonth(d), "yyyy-MM");
        label = format(d, "MMM yyyy");
      }

      if (!buckets[key]) buckets[key] = { values: [], label };
      const val =
        metric === "steps" ? (s.steps ?? 0) :
        metric === "avg_heart_rate" ? (s.avg_heart_rate ?? 0) :
        Math.round((s.duration_seconds ?? 0) / 60);
      buckets[key].values.push(val);
    });

    return Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, { values, label }], i) => {
        const total = metric === "avg_heart_rate"
          ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
          : values.reduce((a, b) => a + b, 0);
        return { label, value: total, idx: i };
      });
  }, [sessions, period, metric]);

  const trendData = useMemo(() => {
    if (chartData.length < 2) return chartData.map((d) => ({ ...d, trend: d.value }));
    const reg = linearRegression(chartData.map((d) => ({ x: d.idx, y: d.value })));
    if (!reg) return chartData.map((d) => ({ ...d, trend: d.value }));
    return chartData.map((d) => ({ ...d, trend: Math.round(reg.m * d.idx + reg.b) }));
  }, [chartData]);

  const goalValue = useMemo(() => {
    if (!goals) return undefined;
    const daily = metric === "steps" ? goals.daily_steps_goal : metric === "duration_minutes" ? goals.daily_active_minutes_goal : undefined;
    if (daily === undefined) return undefined;
    if (period === "weekly") return daily * 7;
    if (period === "monthly") return daily * 30;
    return daily;
  }, [goals, metric, period]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Activity Trends
        </CardTitle>
        <div className="flex flex-wrap gap-2 pt-2">
          {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
            <Button key={p} size="sm" variant={period === p ? "default" : "outline"} onClick={() => setPeriod(p)} className="capitalize text-xs">
              {p}
            </Button>
          ))}
          <div className="w-px bg-border mx-1" />
          {(Object.keys(METRIC_LABELS) as Metric[]).map((m) => (
            <Button key={m} size="sm" variant={metric === m ? "default" : "outline"} onClick={() => setMetric(m)} className="text-xs">
              {METRIC_LABELS[m]}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {trendData.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No activity data yet. Start tracking to see trends!</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{ borderRadius: "0.5rem", fontSize: "0.875rem" }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Bar dataKey="value" name={METRIC_LABELS[metric]} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.7} />
              <Line dataKey="trend" name="Trend" type="linear" stroke="hsl(var(--health-amber))" strokeWidth={2} dot={false} strokeDasharray="6 3" />
              {goalValue && (
                <ReferenceLine y={goalValue} stroke="hsl(var(--health-green))" strokeDasharray="4 4" label={{ value: "Goal", position: "right", fontSize: 11 }} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
