import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, FileText, Image as ImageIcon, Video, Shield, Eye, EyeOff, Plus, Search, MoreVertical, ChevronRight, Trash2, Download, Share2, Heart, Globe } from 'lucide-react';
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

const Vault = () => {
  const navigate = useNavigate();
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');

  const documents = [
    { title: 'Blood Report - Feb 2024', date: '12 Feb 2024', size: '1.2 MB', type: 'PDF' },
    { title: 'MRI Scan - Brain', date: '05 Jan 2024', size: '24.5 MB', type: 'DICOM' },
    { title: 'Prescription - Dr. Jagtap', date: '20 Dec 2023', size: '450 KB', type: 'JPG' }
  ];

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
         <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8">
          <Shield className="w-12 h-12 text-[#0087c1]" />
        </div>
        <h1 className="text-3xl font-black text-[#1E293B] mb-2">Secret Vault</h1>
        <p className="text-slate-500 text-center mb-10 max-w-xs">Enter your master PIN to access your secure medical documents.</p>
        
        <div className="w-full max-w-xs space-y-6">
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-4 h-4 rounded-full border-2 border-slate-300 ${pin.length >= i ? 'bg-[#0087c1] border-[#0087c1]' : ''}`} />
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'X'].map((num, i) => (
              <button 
                key={i}
                onClick={() => {
                  if (num === 'X') setPin(pin.slice(0, -1));
                  else if (num !== '') {
                    const newPin = pin + num;
                    setPin(newPin);
                    if (newPin === '1234') setTimeout(() => setIsLocked(false), 300);
                  }
                }}
                className={`h-16 rounded-2xl font-black text-xl flex items-center justify-center transition-all active:scale-90 ${
                  num === '' ? 'invisible' : 'bg-white shadow-sm hover:bg-slate-50 border border-slate-100 text-[#1E293B]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button 
             onClick={() => navigate(-1)}
             className="w-full py-4 text-slate-500 font-bold flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppHeader 
        title="Secret Vault" 
        showBack 
        showTabs={false} 
        onBack={() => setIsLocked(true)} 
        rightElement={
          <button className="bg-[#0087c1] text-white p-2 rounded-xl">
            <Plus className="w-6 h-6" />
          </button>
        }
      />

      <main className="max-w-lg mx-auto p-6 pb-32">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#1E293B] text-lg uppercase tracking-wider">Recently Added</h3>
            <button className="text-[#0087c1] font-bold text-sm">View All</button>
          </div>

          {documents.map((doc, i) => (
            <div key={i} className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-black text-[#1E293B] group-hover:text-blue-600 transition-colors">{doc.title}</h4>
                  <div className="flex gap-3 text-slate-400 text-xs font-bold mt-1">
                    <span>{doc.date}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 text-slate-400 hover:text-blue-500"><Download className="w-5 h-5" /></button>
                 <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>

      </main>
      <AppFooter />
    </div>
  );
};

export default Vault;
