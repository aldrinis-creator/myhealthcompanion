import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface HealthPassportData {
  id?: string;
  user_id: string;
  passport_date: string;
  checkin_score: number;
  vitals_score: number;
  activity_score: number;
  wellness_score: number;
  medication_score: number;
  bonus_points: number;
  total_score: number;
  streak_days: number;
  trend: "improving" | "declining" | "stable";
}

const calculateVitalsScoreFromScans = (
  healthScans: any[] | null,
  vitalsScans: any[] | null
): number => {
  let wellnessScore = 0;
  let vitalsScore = 0;

  // Wellness scan: 15 base + 5 bonus = 20 max
  if (healthScans && healthScans.length > 0) {
    const best = healthScans[0]; // already ordered desc
    wellnessScore = 15; // base for completing a scan
    const avg = ((best.hydration_score || 0) + (best.rest_score || 0) + (best.vitality_score || 0)) / 3;
    if (avg >= 7) wellnessScore += 5;
    else if (avg >= 5) wellnessScore += 3;
    else if (avg >= 3) wellnessScore += 1;
  }

  // Vitals scan: 15 base + up to 10 bonus = 25 max
  if (vitalsScans && vitalsScans.length > 0) {
    const best = vitalsScans[0];
    vitalsScore = 15; // base
    if (best.heart_rate && best.heart_rate > 0) vitalsScore += 5;
    if (best.respiratory_rate && best.respiratory_rate > 0) vitalsScore += 5;
  }

  return Math.max(wellnessScore, vitalsScore);
};

export const useHealthPassport = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: passport, isLoading } = useQuery({
    queryKey: ["health-passport", user?.id, today],
    queryFn: async () => {
      if (!user) return null;

      // Try to get today's record
      const { data, error } = await supabase
        .from("daily_health_passport")
        .select("*")
        .eq("user_id", user.id)
        .eq("passport_date", today)
        .maybeSingle();

      let passportData = data as HealthPassportData | null;

      if (!passportData) {
        // Create new record
        const { data: prevRecord } = await supabase
          .from("daily_health_passport")
          .select("streak_days, total_score")
          .eq("user_id", user.id)
          .lt("passport_date", today)
          .order("passport_date", { ascending: false })
          .limit(1)
          .maybeSingle();

        const newStreak = prevRecord ? prevRecord.streak_days + 1 : 1;

        const newPassport = {
          user_id: user.id,
          passport_date: today,
          checkin_score: 0,
          vitals_score: 0,
          activity_score: 0,
          wellness_score: 0,
          medication_score: 0,
          bonus_points: 0,
          total_score: 0,
          streak_days: newStreak,
          trend: "stable" as const,
        };

        const { data: created, error: insertError } = await supabase
          .from("daily_health_passport")
          .insert([newPassport])
          .select()
          .single();

        passportData = created as HealthPassportData;
      }

      if (!passportData) return null;

      // Calculate vitals_score from today's scans
      const todayStart = `${today}T00:00:00.000Z`;
      const todayEnd = `${today}T23:59:59.999Z`;

      const [{ data: healthScans }, { data: vitalsScans }] = await Promise.all([
        supabase
          .from("health_scans")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", todayStart)
          .lte("created_at", todayEnd)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("vitals_scans")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", todayStart)
          .lte("created_at", todayEnd)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const newVitalsScore = calculateVitalsScoreFromScans(healthScans, vitalsScans);

      if (newVitalsScore !== passportData.vitals_score) {
        const newTotal =
          passportData.checkin_score +
          newVitalsScore +
          passportData.activity_score +
          passportData.wellness_score +
          passportData.medication_score +
          passportData.bonus_points;

        await supabase
          .from("daily_health_passport")
          .update({ vitals_score: newVitalsScore, total_score: newTotal })
          .eq("id", passportData.id);

        passportData.vitals_score = newVitalsScore;
        passportData.total_score = newTotal;
      }

      return passportData;
    },
    enabled: !!user,
  });

  const updatePassport = useMutation({
    mutationFn: async (updates: Partial<HealthPassportData>) => {
      if (!user || !passport?.id) return;

      const { data, error } = await supabase
        .from("daily_health_passport")
        .update(updates)
        .eq("id", passport.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-passport"] });
    },
  });

  const calculateTotalScore = (p: HealthPassportData) => {
    return p.checkin_score + p.vitals_score + p.activity_score + p.wellness_score + p.medication_score + p.bonus_points;
  };

  return {
    passport,
    isLoading,
    updatePassport,
    calculateTotalScore,
  };
};
