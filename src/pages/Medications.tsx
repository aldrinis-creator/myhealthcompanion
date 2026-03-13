import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Pill, Plus, Edit2, Trash2, AlertTriangle, Clock, X, Bell, Truck, Scan, ChevronRight, History, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  composition: string | null;
  scheduled_time: string;
  scheduled_times: string[] | null;
  severity: string;
  is_active: boolean | null;
  total_quantity: number | null;
  current_quantity: number | null;
  low_stock_threshold: number | null;
  created_at: string;
};

const defaultForm = {
  name: "", dosage: "", composition: "", scheduled_time: "08:00",
  scheduled_times: ["08:00"], severity: "medium",
  total_quantity: 30, current_quantity: 30, low_stock_threshold: 5,
};

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function Medications() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const qc = useQueryClient();
  const navigate = useNavigate();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [timeInput, setTimeInput] = useState("");

  const { data: meds = [], isLoading } = useQuery({
    queryKey: ["medications", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Medication[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        dosage: form.dosage,
        composition: form.composition || null,
        scheduled_time: form.scheduled_times[0] || form.scheduled_time,
        scheduled_times: form.scheduled_times,
        severity: form.severity,
        total_quantity: form.total_quantity,
        current_quantity: form.current_quantity,
        low_stock_threshold: form.low_stock_threshold,
        user_id: userId!,
      };
      if (editId) {
        const { error } = await supabase.from("medications").update(payload).eq("id", editId).eq("user_id", userId!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("medications").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medications"] });
      toast.success(editId ? "Medication updated" : "Medication added");
      closeDialog();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("medications").delete().eq("id", id).eq("user_id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medications"] });
      toast.success("Medication deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  function openAdd() {
    setEditId(null);
    setForm(defaultForm);
    setDialogOpen(true);
  }

  function openEdit(med: Medication) {
    setEditId(med.id);
    setForm({
      name: med.name,
      dosage: med.dosage,
      composition: med.composition || "",
      scheduled_time: med.scheduled_time,
      scheduled_times: med.scheduled_times || [med.scheduled_time],
      severity: med.severity,
      total_quantity: med.total_quantity ?? 30,
      current_quantity: med.current_quantity ?? 30,
      low_stock_threshold: med.low_stock_threshold ?? 5,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditId(null);
  }

  function addTime() {
    if (timeInput && !form.scheduled_times.includes(timeInput)) {
      setForm({ ...form, scheduled_times: [...form.scheduled_times, timeInput].sort() });
      setTimeInput("");
    }
  }

  function removeTime(t: string) {
    setForm({ ...form, scheduled_times: form.scheduled_times.filter((x) => x !== t) });
  }

  const isLowStock = (med: Medication) =>
    med.current_quantity != null && med.low_stock_threshold != null && med.current_quantity <= med.low_stock_threshold;

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans pb-20">
      <AppHeader title="Medications" showBack showTabs={false} onBack={() => navigate("/dashboard")} />

      <main className="max-w-lg mx-auto p-6 space-y-8">
        {/* Page Title Section */}
        <motion.div {...fadeIn} className="space-y-1">
          <h1 className="text-4xl font-black text-[#1e293b] tracking-tight">My Tablets</h1>
          <p className="text-[#64748b] font-bold">Track your medications and never miss a dose.</p>
        </motion.div>

        {/* Quick Actions Bar */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { label: 'Notification Setup', icon: <Bell className="w-4 h-4" /> },
            { label: 'Order Medicines', icon: <Truck className="w-4 h-4" /> },
            { label: 'Alarm Settings', icon: <Clock className="w-4 h-4" /> }
          ].map((action, i) => (
            <button key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black/5 shadow-sm whitespace-nowrap text-[12px] font-black text-[#64748b] hover:bg-slate-50 transition-colors">
              {action.icon} {action.label}
            </button>
          ))}
        </motion.div>

        {/* Primary Action */}
        <motion.button 
          {...fadeIn} 
          transition={{ delay: 0.1 }}
          onClick={openAdd}
          className="w-full bg-[#0087c1] text-white py-4 rounded-[24px] font-black text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 hover:bg-[#0076a8] transition-all active:scale-95"
        >
           <Plus className="w-7 h-7 stroke-[3]" /> Add Medication
        </motion.button>

        {/* Scan Section */}
        <motion.div 
          {...fadeIn} 
          transition={{ delay: 0.15 }}
          className="bg-[#0087c1] rounded-[24px] p-5 flex items-center justify-between text-white shadow-lg cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-[18px] flex items-center justify-center border border-white/20 shadow-inner">
                <Scan className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="font-black text-sm block">Scan Prescription</span>
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Instant Sync & Savings</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
        </motion.div>

        {/* Meds List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-black text-[#64748b] tracking-[0.2em] uppercase opacity-70">Medication Inventory</h3>
            <span className="text-[12px] font-black text-[#1e293b]">{format(new Date(), "p")}</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 animate-pulse text-slate-300">
               <Pill className="w-10 h-10 mb-2" />
               <div className="text-[10px] font-black uppercase tracking-widest">Checking stock...</div>
            </div>
          ) : meds.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-black/5 p-12 text-center shadow-sm">
               <Pill className="mx-auto h-12 w-12 text-slate-200 mb-4" />
               <p className="text-[#64748b] font-bold text-sm">Your medicine cabinet is empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meds.map((med, i) => (
                <motion.div 
                  key={med.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden flex flex-col group active:scale-[0.98] transition-transform"
                >
                  <div className="flex min-h-[120px]">
                     {/* Color strip based on severity */}
                     <div className={cn(
                       "w-3",
                       med.severity === 'critical' ? 'bg-rose-500' : 
                       med.severity === 'high' ? 'bg-amber-500' : 
                       med.severity === 'medium' ? 'bg-[#0087c1]' : 'bg-emerald-500'
                     )} />
                     
                     <div className="flex-1 p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                           <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xl font-black text-[#1e293b] tracking-tight">{med.name}</h4>
                                {isLowStock(med) && (
                                  <span className="flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter animate-pulse">
                                    <AlertTriangle className="w-2.5 h-2.5" /> Low Stock
                                  </span>
                                )}
                              </div>
                              <p className="text-[#64748b] font-bold text-sm">({med.composition || med.dosage})</p>
                           </div>
                           <div className="flex gap-1">
                              <button onClick={() => openEdit(med)} className="p-2 text-slate-300 hover:text-[#0087c1] transition-colors">
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button onClick={() => deleteMutation.mutate(med.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                <Trash2 className="w-5 h-5" />
                              </button>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-[11px] font-black text-[#64748b] border border-slate-100">
                             <Pill className="w-3.5 h-3.5 text-[#0087c1]" /> {med.dosage}
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-[11px] font-black text-[#64748b] border border-slate-100">
                             <Clock className="w-3.5 h-3.5 text-[#0087c1]" /> {med.scheduled_time}
                          </div>
                        </div>
                     </div>
                  </div>

                  {/* Stock Info Bar */}
                  <div className="px-6 py-3 bg-slate-50/50 border-t border-black/5 flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Status</span>
                        <div className="h-1 w-20 bg-slate-200 rounded-full overflow-hidden">
                           <div 
                             className={cn("h-full rounded-full transition-all duration-1000", isLowStock(med) ? "bg-rose-500" : "bg-emerald-500")} 
                             style={{ width: `${Math.min(100, ((med.current_quantity || 0) / (med.total_quantity || 1)) * 100)}%` }} 
                           />
                        </div>
                     </div>
                     <span className={cn("text-[11px] font-black", isLowStock(med) ? "text-rose-500" : "text-slate-600")}>
                        {med.current_quantity} / {med.total_quantity || "—"} Left
                     </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden my-8"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-[#f8f9fc]">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">
                {editId ? "Edit Medication" : "Add Medication"}
              </h2>
              <button onClick={closeDialog} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Medication Name *</label>
                <input required value={form.name} placeholder="e.g. Atorvastatin" onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-12 px-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Dosage *</label>
                  <input required value={form.dosage} placeholder="e.g. 20mg" onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                    className="w-full h-12 px-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Severity</label>
                  <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    className="w-full h-12 px-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical (Essential)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Inventory Management</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 block ml-1">Total</span>
                    <input type="number" min={0} value={form.total_quantity} onChange={(e) => setForm({ ...form, total_quantity: +e.target.value })}
                      className="w-full h-10 px-3 rounded-[12px] border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 block ml-1">Current</span>
                    <input type="number" min={0} value={form.current_quantity} onChange={(e) => setForm({ ...form, current_quantity: +e.target.value })}
                      className="w-full h-10 px-3 rounded-[12px] border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 block ml-1">Low At</span>
                    <input type="number" min={0} value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: +e.target.value })}
                      className="w-full h-10 px-3 rounded-[12px] border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeDialog} className="flex-1 h-12 rounded-[16px] border border-slate-100 font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 h-12 rounded-[16px] bg-[#0070c9] text-white font-black text-sm hover:bg-[#005ea9] shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all">
                  {saveMutation.isPending ? "Saving…" : editId ? "Update Med" : "Add Med"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <AppFooter />
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
