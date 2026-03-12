import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, Heart, Shield, Play, ChevronRight, Info, ExternalLink, Mail, Phone, Settings as SettingsIcon, HelpCircle, Lock, Eye, CheckCircle2, Globe, Moon, Calendar, MessageSquare, Clock } from 'lucide-react';
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Button } from "@/components/ui/button";

const Help = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'settings' | 'privacy' | 'terms'>('faq');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppHeader activeTab="help" />

      <main className="max-w-lg mx-auto p-6 space-y-8 pb-32">
        <div className="flex flex-col items-center text-center gap-2 mb-2">
           <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0087c1]">
              <HelpCircle className="w-8 h-8" />
           </div>
           <h1 className="text-3xl font-black text-[#1e293b]">Help & Support</h1>
        </div>

        {/* Tutorial Video Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-black/5 p-8">
          <div className="relative aspect-video bg-slate-900 rounded-[32px] flex items-center justify-center overflow-hidden mb-8 group cursor-pointer shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-[#0087c1] rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform duration-500">
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </div>
              <p className="text-white font-black text-xl tracking-tight">How to Use My Health Companion</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-black text-[#1e293b]">Tutorial Video</h2>
            <p className="text-[#64748b] font-bold text-sm leading-relaxed">
              Learn how to use various features of the app. The video is automatically shown in your preferred language.
            </p>

            <div className="bg-amber-50 border border-amber-100/50 rounded-2xl p-4 flex gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                 <Info className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-[12px] text-amber-700 font-bold leading-relaxed pt-1">
                Tutorial video for <span className="text-amber-600 font-black">EN-IN</span> will be available soon. Upload your video to <code className="bg-white/50 px-1 rounded font-black">public/videos/en-IN-tutorial.mp4</code>
              </p>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="bg-[#f1f3fd] p-1.5 rounded-[24px] flex gap-1 shadow-inner border border-black/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'faq', label: 'FAQ' },
            { id: 'contact', label: 'Contact Us' },
            { id: 'settings', label: 'Settings' },
            { id: 'privacy', label: 'Privacy' },
            { id: 'terms', label: 'Terms' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'settings') navigate('/settings');
                else setActiveTab(tab.id as any);
              }}
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

        <div className="space-y-6">
          {activeTab === 'faq' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between px-2">
                <p className="text-[#64748b] font-bold text-sm leading-relaxed max-w-[240px]">
                  Learn about all the features and how to use My Health Companion effectively.
                </p>
                <button className="bg-white border border-black/5 px-6 py-3.5 rounded-2xl font-black text-xs flex items-center gap-3 text-[#1e293b] shadow-xl shadow-blue-900/5 hover:translate-y-[-2px] transition-all">
                  <Download className="w-4 h-4 text-[#0087c1]" /> DOWNLOAD
                </button>
              </div>

              {/* FAQ Accordions */}
              {[
                { 
                  title: 'Daily Check-In', 
                  icon: <Heart className="text-rose-500" />, 
                  questions: [
                    'What is the Daily Check-In feature?',
                    'What happens if I miss a check-in?',
                    'Can I customize check-in times?'
                  ] 
                },
                { 
                  title: 'Sleep Mode', 
                  icon: <Moon className="text-indigo-500" />, 
                  questions: [
                    'What is Sleep Mode?',
                    'How do I configure Sleep Mode?'
                  ] 
                },
                { 
                  title: 'Check-Out (Vacation Mode)', 
                  icon: <Globe className="text-amber-500" />, 
                  questions: [
                    'What is Check-Out mode?',
                    'When should I use Check-Out?'
                  ] 
                }
              ].map((section, idx) => (
                <div key={idx} className="bg-white rounded-[40px] p-8 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-8">
                  <div className="flex items-center gap-4 border-b border-black/5 pb-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl">
                      {section.icon}
                    </div>
                    <h3 className="text-2xl font-black text-[#1e293b]">{section.title}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {section.questions.map((q, i) => (
                      <div key={i} className="flex items-center justify-between py-5 border-b border-slate-50 cursor-pointer group last:border-0 hover:px-2 transition-all">
                        <span className="text-lg font-bold text-[#1e293b] group-hover:text-[#0087c1] transition-colors leading-tight pr-4">{q}</span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0087c1] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center px-4">
                <h3 className="text-3xl font-black text-[#1e293b] mb-3">Need Help?</h3>
                <p className="text-[#64748b] font-bold text-lg leading-relaxed">Our support team is available 24/7 to assist you.</p>
              </div>

              <div className="grid gap-6">
                {[
                  { icon: <Mail />, title: 'Email Support', info: 'support@myhealthcompanion.com', color: 'text-[#0087c1]', bg: 'bg-blue-50' },
                  { icon: <Phone />, title: 'Call Us', info: '1-800-MY-HEALTH', color: 'text-emerald-500', bg: 'bg-emerald-50' }
                ].map((item, i) => (
                  <section key={i} className="bg-white rounded-[40px] p-8 shadow-2xl shadow-blue-900/5 border border-black/5 group hover:border-[#0087c1]/20 transition-all text-center">
                    <div className={`w-20 h-20 ${item.bg} ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                      {item.icon}
                    </div>
                    <h4 className="text-2xl font-black text-[#1e293b] mb-2">{item.title}</h4>
                    <p className="text-[#64748b] font-bold text-lg mb-8">{item.info}</p>
                    <button className="w-full h-16 bg-[#1e293b] text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95">
                      {item.title.includes('Email') ? 'Send Message' : 'Start Call'}
                    </button>
                  </section>
                ))}
              </div>

              <div className="bg-slate-900 text-white rounded-[40px] p-8 flex items-center gap-6 shadow-2xl">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                   <Clock className="w-8 h-8 text-[#0087c1]" />
                </div>
                <div>
                  <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em]">Response Time</p>
                  <p className="text-xl font-black">Under 2 hours <span className="text-[#0087c1]">Average</span></p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="animate-in fade-in duration-500">
              <section className="bg-white rounded-[40px] p-10 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-10">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 bg-blue-50 text-[#0087c1] rounded-3xl flex items-center justify-center shadow-inner">
                    <Shield className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black text-[#1e293b]">Privacy Policy</h3>
                </div>
                
                <div className="space-y-8">
                  <p className="text-[#64748b] font-bold text-lg leading-relaxed text-center italic">
                    "Your privacy is our top priority. We use industry-standard encryption to protect your health data."
                  </p>
                  
                  <div className="grid gap-6">
                    {[
                      { title: 'Data Protection', icon: <Lock className="w-6 h-6" />, desc: 'All health records and check-in history are encrypted at rest and in transit.' },
                      { title: 'Contact Sharing', icon: <Globe className="w-6 h-6" />, desc: 'We only share critical alerts with your designated guardians during emergencies.' }
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50 p-8 rounded-[32px] border border-black/5 space-y-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1e293b] shadow-sm">
                              {item.icon}
                           </div>
                           <h4 className="font-black text-xl text-[#1e293b]">{item.title}</h4>
                        </div>
                        <p className="text-[#64748b] font-bold leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-5 rounded-2xl border-2 border-slate-100 font-black text-[#1e293b] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                     <ExternalLink className="w-5 h-5 text-[#0087c1]" /> READ FULL POLICY
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="animate-in fade-in duration-500">
               <section className="bg-white rounded-[40px] p-10 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-10">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 bg-slate-50 text-[#1e293b] rounded-3xl flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10 text-[#0087c1]" />
                  </div>
                  <h3 className="text-3xl font-black text-[#1e293b]">Terms of Service</h3>
                </div>

                <p className="text-[#64748b] font-bold text-lg leading-relaxed text-center">
                  By using My Health Companion, you agree to our terms regarding data usage and emergency responsiveness.
                </p>

                <div className="space-y-4">
                   {[
                     'Full Terms & Conditions',
                     'Legal Disclaimers',
                     'Data Usage Agreement',
                     'Cookie Policy'
                   ].map((item, i) => (
                     <button key={i} className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-black/5 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                        <span className="font-black text-lg text-[#1e293b] group-hover:text-[#0087c1] transition-colors">{item}</span>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-blue-50">
                           <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-[#0087c1] transition-colors" />
                        </div>
                     </button>
                   ))}
                </div>
              </section>
            </div>
          )}
        </div>

        <AppFooter />
      </main>
    </div>
  );
};

export default Help;
