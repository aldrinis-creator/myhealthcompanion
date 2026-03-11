import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Footprints, Flame, Timer, HeartPulse, Gauge,
  Wind, Droplets, Building2, ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ActivityTrends from "@/components/ActivityTrends";

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
}

function MetricCard({ icon, label, value, unit }: MetricCardProps) {
  return (
    <Card className="min-w-[150px] snap-center shrink-0">
      <CardContent className="p-4 flex flex-col items-center text-center gap-1">
        {icon}
        <span className="text-xl font-bold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">
          {label}{unit ? ` (${unit})` : ""}
        </span>
      </CardContent>
    </Card>
  );
}

export default function Activity() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: latestSession } = useQuery({
    queryKey: ["latest-activity", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("activity_sessions")
        .select("*")
        .eq("user_id", user!.id)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const metrics = latestSession
    ? [
        { icon: <Footprints className="w-7 h-7 text-primary" />, label: "Steps", value: latestSession.steps ?? 0 },
        { icon: <Flame className="w-7 h-7" style={{ color: "hsl(var(--health-red))" }} />, label: "Calories", value: latestSession.calories_estimated ?? 0, unit: "kcal" },
        { icon: <Timer className="w-7 h-7" style={{ color: "hsl(var(--health-blue))" }} />, label: "Active Min", value: Math.round((latestSession.duration_seconds ?? 0) / 60) },
        { icon: <HeartPulse className="w-7 h-7" style={{ color: "hsl(var(--health-red))" }} />, label: "Avg HR", value: latestSession.avg_heart_rate ?? "—", unit: "bpm" },
        { icon: <Gauge className="w-7 h-7" style={{ color: "hsl(var(--health-amber))" }} />, label: "Cadence", value: latestSession.cadence_avg ?? "—", unit: "spm" },
        { icon: <Droplets className="w-7 h-7" style={{ color: "hsl(var(--health-blue))" }} />, label: "SpO2", value: latestSession.spo2 ? `${latestSession.spo2}%` : "—" },
        { icon: <Wind className="w-7 h-7" style={{ color: "hsl(var(--health-green))" }} />, label: "Resp Rate", value: latestSession.respiratory_rate ?? "—", unit: "bpm" },
        { icon: <Building2 className="w-7 h-7" style={{ color: "hsl(var(--health-amber))" }} />, label: "Floors", value: latestSession.floors_climbed ?? 0 },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-display font-bold text-lg text-foreground">Activity Tracker</span>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Recent Activity - Horizontal Scroll */}
        <motion.div {...fadeIn}>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3">Recent Activity</h2>
          {latestSession ? (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                {format(new Date(latestSession.started_at), "EEEE, MMM d 'at' h:mm a")}
              </p>
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-hide">
                {metrics.map((m, i) => (
                  <MetricCard key={i} {...m} />
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No activity sessions recorded yet.
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Trends */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <ActivityTrends />
        </motion.div>
      </main>
    </div>
  );
}
