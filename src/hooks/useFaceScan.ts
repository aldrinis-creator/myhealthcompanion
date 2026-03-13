import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface WellnessScanResult {
  face_detected: boolean;
  scan_id?: string;
  hydration_score?: number;
  rest_score?: number;
  vitality_score?: number;
  encouragement?: string;
  error?: string;
}

export const useFaceScan = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<WellnessScanResult | null>(null);

  // Fetch past scans
  const { data: pastScans, isLoading: loadingScans } = useQuery({
    queryKey: ["health-scans", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("health_scans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.setAttribute("webkit-playsinline", "true");
        videoRef.current.muted = true;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Could not access camera. Try the Upload or Take Selfie option.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
  }, []);

  const analyzeImage = useCallback(
    async (base64: string) => {
      if (!user) return;
      setIsAnalyzing(true);
      setScanResult(null);
      try {
        const { data, error } = await supabase.functions.invoke("analyze-face-wellness", {
          body: { image_base64: base64 },
        });
        if (error) throw error;
        setScanResult(data as WellnessScanResult);
        if (data.face_detected) {
          toast.success("Wellness scan complete!");
          queryClient.invalidateQueries({ queryKey: ["health-scans", user.id] });
          queryClient.invalidateQueries({ queryKey: ["health-passport"] });
        } else {
          toast.error(data.error || "No face detected");
        }
      } catch (err: any) {
        console.error("Scan error:", err);
        toast.error(err.message || "Scan failed");
      } finally {
        setIsAnalyzing(false);
      }
    },
    [user, queryClient]
  );

  const captureAndAnalyze = useCallback(async () => {
    const base64 = captureFrame();
    if (!base64) {
      toast.error("Could not capture frame");
      return;
    }
    await analyzeImage(base64);
  }, [captureFrame, analyzeImage]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        await analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    },
    [analyzeImage]
  );

  return {
    videoRef,
    canvasRef,
    isCameraActive,
    isAnalyzing,
    scanResult,
    pastScans,
    loadingScans,
    startCamera,
    stopCamera,
    captureAndAnalyze,
    handleFileUpload,
    setScanResult,
  };
};
