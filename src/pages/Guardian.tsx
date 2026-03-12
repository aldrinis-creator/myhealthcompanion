import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, Phone, Shield, ChevronRight, MessageCircle, AlertCircle, Heart, Settings as SettingsIcon, CheckCircle2, User, Globe } from 'lucide-react';
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

const Guardian = () => {
  const navigate = useNavigate();

  const guardians = [
    { name: 'Aldrin ALPHONSO', role: 'Self/Primary', phone: '919819576467', relation: 'Self', isPrimary: true },
    { name: 'Sarah ALPHONSO', role: 'Secondary', phone: '919819576468', relation: 'Spouse', isPrimary: false }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppHeader activeTab="guardian" />

      <main className="max-w-lg mx-auto p-6 pb-32">
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-7 h-7 text-[#1E293B]" />
            <h2 className="text-2xl font-black text-[#1E293B]">Emergency Contacts</h2>
          </div>
          <p className="text-slate-500 mb-8">These people will be notified immediately when you trigger a SOS alert.</p>

          <div className="space-y-6">
            {guardians.map((guardian, index) => ( index === 0 ? (
              <div key={index} className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-xl">
                      {guardian.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#1E293B]">{guardian.name}</h3>
                      <p className="text-slate-500 font-bold">{guardian.relation}</p>
                    </div>
                  </div>
                  <div className="bg-[#334155] text-white px-3 py-1 rounded-lg text-xs font-bold">Primary</div>
                </div>
                <div className="flex items-center justify-between text-[#1E293B] font-bold">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {guardian.phone}
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-white p-3 rounded-xl shadow-sm border border-slate-100"><MessageCircle className="w-5 h-5 text-blue-500" /></button>
                    <button className="bg-white p-3 rounded-xl shadow-sm border border-slate-100"><Phone className="w-5 h-5 text-emerald-500" /></button>
                  </div>
                </div>
              </div>
            ) : (
                <div key={index} className="bg-white border-2 border-slate-100 rounded-3xl p-6 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-lg">
                      {guardian.name[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-[#1E293B]">{guardian.name}</h4>
                      <p className="text-slate-500 text-sm font-bold">{guardian.relation}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-slate-50 p-3 rounded-xl"><Phone className="w-5 h-5 text-slate-400" /></button>
                    <ChevronRight className="w-5 h-5 text-slate-300 ml-2" />
                  </div>
                </div>
            )))}

            <button className="w-full bg-[#f1f5f9] text-[#1E293B] py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 hover:bg-slate-100 transition-colors">
              <UserPlus className="w-6 h-6" /> Add New Guardian
            </button>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
           <div className="flex items-center gap-3 mb-2">
            <Heart className="w-7 h-7 text-red-500" />
            <h2 className="text-2xl font-black text-[#1E293B]">Health Updates</h2>
          </div>
          <p className="text-slate-500 mb-8">Choose who receives updates about your daily check-ins and health milestones.</p>

          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-[#1E293B]">Daily Check-in Summary</span>
                </div>
                <div className="w-12 h-7 bg-blue-500 rounded-full relative p-1">
                   <div className="w-5 h-5 bg-white rounded-full absolute right-1" />
                </div>
             </div>
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-[#1E293B]">Critical Health Alerts</span>
                </div>
                <div className="w-12 h-7 bg-blue-500 rounded-full relative p-1">
                   <div className="w-5 h-5 bg-white rounded-full absolute right-1" />
                </div>
             </div>
          </div>
        </section>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 rounded-3xl p-6 flex gap-4 border border-blue-100">
          <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
          <p className="text-sm text-blue-800 font-medium leading-relaxed">
            Your guardians will receive a secure link to view your live location and medical ID only when a SOS alert is active.
          </p>
        </div>

      </main>

      <AppFooter />
    </div>
  );
};

export default Guardian;
