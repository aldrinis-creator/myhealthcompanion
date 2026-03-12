import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Heart,
  Activity,
  Pill,
  Calendar,
  LogOut,
  TrendingUp,
  Droplets,
  Thermometer,
  Wind,
} from "lucide-react";

export default function Dashboard() {
  const { user, signOut } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: medications } = useQuery({
    queryKey: ["medications", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_active", true)
        .order("scheduled_time");
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: latestWellness } = useQuery({
    queryKey: ["wellness-latest", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("wellness_scores")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: todayAppointments } = useQuery({
    queryKey: ["appointments-today", user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user!.id)
        .eq("appointment_date", today)
        .order("appointment_time");
      return data ?? [];
    },
    enabled: !!user,
  });

  const displayName =
    profile?.display_name ||
    profile?.first_name ||
    user?.email?.split("@")[0] ||
    "there";

  const wellnessScore = latestWellness?.overall_score ?? 0;
  const riskLevel = latestWellness?.risk_level ?? "unknown";

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-health-green";
    if (score >= 60) return "text-health-orange";
    return "text-health-red";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">MyHealth</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hi, {displayName}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Good {getGreeting()}, {displayName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your health overview for today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Wellness Score"
            value={wellnessScore > 0 ? `${wellnessScore}%` : "—"}
            subtitle={riskLevel !== "unknown" ? `Risk: ${riskLevel}` : "No data yet"}
            color="health-blue"
            valueColor={wellnessScore > 0 ? getScoreColor(wellnessScore) : ""}
          />
          <StatCard
            icon={<Heart className="h-5 w-5" />}
            label="Heart Rate"
            value={latestWellness?.heart_rate ? `${latestWellness.heart_rate}` : "—"}
            subtitle="bpm"
            color="health-red"
          />
          <StatCard
            icon={<Droplets className="h-5 w-5" />}
            label="SpO2"
            value={latestWellness?.spo2 ? `${latestWellness.spo2}%` : "—"}
            subtitle="Oxygen saturation"
            color="health-blue"
          />
          <StatCard
            icon={<Wind className="h-5 w-5" />}
            label="Respiratory"
            value={
              latestWellness?.respiratory_rate
                ? `${latestWellness.respiratory_rate}`
                : "—"
            }
            subtitle="breaths/min"
            color="health-green"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medications */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-card-foreground">
                Active Medications
              </h2>
            </div>
            {medications && medications.length > 0 ? (
              <ul className="space-y-3">
                {medications.slice(0, 5).map((med) => (
                  <li
                    key={med.id}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{med.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} • {med.scheduled_time}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        med.severity === "critical"
                          ? "bg-health-red/10 text-health-red"
                          : med.severity === "important"
                          ? "bg-health-orange/10 text-health-orange"
                          : "bg-health-green/10 text-health-green"
                      }`}
                    >
                      {med.severity}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No active medications. Add one to get started.
              </p>
            )}
          </div>

          {/* Today's Appointments */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-card-foreground">
                Today's Appointments
              </h2>
            </div>
            {todayAppointments && todayAppointments.length > 0 ? (
              <ul className="space-y-3">
                {todayAppointments.map((apt) => (
                  <li
                    key={apt.id}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{apt.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {apt.appointment_time}
                        {apt.doctor_name && ` • Dr. ${apt.doctor_name}`}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">
                      {apt.appointment_type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No appointments scheduled for today.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
  color,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className={`flex items-center gap-2 text-${color} mb-3`}>
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${valueColor || "text-card-foreground"}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}
