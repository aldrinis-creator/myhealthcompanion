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

      if (data) return data as HealthPassportData;

      // If no record exists for today, create one (and calculate streak)
      const { data: prevRecord } = await supabase
        .from("daily_health_passport")
        .select("streak_days, total_score")
        .eq("user_id", user.id)
        .lt("passport_date", today)
        .order("passport_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      const newStreak = prevRecord ? prevRecord.streak_days + 1 : 1;
      
      const newPassport: Partial<HealthPassportData> = {
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
        trend: "stable",
      };

      const { data: created, error: insertError } = await supabase
        .from("daily_health_passport")
        .insert(newPassport)
        .select()
        .single();

      return created as HealthPassportData;
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
      queryClient.invalidateQueries({ queryKey: ["health-passport", user?.id, today] });
    },
  });

  // Helper to recalculate total score based on provided logic
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
