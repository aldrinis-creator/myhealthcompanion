import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format, isPast, isToday, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarCheck, Plus, Edit2, Trash2, MapPin, User, Clock, X, CheckCircle2, AlertCircle, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

type Appointment = {
  id: string;
  title: string;
  description: string | null;
  appointment_date: string;
  appointment_time: string;
  end_time: string | null;
  location: string | null;
  doctor_name: string | null;
  appointment_type: string;
  recurrence: string;
  first_alert_minutes: number;
  second_alert_minutes: number | null;
  doctor_status: string | null;
  doctor_response_note: string | null;
  doctor_proposed_date: string | null;
  doctor_proposed_time: string | null;
  created_at: string;
};

const defaultForm = {
  title: "", description: "", appointment_date: format(new Date(), "yyyy-MM-dd"),
  appointment_time: "09:00", end_time: "", location: "", doctor_name: "",
  appointment_type: "in_person", recurrence: "none",
  first_alert_minutes: 15, second_alert_minutes: null as number | null,
};

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function Appointments() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const qc = useQueryClient();
  const navigate = useNavigate();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [filter, setFilter] = useState<"upcoming" | "past" | "today">("upcoming");

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", userId!)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });
      if (error) throw error;
      return data as Appointment[];
    },
  });

  const filtered = appointments.filter((a) => {
    const d = a.appointment_date;
    if (filter === "today") return isToday(parseISO(d));
    if (filter === "past") return isPast(parseISO(d)) && !isToday(parseISO(d));
    return !isPast(parseISO(d)) || isToday(parseISO(d));
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description || null,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        end_time: form.end_time || null,
        location: form.location || null,
        doctor_name: form.doctor_name || null,
        appointment_type: form.appointment_type,
        recurrence: form.recurrence,
        first_alert_minutes: form.first_alert_minutes,
        second_alert_minutes: form.second_alert_minutes,
        user_id: userId!,
      };
      if (editId) {
        const { error } = await supabase.from("appointments").update(payload).eq("id", editId).eq("user_id", userId!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("appointments").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(editId ? "Appointment updated" : "Appointment created");
      closeDialog();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").delete().eq("id", id).eq("user_id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  function openAdd() { setEditId(null); setForm(defaultForm); setDialogOpen(true); }

  function openEdit(a: Appointment) {
    setEditId(a.id);
    setForm({
      title: a.title, description: a.description || "",
      appointment_date: a.appointment_date, appointment_time: a.appointment_time,
      end_time: a.end_time || "", location: a.location || "", doctor_name: a.doctor_name || "",
      appointment_type: a.appointment_type, recurrence: a.recurrence,
      first_alert_minutes: a.first_alert_minutes,
      second_alert_minutes: a.second_alert_minutes,
    });
    setDialogOpen(true);
  }

  function closeDialog() { setDialogOpen(false); setEditId(null); }

  const doctorStatusBadge = (status: string | null) => {
    if (!status || status === "pending") return <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-tighter">Pending</span>;
    if (status === "confirmed") return <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-tighter">Confirmed</span>;
    if (status === "declined") return <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 uppercase tracking-tighter">Declined</span>;
    if (status === "rescheduled") return <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase tracking-tighter">Rescheduled</span>;
    return null;
  };

  const formatTime12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans">
      <AppHeader title="Appointments" showBack showTabs={false} onBack={() => navigate("/dashboard")} />

      <main className="max-w-lg mx-auto p-4 space-y-6 pb-32">
        <motion.div {...fadeIn} className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Your Schedule</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-none">Manage visits & checkups</p>
          </div>
          <Button 
            onClick={openAdd}
            className="bg-[#0070c9] hover:bg-[#005ea9] rounded-[16px] px-5 h-12 font-black shadow-md shadow-blue-500/20 text-white"
          >
            <Plus className="h-5 w-5 mr-1" /> Book New
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }} className="flex gap-2 bg-slate-100/50 p-1.5 rounded-[20px] border border-slate-100">
          {(["upcoming", "today", "past"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn(
                "flex-1 h-10 rounded-[14px] text-[11px] font-black uppercase tracking-wider transition-all",
                filter === f ? "bg-white text-slate-800 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
              )}>
              {f === "upcoming" ? "Upcoming" : f === "today" ? "Today" : "Past"}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse text-slate-300">
            <Calendar className="w-12 h-12 mb-4" />
            <div className="text-xs font-black uppercase tracking-widest">Loading visits...</div>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            {...fadeIn}
            className="bg-white p-12 rounded-[32px] border border-slate-100 shadow-sm text-center space-y-4"
          >
            <div className="w-16 h-16 bg-[#f1f3fd] rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-[#0070c9]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">All Caught Up!</h2>
              <p className="text-slate-400 text-sm font-bold">No {filter} appointments found.</p>
            </div>
            <Button onClick={openAdd} variant="outline" className="rounded-full px-8 font-black text-xs uppercase tracking-wider h-11 border-slate-200">
              Schedule Now
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((a, index) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "bg-white p-6 rounded-[28px] border shadow-sm transition-all group active:scale-[0.98]",
                  isToday(parseISO(a.appointment_date)) ? "border-amber-200 shadow-amber-500/5" : "border-slate-100"
                )}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                      isToday(parseISO(a.appointment_date)) ? "bg-amber-50 text-amber-600" : "bg-[#f1f3fd] text-[#0070c9]"
                    )}>
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none">{a.title}</h3>
                        {doctorStatusBadge(a.doctor_status)}
                      </div>
                      <p className="text-[13px] font-bold text-slate-500">{a.doctor_name || "Doctor TBD"}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(a)} className="p-2 rounded-full hover:bg-slate-50 transition-colors">
                      <Edit2 className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
                    </button>
                    <button onClick={() => deleteMutation.mutate(a.id)} className="p-2 rounded-full hover:bg-rose-50 transition-colors">
                      <Trash2 className="h-4 w-4 text-slate-200 group-hover:text-rose-400" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Time & Date</span>
                    </div>
                    <div className="text-[13px] font-black text-slate-800">
                      {format(parseISO(a.appointment_date), "MMM d, EEE")} · {formatTime12(a.appointment_time)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Location</span>
                    </div>
                    <div className="text-[13px] font-black text-slate-800 truncate">
                      {a.location || "TBD / Virtual"}
                    </div>
                  </div>
                </div>
                
                {a.description && (
                  <div className="mt-4 p-3 rounded-[16px] bg-slate-50/50 text-[#64748b] text-[11px] font-bold leading-relaxed border border-slate-50 italic">
                    {a.description}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
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
                {editId ? "Edit Appointment" : "New Appointment"}
              </h2>
              <button onClick={closeDialog} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Title *</label>
                <input required value={form.title} placeholder="e.g. Dental Checkup" onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full h-12 px-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Date *</label>
                  <input type="date" required value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                    className="w-full h-12 px-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Time *</label>
                  <input type="time" required value={form.appointment_time} onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                    className="w-full h-12 px-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Doctor Name</label>
                <input value={form.doctor_name} placeholder="Dr. Smith" onChange={(e) => setForm({ ...form, doctor_name: e.target.value })}
                  className="w-full h-12 px-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Location</label>
                <input value={form.location} placeholder="Hospital / Clinical Address" onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full h-12 px-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Notes</label>
                <textarea value={form.description} placeholder="Special instructions or prep..." onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full p-4 rounded-[16px] border border-slate-200 bg-slate-50 text-slate-800 font-bold text-sm focus:outline-none resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeDialog} className="flex-1 h-12 rounded-[16px] border border-slate-100 font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 h-12 rounded-[16px] bg-[#0070c9] text-white font-black text-sm hover:bg-[#005ea9] shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all">
                  {saveMutation.isPending ? "Saving…" : editId ? "Update Visit" : "Book Visit"}
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
