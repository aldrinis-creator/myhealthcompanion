import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Heart, Activity, Pill, Calendar, TrendingUp,
  LogOut, User, Shield, Stethoscope
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name, display_name, avatar_url")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
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
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: medications } = useQuery({
    queryKey: ["medications-active", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("medications")
        .select("id, name, dosage, scheduled_time, severity")
        .eq("user_id", user!.id)
        .eq("is_active", true);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: todayAppointments } = useQuery({
    queryKey: ["appointments-today", user?.id, today],
    queryFn: async () => {
      const { data } = await supabase
        .from("appointments")
        .select("id, title, appointment_time, doctor_name, appointment_type")
        .eq("user_id", user!.id)
        .eq("appointment_date", today)
        .order("appointment_time");
      return data || [];
    },
    enabled: !!user,
  });

  const { data: passport } = useQuery({
    queryKey: ["health-passport", user?.id, today],
    queryFn: async () => {
      const { data } = await supabase
        .from("daily_health_passport")
        .select("*")
        .eq("user_id", user!.id)
        .eq("passport_date", today)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const displayName = profile?.display_name || profile?.first_name || user?.email?.split("@")[0] || "User";
  const wellnessScore = latestWellness?.overall_score ?? 0;
  const riskLevel = latestWellness?.risk_level ?? "unknown";

  const riskColor = riskLevel === "low" ? "text-health-green" : riskLevel === "high" ? "text-health-red" : "text-health-amber";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg text-foreground">MyHealthCompanion</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">{displayName}</span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Greeting */}
        <motion.div {...fadeIn}>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {displayName}
          </h1>
          <p className="text-muted-foreground mt-1">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </motion.div>

        {/* Wellness Score */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Wellness Score
                </CardTitle>
                <span className={`text-sm font-medium capitalize ${riskColor}`}>{riskLevel} risk</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <span className="text-5xl font-display font-bold text-foreground">{wellnessScore}</span>
                <span className="text-muted-foreground mb-1">/100</span>
              </div>
              <Progress value={wellnessScore} className="mt-3 h-2" />
              {latestWellness?.diagnosis && (
                <p className="text-sm text-muted-foreground mt-2">{latestWellness.diagnosis}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Pill className="w-8 h-8 text-health-blue mb-2" />
                <span className="text-2xl font-bold text-foreground">{medications?.length || 0}</span>
                <span className="text-xs text-muted-foreground">Active Medications</span>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Calendar className="w-8 h-8 text-health-amber mb-2" />
                <span className="text-2xl font-bold text-foreground">{todayAppointments?.length || 0}</span>
                <span className="text-xs text-muted-foreground">Today's Appointments</span>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Activity className="w-8 h-8 text-health-green mb-2" />
                <span className="text-2xl font-bold text-foreground">{passport?.total_score || 0}</span>
                <span className="text-xs text-muted-foreground">Health Passport</span>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Heart className="w-8 h-8 text-health-red mb-2" />
                <span className="text-2xl font-bold text-foreground">{passport?.streak_days || 0}</span>
                <span className="text-xs text-muted-foreground">Day Streak</span>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Medications List */}
        {medications && medications.length > 0 && (
          <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="w-5 h-5 text-health-blue" />
                  Active Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medications.slice(0, 5).map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{med.name}</p>
                        <p className="text-sm text-muted-foreground">{med.dosage} • {med.scheduled_time}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        med.severity === "critical" ? "bg-health-red/10 text-health-red" :
                        med.severity === "important" ? "bg-health-amber/10 text-health-amber" :
                        "bg-health-green/10 text-health-green"
                      }`}>
                        {med.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Today's Appointments */}
        {todayAppointments && todayAppointments.length > 0 && (
          <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-health-amber" />
                  Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{apt.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.appointment_time}{apt.doctor_name ? ` • Dr. ${apt.doctor_name}` : ""}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {apt.appointment_type}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
