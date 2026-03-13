import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle2, History, Activity, Zap, Heart, Wind, BarChart3, Save, RotateCcw, Loader2 } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { motion, AnimatePresence } from "framer-motion";
import { useFaceScan } from "@/hooks/useFaceScan";
import { useVitalsScan } from "@/hooks/useVitalsScan";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vitallens-scan': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 'api-key'?: string; };
      'vitallens-monitor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'vitallens-file': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 'api-key'?: string; };
    }
  }
}

const FaceScan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'wellness' | 'vitals'>('wellness');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeInputRef = useRef<HTMLInputElement>(null);

  const {
    videoRef, canvasRef, isCameraActive, isAnalyzing, scanResult,
    pastScans, loadingScans, startCamera, stopCamera, captureAndAnalyze, handleFileUpload, setScanResult
  } = useFaceScan();

  const { vitals, isScanning, setIsScanning, isSaved, handleVitalsUpdate, saveVitals, resetVitals } = useVitalsScan();

  // Load VitalLens script
  useEffect(() => {
    if (activeTab === 'vitals' && !document.querySelector('script[src*="vitallens"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/vitallens@0.4.4/dist/vitallens.min.js';
      script.type = 'module';
      document.head.appendChild(script);
    }
  }, [activeTab]);

  // Listen for VitalLens events
  useEffect(() => {
    const handler = (e: any) => handleVitalsUpdate(e.detail);
    window.addEventListener('vitallens-result', handler);
    return () => window.removeEventListener('vitallens-result', handler);
  }, [handleVitalsUpdate]);

  const handleNativeSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const VITALLENS_KEY = import.meta.env.VITE_VITALLENS_API_KEY || '';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppHeader title="Wellness Scan" showBack activeTab="home" />
      <canvas ref={canvasRef} className="hidden" />

      <main className="max-w-lg mx-auto p-6 space-y-8 pb-32">
        <div className="flex flex-col items-center text-center gap-4 mb-2">
          <h1 className="text-4xl font-black text-[#1e293b] leading-tight tracking-tight">Face Wellness Scan</h1>
          <p className="text-[#64748b] font-bold text-lg leading-relaxed max-w-[320px]">
            AI-powered wellness insights and rPPG-based vital sign estimation from your camera.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-[#f1f3fd] p-1.5 rounded-[24px] flex gap-1 shadow-inner border border-black/5">
          {[
            { id: 'wellness', label: 'Wellness Scan', icon: <Zap className="w-4 h-4" /> },
            { id: 'vitals', label: 'Vitals Scan', icon: <Activity className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); if (tab.id === 'vitals') stopCamera(); }}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-[20px] font-black text-xs tracking-widest uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#0087c1] shadow-lg shadow-blue-900/5 translate-y-[-1px]'
                  : 'text-[#64748b] hover:text-[#1e293b] opacity-60'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* WELLNESS TAB */}
        {activeTab === 'wellness' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-black/5 p-8">
              <div className="relative aspect-square rounded-[32px] bg-[#1e293b] flex items-center justify-center overflow-hidden">
                {isCameraActive ? (
                  <video ref={videoRef} className="w-full h-full object-cover rounded-[32px]" playsInline muted />
                ) : (
                  <>
                    <div className="absolute inset-8 border-[3px] border-dashed border-[#0087c1]/60 rounded-[100%] flex items-center justify-center pointer-events-none animate-pulse">
                      <div className="flex flex-col items-center gap-6 opacity-40">
                        <Camera className="w-16 h-16 text-white" />
                        <p className="text-white font-bold text-sm uppercase tracking-widest text-center max-w-[120px]">
                          Camera preview will appear here
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-slate-400/5 backdrop-blur-[1px]" />
                  </>
                )}
                {/* Corner marks */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#0087c1] rounded-tl-xl opacity-40" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#0087c1] rounded-tr-xl opacity-40" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#0087c1] rounded-bl-xl opacity-40" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#0087c1] rounded-br-xl opacity-40" />

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 z-10">
                    <Loader2 className="w-12 h-12 text-[#0087c1] animate-spin" />
                    <p className="text-white font-black text-sm uppercase tracking-widest">Analyzing...</p>
                  </div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {isCameraActive ? (
                  <button
                    onClick={captureAndAnalyze}
                    disabled={isAnalyzing}
                    className="h-16 bg-[#0087c1] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-[#0077B3] transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Camera className="w-6 h-6" />
                    Scan Now
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="h-16 bg-[#0087c1] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-[#0077B3] transition-all active:scale-95"
                  >
                    <Camera className="w-6 h-6" />
                    Start Camera
                  </button>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="h-16 bg-white border-2 border-slate-100 text-[#1e293b] rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-lg shadow-slate-900/5 disabled:opacity-50"
                >
                  <Upload className="w-6 h-6 text-[#0087c1]" />
                  Upload Photo
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
              </div>

              <button
                onClick={() => nativeInputRef.current?.click()}
                disabled={isAnalyzing}
                className="w-full mt-4 h-16 bg-[#1e293b] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-900/10 disabled:opacity-50"
              >
                <Camera className="w-6 h-6 text-[#0087c1]" />
                Take Selfie (if camera won't start)
              </button>
              <input ref={nativeInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleNativeSelfie} />
            </div>

            {/* Scan Results */}
            <AnimatePresence>
              {scanResult?.face_detected && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-[32px] p-8 border border-black/5 shadow-xl shadow-blue-900/5 space-y-6"
                >
                  <h2 className="text-xs font-black text-[#94a3b8] uppercase tracking-[0.3em] text-center">Wellness Results</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Hydration", score: scanResult.hydration_score, color: "#0087c1", icon: <Zap className="w-5 h-5" /> },
                      { label: "Rest", score: scanResult.rest_score, color: "#7c3aed", icon: <Heart className="w-5 h-5" /> },
                      { label: "Vitality", score: scanResult.vitality_score, color: "#059669", icon: <Activity className="w-5 h-5" /> },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50">
                        <div style={{ color: item.color }}>{item.icon}</div>
                        <span className="text-3xl font-black text-[#1e293b]">{item.score}</span>
                        <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  {scanResult.encouragement && (
                    <div className="bg-[#f0fdf4] rounded-2xl p-4 text-center">
                      <p className="text-sm font-bold text-emerald-700">{scanResult.encouragement}</p>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <span className="ml-2 text-sm font-bold text-emerald-600">Saved to your health record</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Past Scans */}
            {pastScans && pastScans.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-[#94a3b8] uppercase tracking-[0.3em] px-2">Recent Scans</h3>
                {pastScans.slice(0, 5).map((scan: any) => (
                  <div key={scan.id} className="bg-white rounded-2xl p-4 border border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <History className="w-4 h-4 text-[#0087c1]" />
                      <span className="text-sm font-bold text-[#1e293b]">
                        {format(new Date(scan.created_at), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs font-black">
                      <span className="text-[#0087c1]">H:{scan.hydration_score}</span>
                      <span className="text-purple-600">R:{scan.rest_score}</span>
                      <span className="text-emerald-600">V:{scan.vitality_score}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VITALS TAB */}
        {activeTab === 'vitals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-black/5 p-8">
              <div className="relative aspect-video rounded-[24px] bg-[#1e293b] overflow-hidden">
                {/* @ts-ignore */}
                <vitallens-scan
                  api-key={VITALLENS_KEY}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Vitals Display */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { label: "Heart Rate", value: vitals.heartRate, unit: "bpm", icon: <Heart className="w-5 h-5 text-rose-500" /> },
                  { label: "Resp. Rate", value: vitals.respiratoryRate, unit: "br/min", icon: <Wind className="w-5 h-5 text-blue-500" /> },
                  { label: "HRV (SDNN)", value: vitals.hrvSdnn, unit: "ms", icon: <BarChart3 className="w-5 h-5 text-violet-500" /> },
                  { label: "HRV (RMSSD)", value: vitals.hrvRmssd, unit: "ms", icon: <Activity className="w-5 h-5 text-emerald-500" /> },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center gap-1">
                    {item.icon}
                    <span className="text-2xl font-black text-[#1e293b]">
                      {item.value != null ? item.value : "--"}
                    </span>
                    <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">{item.unit}</span>
                    <span className="text-[10px] font-bold text-[#64748b]">{item.label}</span>
                  </div>
                ))}
              </div>

              {vitals.confidence != null && (
                <div className="mt-4 text-center text-xs font-bold text-[#94a3b8]">
                  Confidence: {Math.round(vitals.confidence * 100)}%
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => saveVitals("scan")}
                  disabled={!vitals.heartRate || isSaved}
                  className="h-14 bg-[#0087c1] text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-[#0077B3] transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {isSaved ? "Saved" : "Save Vitals"}
                </button>
                <button
                  onClick={resetVitals}
                  className="h-14 bg-white border-2 border-slate-100 text-[#1e293b] rounded-2xl font-black text-base flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <RotateCcw className="w-5 h-5 text-[#0087c1]" />
                  Reset
                </button>
              </div>
            </div>

            {/* File Analysis Fallback */}
            <div className="bg-white rounded-[28px] p-6 border border-black/5 shadow-lg">
              <p className="text-xs font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-4 text-center">Camera not working? Use file analysis</p>
              <div className="rounded-[20px] bg-[#1e293b] overflow-hidden aspect-video">
                {/* @ts-ignore */}
                <vitallens-file
                  api-key={VITALLENS_KEY}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
};

export default FaceScan;
