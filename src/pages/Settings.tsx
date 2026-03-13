import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, Bell, Heart, Calendar, Shield, Globe, Lock, Eye, CheckCircle2, Moon, CloudSun, Activity, Zap, Info, ChevronRight, Phone, Smartphone, Mail, Clock, Volume2, ChevronDown, HelpCircle, Play, Download, ExternalLink } from 'lucide-react';
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'alerts' | 'checkin' | 'appts' | 'guardians' | 'language' | 'access' | 'privacy'>('alerts');

  const tabs = [
    { id: 'alerts', label: 'Alerts' },
    { id: 'checkin', label: 'Check-In' },
    { id: 'appts', label: 'Appts' },
    { id: 'guardians', label: 'Guardians' },
    { id: 'language', label: 'Language' },
    { id: 'access', label: 'Access' },
    { id: 'privacy', label: 'Privacy' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppHeader title="Settings" showBack activeTab="help" />

      <main className="max-w-lg mx-auto p-6 space-y-8 pb-32">
        <div className="flex flex-col items-center text-center gap-2 mb-2">
           <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0087c1]">
              <SettingsIcon className="w-8 h-8" />
           </div>
           <h1 className="text-3xl font-black text-[#1e293b]">Settings</h1>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="bg-[#f1f3fd] p-1.5 rounded-[24px] flex gap-1 shadow-inner border border-black/5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3.5 rounded-[20px] font-black text-xs tracking-widest uppercase transition-all shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-white text-[#0087c1] shadow-lg shadow-blue-900/5 translate-y-[-1px]' 
                  : 'text-[#64748b] hover:text-[#1e293b] opacity-60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'alerts' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             {/* Notification Status Card */}
             <div className="bg-[#e2e8f0]/40 rounded-[32px] p-8 border border-black/5 space-y-6">
                <div className="flex items-center gap-3 text-emerald-600">
                   <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                   </div>
                   <span className="font-black text-lg">Notifications Ready</span>
                </div>
                <div className="space-y-3">
                   {[
                     'Permission: granted',
                     'Service Worker: Active',
                     'PWA Installed: Yes'
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 text-[#64748b]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-sm tracking-tight">{item}</span>
                     </div>
                   ))}
                </div>
             </div>

             <section className="bg-white rounded-[40px] p-10 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-10">
                <div className="flex items-center gap-4 border-b border-black/5 pb-6">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e293b]">
                      <Bell className="w-6 h-6" />
                   </div>
                   <h2 className="text-2xl font-black text-[#1e293b]">Notification Settings</h2>
                </div>

                <div className="space-y-10">
                   {[
                     { icon: <Volume2 className="w-6 h-6" />, title: 'Audio Alerts', desc: 'Play a chime when check-in is due', active: true, color: 'text-blue-500', bg: 'bg-blue-50' },
                     { icon: <Smartphone className="w-6 h-6" />, title: 'Vibration & Notifications', desc: 'Always enabled for check-in reminders', active: false, color: 'text-slate-400', bg: 'bg-slate-100' }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-6">
                        <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-full flex items-center justify-center shrink-0 shadow-inner`}>
                           {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="text-xl font-black text-[#1e293b] leading-tight mb-1">{item.title}</h3>
                           <p className="text-[#64748b] font-bold text-sm leading-relaxed">{item.desc}</p>
                        </div>
                        <div className={`w-14 h-8 rounded-full relative p-1 cursor-pointer transition-colors ${item.active ? 'bg-[#0087c1]' : 'bg-[#cbd5e1]'}`}>
                           <div className={`w-6 h-6 bg-white rounded-full absolute shadow-sm transition-all ${item.active ? 'right-1' : 'left-1'}`} />
                        </div>
                     </div>
                   ))}
                </div>
             </section>

             <section className="bg-white rounded-[40px] p-10 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-10">
                <div className="flex items-center gap-4 border-b border-black/5 pb-6">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e293b]">
                      <Bell className="w-6 h-6" />
                   </div>
                   <h2 className="text-2xl font-black text-[#1e293b]">Push Notifications</h2>
                </div>

                <div className="space-y-10">
                   {[
                     { title: 'Check-In Reminders', desc: "Get reminded when it's time to check in", active: true },
                     { title: 'Medication Reminders', desc: "Get notified when medications are due", active: true }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between gap-6">
                        <div className="min-w-0">
                           <h3 className="text-xl font-black text-[#1e293b] leading-tight mb-1">{item.title}</h3>
                           <p className="text-[#64748b] font-bold text-sm leading-relaxed truncate">{item.desc}</p>
                        </div>
                        <div className={`w-14 h-8 rounded-full relative p-1 cursor-pointer transition-colors ${item.active ? 'bg-[#0087c1]' : 'bg-[#cbd5e1]'}`}>
                           <div className={`w-6 h-6 bg-white rounded-full absolute shadow-sm transition-all ${item.active ? 'right-1' : 'left-1'}`} />
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>
        )}

        {activeTab === 'checkin' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex gap-4">
              <button className="flex-1 bg-[#EEF2FF] border border-[#C7D2FE]/30 h-20 rounded-[32px] shadow-sm flex items-center justify-center gap-4 font-black text-indigo-700 hover:scale-[1.02] active:scale-95 transition-all">
                <Moon className="w-6 h-6" /> Sleep Mode
              </button>
              <button className="flex-1 bg-[#FFF7ED] border border-[#FED7AA]/30 h-20 rounded-[32px] shadow-sm flex items-center justify-center gap-4 font-black text-orange-600 hover:scale-[1.02] active:scale-95 transition-all">
                <CloudSun className="w-6 h-6" /> Check-Out
              </button>
            </div>

            <section className="bg-white rounded-[40px] p-10 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-10">
              <div className="flex items-center gap-4 border-b border-black/5 pb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e293b]">
                   <Clock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-[#1e293b]">Inactivity Nudge Interval</h2>
              </div>
              
              <div className="space-y-8">
                <p className="text-[#64748b] font-bold text-lg leading-relaxed">Choose how frequently you'd like to receive nudges when no activity is detected.</p>

                <div className="bg-slate-50 p-8 rounded-[32px] border border-black/5 space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-[#1e293b] mb-1">Nudge Frequency</h3>
                    <p className="text-[#64748b] font-bold text-sm leading-relaxed">Alerts will be sent to your guardians if you remain inactive</p>
                  </div>
                  <button className="w-full h-16 bg-white border-2 border-slate-100 rounded-2xl px-6 flex items-center justify-between font-black text-[#1e293b] shadow-sm group">
                    <span>Every 4...</span>
                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-[#0087c1] transition-colors" />
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[40px] p-10 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-10">
              <div className="flex items-center gap-4 border-b border-black/5 pb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e293b]">
                   <Activity className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-[#1e293b]">Fall Detection</h2>
              </div>

              <div className="space-y-10">
                <p className="text-[#64748b] font-bold text-lg leading-relaxed">
                  Uses your device's motion sensors to detect potential falls. If a fall is detected and you don't respond within 30 seconds, an SOS alert is sent to your guardians.
                </p>

                <div className="flex items-center justify-between gap-6 pb-6 border-b border-slate-50">
                  <div className="min-w-0">
                    <h3 className="text-xl font-black text-[#1e293b] leading-tight mb-1">Enable Fall Detection</h3>
                    <p className="text-[#64748b] font-bold text-sm leading-relaxed">Monitors accelerometer for sudden falls</p>
                  </div>
                  <div className="w-14 h-8 bg-[#0087c1] rounded-full relative p-1 cursor-pointer">
                    <div className="w-6 h-6 bg-white rounded-full absolute right-1 shadow-sm" />
                  </div>
                </div>

                <div className="bg-[#94a3b8]/80 rounded-[32px] p-8 backdrop-blur-sm border border-white/20 shadow-xl">
                  <p className="text-[#101827] font-bold text-lg leading-relaxed">
                    <span className="font-black underline decoration-[#101827]/30">How it works:</span> The sensor looks for a free-fall pattern followed by a sudden impact and stillness. If detected, you'll have 30 seconds to confirm you're okay before a SOS is triggered.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
};
// Helper components
const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

export default Settings;
