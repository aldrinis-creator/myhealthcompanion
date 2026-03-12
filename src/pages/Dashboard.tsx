import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Activity, CalendarCheck, Heart, Pill, TrendingUp, Footprints } from "lucide-react";
import { format } from "date-fns";

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-5 space-y-2">
      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: wellness } = useQuery({
    queryKey: ["wellness-latest", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("wellness_scores")
        .select("overall_score, risk_level, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      return data;
    },
  });

  const { data: medCount } = useQuery({
    queryKey: ["med-count", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { count } = await supabase
        .from("medications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!)
        .eq("is_active", true);
      return count ?? 0;
    },
  });

  const { data: appointmentsToday } = useQuery({
    queryKey: ["appointments-today", userId, today],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("appointments")
        .select("id, title, appointment_time")
        .eq("user_id", userId!)
        .eq("appointment_date", today)
        .order("appointment_time");
      return data ?? [];
    },
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
        .single();
      return data;
    },
  });

  const { data: recentVitals } = useQuery({
    queryKey: ["recent-vitals", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("vitals_scans")
        .select("heart_rate, respiratory_rate, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      return data;
    },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Heart}
          label="Wellness Score"
          value={wellness?.overall_score ?? "—"}
          sub={wellness ? `Risk: ${wellness.risk_level}` : "No data yet"}
          color="bg-health-green/10 text-health-green"
        />
        <StatCard
          icon={Pill}
          label="Active Medications"
          value={medCount ?? "—"}
          color="bg-health-blue/10 text-health-blue"
        />
        <StatCard
          icon={CalendarCheck}
          label="Appointments Today"
          value={appointmentsToday?.length ?? 0}
          sub={appointmentsToday?.[0] ? `Next: ${appointmentsToday[0].title}` : "None scheduled"}
          color="bg-health-amber/10 text-health-amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Health Passport"
          value={passport?.total_score ?? "—"}
          sub={passport ? `${passport.streak_days} day streak` : "No data yet"}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          icon={Activity}
          label="Heart Rate"
          value={recentVitals?.heart_rate ? `${recentVitals.heart_rate} bpm` : "—"}
          sub={recentVitals ? `Last scan: ${format(new Date(recentVitals.created_at), "MMM d")}` : "No scans yet"}
          color="bg-health-red/10 text-health-red"
        />
        <StatCard
          icon={Footprints}
          label="Resp. Rate"
          value={recentVitals?.respiratory_rate ? `${recentVitals.respiratory_rate}/min` : "—"}
          color="bg-secondary/10 text-secondary"
        />
      </div>

      {/* Upcoming appointments */}
      {appointmentsToday && appointmentsToday.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-5">
          <h2 className="text-lg font-semibold text-foreground mb-3">Today's Appointments</h2>
          <div className="space-y-2">
            {appointmentsToday.map((apt) => (
              <div key={apt.id} className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <CalendarCheck className="h-4 w-4 text-health-amber" />
                <span className="text-sm font-medium text-foreground">{apt.title}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {apt.appointment_time.slice(0, 5)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
