import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Image as ImageIcon, CheckCircle2, History, AlertCircle, Heart, Globe, Zap, Shield, Activity } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { motion, AnimatePresence } from "framer-motion";

const FaceScan = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'wellness' | 'vitals'>('wellness');
  const [isCameraActive, setIsCameraActive] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppHeader title="Wellness Scan" showBack activeTab="home" />

      <main className="max-w-lg mx-auto p-6 space-y-8 pb-32">
        <div className="flex flex-col items-center text-center gap-4 mb-2">
           <h1 className="text-4xl font-black text-[#1e293b] leading-tight tracking-tight">Face Wellness Scan</h1>
           <p className="text-[#64748b] font-bold text-lg leading-relaxed max-w-[320px]">
             AI-powered wellness insights and rPPG-based vital sign estimation from your camera.
           </p>
        </div>

        {/* Custom Tabs */}
        <div className="bg-[#f1f3fd] p-1.5 rounded-[24px] flex gap-1 shadow-inner border border-black/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'wellness', label: 'Wellness Scan', icon: <Zap className="w-4 h-4" /> },
            { id: 'vitals', label: 'Vitals Scan', icon: <Activity className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-[20px] font-black text-xs tracking-widest uppercase transition-all shrink-0 ${
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

        {/* Scan Area Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-black/5 p-8">
          <div className="relative aspect-square rounded-[32px] bg-[#1e293b] flex items-center justify-center overflow-hidden shadow-inner group">
            {/* The oval overlay from the screenshot */}
            <div className="absolute inset-8 border-[3px] border-dashed border-[#0087c1]/60 rounded-[100%] flex items-center justify-center pointer-events-none animate-pulse">
               <div className="flex flex-col items-center gap-6 opacity-40 group-hover:opacity-80 transition-opacity duration-700">
                  <Camera className="w-16 h-16 text-white" />
                  <p className="text-white font-bold text-sm uppercase tracking-widest text-center max-w-[120px]">
                    Camera preview will appear here
                  </p>
               </div>
            </div>
            
            {/* Corner Scan Marks */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#0087c1] rounded-tl-xl opacity-40" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#0087c1] rounded-tr-xl opacity-40" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#0087c1] rounded-bl-xl opacity-40" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#0087c1] rounded-br-xl opacity-40" />

            {!isCameraActive && (
              <div className="absolute inset-0 bg-slate-400/5 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-700" />
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button 
              onClick={() => setIsCameraActive(!isCameraActive)}
              className="h-16 bg-[#0087c1] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-[#0077B3] transition-all active:scale-95"
            >
              <Camera className="w-6 h-6" />
              {isCameraActive ? 'Stop' : 'Start'} Camera
            </button>
            <button className="h-16 bg-white border-2 border-slate-100 text-[#1e293b] rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-lg shadow-slate-900/5">
              <Upload className="w-6 h-6 text-[#0087c1]" />
              Upload Photo
            </button>
          </div>

          <button className="w-full mt-4 h-16 bg-[#1e293b] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-900/10">
            <Camera className="w-6 h-6 text-[#0087c1]" />
            Take Selfie (if camera won't start)
          </button>
        </div>

        {/* Footer Area */}
        <button className="w-full bg-white border-2 border-black/5 rounded-[28px] p-6 flex items-center justify-center gap-4 text-[#64748b] font-black text-lg hover:bg-slate-50 hover:border-[#0087c1]/20 transition-all shadow-xl shadow-blue-900/5">
          <History className="w-6 h-6 text-[#0087c1]" />
          SHOW PAST SCANS
        </button>
      </main>

      <AppFooter />
    </div>
  );
};

export default FaceScan;
