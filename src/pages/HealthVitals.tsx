import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Thermometer, Droplets, Wind, RefreshCw, Save, History, Heart, Globe, Clipboard, Smartphone, Shield, Clock } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { motion } from "framer-motion";

const HealthVitals = () => {
  const navigate = useNavigate();
  const [bloodSugarUnit, setBloodSugarUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('F');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppHeader title="Health Vitals" showBack activeTab="home" />

      <main className="max-w-lg mx-auto p-6 space-y-8 pb-32">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-black/5 p-10 space-y-10">
          <div className="flex items-start gap-6 border-b border-black/5 pb-8">
            <div className="bg-blue-50 p-4 rounded-[20px] shrink-0 text-[#0087c1]">
              <Clipboard className="w-8 h-8" />
            </div>
            <div className="pt-1">
              <h2 className="text-3xl font-black text-[#1e293b] leading-tight mb-2">Health Vitals</h2>
              <p className="text-[#64748b] font-bold text-lg leading-relaxed">
                Enter your readings or load from your last saved assessment.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <button className="w-full h-20 bg-[#f1f5f9] text-[#1e293b] rounded-[24px] font-black text-lg flex items-center justify-center gap-4 hover:bg-slate-200 transition-all active:scale-95 border-2 border-transparent hover:border-blue-500/20 shadow-xl shadow-slate-900/5">
              <Smartphone className="w-6 h-6 text-[#0087c1]" />
              Load from Wearable
            </button>

            <p className="text-center text-sm text-[#94a3b8] font-bold px-6 leading-relaxed">
              Health data integration requires the native app. Install from App Store or Google Play, or manually enter your wearable readings.
            </p>

            <button className="w-full h-16 bg-white border-2 border-slate-100 text-[#64748b] rounded-[20px] font-black text-md flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95">
              <Clock className="w-5 h-5 text-[#0087c1]" />
              Load Previous Vitals (Feb 14)
            </button>
          </div>

          {/* Vitals Form */}
          <div className="space-y-12">
            {/* Blood Pressure */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <Heart className="w-7 h-7 text-rose-500" />
                  <span className="font-black text-[#1e293b] text-xl">Blood Pressure <span className="text-[#94a3b8] text-sm font-bold">(mmHg)</span></span>
                </div>
                <span className="text-[#94a3b8] font-black text-sm uppercase tracking-widest">Normal (120/80)</span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  placeholder="Systolic" 
                  className="flex-1 h-20 bg-slate-50 border-2 border-transparent rounded-[24px] px-8 text-center font-black text-2xl text-[#1e293b] placeholder:text-slate-300 focus:border-[#0087c1] focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
                <span className="text-slate-200 font-black text-4xl">/</span>
                <input 
                  type="number" 
                  placeholder="Diastolic" 
                  className="flex-1 h-20 bg-slate-50 border-2 border-transparent rounded-[24px] px-8 text-center font-black text-2xl text-[#1e293b] placeholder:text-slate-300 focus:border-[#0087c1] focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Blood Sugar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <Droplets className="w-7 h-7 text-sky-500" />
                  <span className="font-black text-[#1e293b] text-xl">Blood Sugar</span>
                </div>
                <span className="text-[#94a3b8] font-black text-sm uppercase tracking-widest">Normal (70–100)</span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  placeholder="e.g. 100" 
                  className="flex-1 h-20 bg-slate-50 border-2 border-transparent rounded-[24px] px-8 text-left font-black text-2xl text-[#1e293b] placeholder:text-slate-300 focus:border-[#0087c1] focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
                <div className="bg-[#f1f3fd] p-1.5 rounded-[20px] flex items-center shrink-0 w-40 shadow-inner">
                  <button 
                    onClick={() => setBloodSugarUnit('mg/dL')}
                    className={`flex-1 py-3 rounded-[16px] text-xs font-black tracking-widest uppercase transition-all ${bloodSugarUnit === 'mg/dL' ? 'bg-white text-[#0087c1] shadow-sm' : 'text-[#64748b] opacity-60'}`}
                  >
                    mg/dL
                  </button>
                  <button 
                    onClick={() => setBloodSugarUnit('mmol/L')}
                    className={`flex-1 py-3 rounded-[16px] text-xs font-black tracking-widest uppercase transition-all ${bloodSugarUnit === 'mmol/L' ? 'bg-white text-[#0087c1] shadow-sm' : 'text-[#64748b] opacity-60'}`}
                  >
                    mmol/L
                  </button>
                </div>
              </div>
            </div>

            {/* SpO2 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <Wind className="w-7 h-7 text-cyan-500" />
                  <span className="font-black text-[#1e293b] text-xl">SpO2 <span className="text-[#94a3b8] text-sm font-bold">(%)</span></span>
                </div>
                <span className="text-[#94a3b8] font-black text-sm uppercase tracking-widest">Normal (95–100)</span>
              </div>
              <input 
                type="number" 
                placeholder="e.g. 98" 
                className="w-full h-20 bg-slate-50 border-2 border-transparent rounded-[24px] px-8 text-left font-black text-2xl text-[#1e293b] placeholder:text-slate-300 focus:border-[#0087c1] focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>

            {/* Temperature */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-7 h-7 text-orange-500" />
                  <span className="font-black text-[#1e293b] text-xl">Temperature</span>
                </div>
                <span className="text-[#94a3b8] font-black text-sm uppercase tracking-widest">Normal (36.1–37.2)</span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  placeholder="e.g. 36.6" 
                  className="flex-1 h-20 bg-slate-50 border-2 border-transparent rounded-[24px] px-8 text-left font-black text-2xl text-[#1e293b] placeholder:text-slate-300 focus:border-[#0087c1] focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
                <div className="bg-[#f1f3fd] p-1.5 rounded-[20px] flex items-center shrink-0 w-32 shadow-inner">
                  <button 
                    onClick={() => setTempUnit('C')}
                    className={`flex-1 py-3 rounded-[16px] text-xs font-black tracking-widest uppercase transition-all ${tempUnit === 'C' ? 'bg-white text-[#0087c1] shadow-sm' : 'text-[#64748b] opacity-60'}`}
                  >
                    °C
                  </button>
                  <button 
                    onClick={() => setTempUnit('F')}
                    className={`flex-1 py-3 rounded-[16px] text-xs font-black tracking-widest uppercase transition-all ${tempUnit === 'F' ? 'bg-white text-[#0087c1] shadow-sm' : 'text-[#64748b] opacity-60'}`}
                  >
                    °F
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full h-20 bg-[#0087c1] text-white rounded-[24px] font-black text-2xl shadow-2xl shadow-blue-500/30 hover:bg-[#0077b3] active:scale-[0.98] transition-all transform hover:translate-y-[-2px]">
            Save Vitals
          </button>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

// Re-using the Zap icon for SpO2 as cyan colored
const Zap = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default HealthVitals;
