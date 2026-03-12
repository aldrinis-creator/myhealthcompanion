import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  UserCircle, Save, Heart, Phone, Shield, Lock, Eye, EyeOff, Smartphone, Mail,
  CheckCircle2, AlertCircle, CreditCard, Camera, Info, Calendar, User, Activity,
  Droplets, Utensils, Stethoscope, ChevronRight
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default function Profile() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({
    first_name: "", last_name: "", display_name: "", date_of_birth: "",
    gender: "", blood_type: "", height_cm: "", weight_kg: "",
    allergies: "", medical_conditions: "", food_preference: "",
    doctor_name: "", doctor_mobile: "",
    emergency_contact_name: "", emergency_contact_phone: "", emergency_contact_relationship: "",
    mobile_country_code: "+91", mobile_number: "",
    medication_window_minutes: 30, nudge_interval_hours: 4, weekly_report_enabled: true,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        display_name: profile.display_name || "",
        date_of_birth: profile.date_of_birth || "",
        gender: profile.gender || "",
        blood_type: profile.blood_type || "",
        height_cm: profile.height_cm?.toString() || "",
        weight_kg: profile.weight_kg?.toString() || "",
        allergies: (profile.allergies || []).join(", "),
        medical_conditions: (profile.medical_conditions || []).join(", "),
        food_preference: profile.food_preference || "",
        doctor_name: profile.doctor_name || "",
        doctor_mobile: profile.doctor_mobile || "",
        emergency_contact_name: profile.emergency_contact_name || "",
        emergency_contact_phone: profile.emergency_contact_phone || "",
        emergency_contact_relationship: profile.emergency_contact_relationship || "",
        mobile_country_code: profile.mobile_country_code || "+91",
        mobile_number: profile.mobile_number || "",
        medication_window_minutes: profile.medication_window_minutes ?? 30,
        nudge_interval_hours: profile.nudge_interval_hours ?? 4,
        weekly_report_enabled: profile.weekly_report_enabled ?? true,
      });
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        display_name: form.display_name || null,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || null,
        blood_type: form.blood_type || null,
        height_cm: form.height_cm ? +form.height_cm : null,
        weight_kg: form.weight_kg ? +form.weight_kg : null,
        allergies: form.allergies ? form.allergies.split(",").map((s) => s.trim()).filter(Boolean) : null,
        medical_conditions: form.medical_conditions ? form.medical_conditions.split(",").map((s) => s.trim()).filter(Boolean) : null,
        food_preference: form.food_preference || null,
        doctor_name: form.doctor_name || null,
        doctor_mobile: form.doctor_mobile || null,
        emergency_contact_name: form.emergency_contact_name || null,
        emergency_contact_phone: form.emergency_contact_phone || null,
        emergency_contact_relationship: form.emergency_contact_relationship || null,
        mobile_country_code: form.mobile_country_code || "+91",
        mobile_number: form.mobile_number || null,
        medication_window_minutes: form.medication_window_minutes,
        nudge_interval_hours: form.nudge_interval_hours,
        weekly_report_enabled: form.weekly_report_enabled,
      };
      const { error } = await supabase.from("profiles").update(payload).eq("user_id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleUnlock = () => {
    if (pin === '1234') { // Mock PIN
      setIsUnlocked(true);
    } else {
      toast.error('Invalid PIN. For demo, use 1234');
    }
  };

  const bmi = form.height_cm && form.weight_kg
    ? (+form.weight_kg / (+form.height_cm / 100) ** 2).toFixed(1)
    : null;

  const getBMICondition = (val: string) => {
    const n = +val;
    if (n < 18.5) return { label: "Underweight", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" };
    if (n < 25) return { label: "Normal", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" };
    if (n < 30) return { label: "Overweight", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" };
    return { label: "Obese", color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" };
  };

  if (isLoading) return <div className="text-slate-400 text-sm animate-pulse p-10 text-center font-bold">Loading your secure profile...</div>;

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <AppHeader showTabs={false} />
        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl shadow-blue-900/10 border border-black/5 p-10 text-center space-y-8"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-12 h-12 text-[#0087c1]" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-[#1e293b] tracking-tight">Enter Profile PIN</h1>
              <p className="text-[#64748b] font-bold text-sm">Access your sensitive health record</p>
            </div>
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-[#f1f3fd] border-transparent rounded-[24px] py-5 px-6 font-black text-3xl text-center placeholder:text-slate-300 focus:ring-2 focus:ring-[#0087c1] transition-all"
                />
                <button 
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0087c1] transition-colors"
                >
                  {showPin ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
              <button 
                onClick={handleUnlock}
                className="w-full bg-[#0087c1] text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-[#0076a8] transition-all active:scale-95"
              >
                <Shield className="w-6 h-6" /> Unlock Profile
              </button>
            </div>
          </motion.div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <AppHeader title="Personal Information" showBack showTabs={false} onBack={() => setIsUnlocked(false)} />

      <main className="max-w-lg mx-auto p-6 space-y-10 pb-40">
        {/* Profile Card */}
        <section className="bg-white rounded-[40px] p-8 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-8">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-20 h-20 bg-blue-50 rounded-[24px] flex items-center justify-center text-[#0087c1] mb-2 shadow-inner">
               <User className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-[#1e293b] tracking-tight">Health Profile</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{session?.user?.email}</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">First Name</label>
                <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="w-full bg-[#f1f3fd] border-transparent rounded-[20px] py-4 px-6 font-black text-[#1e293b] focus:ring-2 focus:ring-[#0087c1] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Last Name</label>
                <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="w-full bg-[#f1f3fd] border-transparent rounded-[20px] py-4 px-6 font-black text-[#1e293b] focus:ring-2 focus:ring-[#0087c1] transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Display Name</label>
              <input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="w-full bg-[#f1f3fd] border-transparent rounded-[20px] py-4 px-6 font-black text-[#1e293b] focus:ring-2 focus:ring-[#0087c1] transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Date of Birth</label>
              <div className="relative">
                <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="w-full bg-[#f1f3fd] border-transparent rounded-[20px] py-4 px-6 font-black text-[#1e293b] focus:ring-2 focus:ring-[#0087c1] transition-all" />
                <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Mobile Number</label>
              <div className="flex gap-3">
                 <div className="bg-[#f1f3fd] border-transparent rounded-[20px] px-5 py-4 flex items-center gap-2 font-black text-[#1e293b]">
                   <span>{form.mobile_country_code}</span>
                   <span>🇮🇳</span>
                 </div>
                 <input value={form.mobile_number} onChange={(e) => setForm({ ...form, mobile_number: e.target.value })} className="flex-1 bg-[#f1f3fd] border-transparent rounded-[20px] py-4 px-6 font-black text-[#1e293b] focus:ring-2 focus:ring-[#0087c1] transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Weight</label>
                <div className="relative">
                  <input value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} className="w-full bg-[#f1f3fd] border-transparent rounded-[20px] py-4 px-12 font-black text-[#1e293b]" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-[#64748b] text-xs opacity-50">Kg</span>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2"><Activity className="w-4 h-4 text-slate-300" /></div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Height</label>
                <div className="relative">
                  <input value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} className="w-full bg-[#f1f3fd] border-transparent rounded-[20px] py-4 px-12 font-black text-[#1e293b]" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-[#64748b] text-xs opacity-50">cm</span>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2"><ArrowLeft className="w-4 h-4 text-slate-300 rotate-90" /></div>
                </div>
              </div>
            </div>

            {bmi && (
              <div className="mt-4 pt-6 border-t border-black/5">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2 opacity-60 font-black text-[11px] uppercase tracking-widest">
                      <Activity className="w-4 h-4" /> Body Mass Index
                   </div>
                   <Info className="w-4 h-4 opacity-30 cursor-help" />
                </div>
                {(() => {
                  const cond = getBMICondition(bmi);
                  return (
                    <div className={cn(cond.bg, cond.border, "border rounded-[24px] p-5 flex items-center justify-between shadow-sm")}>
                      <div>
                        <p className={cn(cond.color, "font-black text-2xl tracking-tight")}>{bmi} BMI</p>
                        <p className={cn(cond.color, "font-bold text-xs uppercase tracking-wider")}>Condition: {cond.label}</p>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                         <AlertCircle className={cn(cond.color, "w-7 h-7")} />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </section>

        {/* Recovery Options */}
        <section className="bg-white rounded-[40px] p-8 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#1e293b] tracking-tight">Recovery Options</h2>
            <p className="text-[#64748b] font-bold text-sm leading-relaxed">Ensure access with linked communication channels</p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Mobile Number', val: form.mobile_number || 'Not Linked', icon: <Smartphone />, color: 'bg-blue-100 text-[#0087c1]' },
              { label: 'Email Address', val: session?.user?.email, icon: <Mail />, color: 'bg-[#f5f3ff] text-indigo-600' }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 border border-black/5 rounded-[28px] p-5 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 ${item.color} rounded-[18px] flex items-center justify-center text-2xl shadow-inner`}>
                    {item.icon}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-[#64748b] uppercase tracking-widest opacity-60">{item.label}</p>
                    <p className="font-black text-[#1e293b] text-[13px]">{item.val}</p>
                  </div>
                </div>
                <div className="bg-[#1e293b] text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-lg scale-90">
                  <CheckCircle2 className="w-4 h-4" /> LINKED
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Government IDs */}
        <section className="bg-white rounded-[40px] p-8 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-8">
           <div className="space-y-2 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center text-[#0087c1] mb-2 shadow-inner">
               <CreditCard className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#1e293b] tracking-tight">Government IDs</h2>
            <p className="text-[#64748b] font-bold text-sm max-w-xs mx-auto">Digitally verified and ready for emergency SOS.</p>
          </div>

          <div className="space-y-6">
            {['Aadhaar Card', 'PAN Card'].map((card) => (
              <div key={card} className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-[32px] p-6 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#1e293b] text-sm uppercase tracking-wide">{card}</span>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[9px] font-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                  </div>
                </div>
                
                <div className="bg-[#1e293b] rounded-[24px] p-6 text-white relative overflow-hidden shadow-xl">
                   <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full" />
                   <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                         <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Verified Number</p>
                         <p className="font-black text-xl tracking-[0.25em]">•••• •••• 4215</p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-white border border-slate-100 py-4 rounded-[18px] font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm uppercase">
                    <Eye className="w-4 h-4" /> Show
                  </button>
                  <button className="flex-1 bg-white border border-slate-100 py-4 rounded-[18px] font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm uppercase">
                    <Camera className="w-4 h-4" /> Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Health Record Section */}
        <section className="bg-white rounded-[40px] p-8 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-8">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-16 h-16 bg-rose-50 rounded-[20px] flex items-center justify-center text-rose-500 mb-2 shadow-inner">
               <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#1e293b] tracking-tight">Health Record</h2>
            <p className="text-[#64748b] font-bold text-sm">Critical medical background for emergency care.</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Blood Group</label>
                  <select value={form.blood_type} onChange={(e) => setForm({ ...form, blood_type: e.target.value })} className="w-full bg-[#fef2f2] border-transparent rounded-[20px] py-4 px-6 font-black text-rose-600 text-center text-lg focus:ring-2 focus:ring-rose-200">
                    <option value="">--</option>
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Dietary</label>
                  <select value={form.food_preference} onChange={(e) => setForm({ ...form, food_preference: e.target.value })} className="w-full bg-emerald-50 border-transparent rounded-[20px] py-4 px-6 font-black text-emerald-600 text-center text-[11px] uppercase tracking-wider focus:ring-2 focus:ring-emerald-200">
                    <option value="">Select</option>
                    <option value="vegetarian">Veg</option>
                    <option value="non-vegetarian">Non-Veg</option>
                    <option value="vegan">Vegan</option>
                    <option value="jain">Jain</option>
                  </select>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Allergies</label>
               <input value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="Peanuts, Penicillin, etc." className="w-full bg-[#f1f3fd] border-transparent rounded-[20px] py-4 px-6 font-black text-[#1e293b] focus:ring-2 focus:ring-[#0087c1] transition-all" />
            </div>

            <div className="space-y-2">
               <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Medical Conditions</label>
               <textarea 
                value={form.medical_conditions}
                onChange={(e) => setForm({ ...form, medical_conditions: e.target.value })}
                placeholder="List significant conditions..."
                className="w-full bg-[#f1f3fd] border-transparent rounded-[24px] py-5 px-6 font-black text-[#1e293b] min-h-[120px] focus:ring-2 focus:ring-[#0087c1] transition-all resize-none"
               />
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="bg-white rounded-[40px] p-8 shadow-2xl shadow-blue-900/5 border border-black/5 space-y-8">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center text-[#0087c1] mb-2 shadow-inner">
               <Phone className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#1e293b] tracking-tight">Emergency SOS</h2>
            <p className="text-[#64748b] font-bold text-sm">Designated guardian to notify in an event.</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Guardian Name</label>
              <input value={form.emergency_contact_name} onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })} className="w-full bg-[#f1f3fd] border-transparent rounded-[20px] py-4 px-6 font-black text-[#1e293b]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Relationship</label>
                <input value={form.emergency_contact_relationship} placeholder="Spouse, Parent, etc." onChange={(e) => setForm({ ...form, emergency_contact_relationship: e.target.value })} className="w-full bg-[#f1f3fd] border-transparent rounded-[20px] py-4 px-6 font-black text-[#1e293b]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#64748b] tracking-widest uppercase px-2 opacity-60">Guardian Phone</label>
                <input value={form.emergency_contact_phone} onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })} className="w-full bg-[#f1f3fd] border-transparent rounded-[20px] py-4 px-6 font-black text-[#1e293b]" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-black/5 z-[60]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="w-full bg-[#0087c1] text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 hover:bg-[#0076a8] transition-all active:scale-95 disabled:opacity-50"
          >
             {saveMutation.isPending ? "SAVING CHANGES..." : "💾 SAVE PROFILE CHANGES"}
          </button>
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
