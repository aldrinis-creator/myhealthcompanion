import { useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface VitalsData {
  heartRate: number | null;
  respiratoryRate: number | null;
  hrvSdnn: number | null;
  hrvRmssd: number | null;
  confidence: number | null;
}

export const useVitalsScan = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [vitals, setVitals] = useState<VitalsData>({
    heartRate: null,
    respiratoryRate: null,
    hrvSdnn: null,
    hrvRmssd: null,
    confidence: null,
  });
  const [isScanning, setIsScanning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const vitalsRef = useRef<VitalsData>(vitals);

  // Merge vitals without overwriting previously captured values
  const handleVitalsUpdate = useCallback((data: any) => {
    const v = data?.vitals || data?.vital_signs;
    if (!v) return;

    setVitals((prev) => {
      const updated: VitalsData = { ...prev };
      if (v.heart_rate?.value != null && v.heart_rate.value > 0) {
        updated.heartRate = Math.round(v.heart_rate.value);
        if (v.heart_rate.confidence != null) updated.confidence = v.heart_rate.confidence;
      }
      if (v.respiratory_rate?.value != null && v.respiratory_rate.value > 0) {
        updated.respiratoryRate = Math.round(v.respiratory_rate.value);
      }
      if (v.hrv_sdnn?.value != null && v.hrv_sdnn.value > 0) {
        updated.hrvSdnn = Math.round(v.hrv_sdnn.value * 100) / 100;
      }
      if (v.hrv_rmssd?.value != null && v.hrv_rmssd.value > 0) {
        updated.hrvRmssd = Math.round(v.hrv_rmssd.value * 100) / 100;
      }
      vitalsRef.current = updated;
      return updated;
    });
  }, []);

  const saveVitals = useCallback(async (mode: string = "scan") => {
    if (!user) return;
    const v = vitalsRef.current;
    if (!v.heartRate) {
      toast.error("No heart rate captured yet");
      return;
    }

    try {
      const { error } = await supabase.from("vitals_scans").insert({
        user_id: user.id,
        heart_rate: v.heartRate,
        heart_rate_confidence: v.confidence,
        respiratory_rate: v.respiratoryRate,
        hrv_sdnn: v.hrvSdnn,
        hrv_rmssd: v.hrvRmssd,
        scan_mode: mode,
      });
      if (error) throw error;
      setIsSaved(true);
      toast.success("Vitals saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["health-passport"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save vitals");
    }
  }, [user, queryClient]);

  const resetVitals = useCallback(() => {
    const empty: VitalsData = { heartRate: null, respiratoryRate: null, hrvSdnn: null, hrvRmssd: null, confidence: null };
    setVitals(empty);
    vitalsRef.current = empty;
    setIsSaved(false);
    setIsScanning(false);
  }, []);

  return {
    vitals,
    isScanning,
    setIsScanning,
    isSaved,
    handleVitalsUpdate,
    saveVitals,
    resetVitals,
  };
};
