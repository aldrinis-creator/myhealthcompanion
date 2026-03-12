import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format, isPast, isToday, parseISO } from "date-fns";
import {
  CalendarCheck, Plus, Edit2, Trash2, MapPin, User, Clock, X, CheckCircle2, AlertCircle,
} from "lucide-react";

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

export default function Appointments() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const qc = useQueryClient();
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
    if (!status || status === "pending") return <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Pending</span>;
    if (status === "confirmed") return <span className="text-xs px-2 py-0.5 rounded-full bg-health-green/10 text-health-green">Confirmed</span>;
    if (status === "declined") return <span className="text-xs px-2 py-0.5 rounded-full bg-health-red/10 text-health-red">Declined</span>;
    if (status === "rescheduled") return <span className="text-xs px-2 py-0.5 rounded-full bg-health-amber/10 text-health-amber">Rescheduled</span>;
    return null;
  };

  const formatTime12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground text-sm mt-1">Schedule and manage your appointments</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["upcoming", "today", "past"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {f === "upcoming" ? "Upcoming" : f === "today" ? "Due Today" : "Past"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-muted-foreground text-sm animate-pulse">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-10 text-center">
          <CalendarCheck className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No {filter} appointments.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((a) => (
            <div key={a.id} className={`bg-card rounded-lg border p-4 flex items-start gap-4 ${isToday(parseISO(a.appointment_date)) ? "border-health-amber" : "border-border"}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isToday(parseISO(a.appointment_date)) ? "bg-health-amber/10 text-health-amber" : "bg-primary/10 text-primary"}`}>
                <CalendarCheck className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">{a.title}</span>
                  {doctorStatusBadge(a.doctor_status)}
                  {a.recurrence !== "none" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{a.recurrence}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(parseISO(a.appointment_date), "EEE, MMM d, yyyy")} at {formatTime12(a.appointment_time)}
                  {a.end_time && ` – ${formatTime12(a.end_time)}`}
                </p>
                {a.description && <p className="text-xs text-muted-foreground mt-1">{a.description}</p>}
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  {a.doctor_name && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><User className="h-3 w-3" />{a.doctor_name}</span>
                  )}
                  {a.location && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{a.location}</span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />Alert: {a.first_alert_minutes}m before</span>
                </div>
                {a.doctor_response_note && (
                  <p className="text-xs text-health-amber mt-2 flex items-center gap-1"><AlertCircle className="h-3 w-3" />Doctor: {a.doctor_response_note}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(a)} className="p-2 rounded-md hover:bg-muted transition-colors"><Edit2 className="h-4 w-4 text-muted-foreground" /></button>
                <button onClick={() => deleteMutation.mutate(a.id)} className="p-2 rounded-md hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4 text-destructive" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
          <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{editId ? "Edit Appointment" : "New Appointment"}</h2>
              <button onClick={closeDialog} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Date *</label>
                  <input type="date" required value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Start Time *</label>
                  <input type="time" required value={form.appointment_time} onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">End Time</label>
                  <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Type</label>
                  <select value={form.appointment_type} onChange={(e) => setForm({ ...form, appointment_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                    <option value="in_person">In Person</option>
                    <option value="virtual">Virtual</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Doctor Name</label>
                  <input value={form.doctor_name} onChange={(e) => setForm({ ...form, doctor_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Recurrence</label>
                  <select value={form.recurrence} onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Alert (min before)</label>
                  <input type="number" min={0} value={form.first_alert_minutes} onChange={(e) => setForm({ ...form, first_alert_minutes: +e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeDialog} className="px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                  {saveMutation.isPending ? "Saving…" : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
