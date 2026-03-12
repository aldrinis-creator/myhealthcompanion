import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Pill, Plus, Edit2, Trash2, AlertTriangle, CheckCircle2, Clock, X,
} from "lucide-react";

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

const severityColors: Record<string, string> = {
  critical: "bg-health-red/10 text-health-red border-health-red/30",
  high: "bg-health-amber/10 text-health-amber border-health-amber/30",
  medium: "bg-health-blue/10 text-health-blue border-health-blue/30",
  low: "bg-health-green/10 text-health-green border-health-green/30",
};

const defaultForm = {
  name: "", dosage: "", composition: "", scheduled_time: "08:00",
  scheduled_times: ["08:00"], severity: "medium",
  total_quantity: 30, current_quantity: 30, low_stock_threshold: 5,
};

export default function Medications() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const qc = useQueryClient();
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
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medications</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your medications and track stock</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Medication
        </button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground text-sm animate-pulse">Loading medications…</div>
      ) : meds.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-10 text-center">
          <Pill className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No medications added yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {meds.map((med) => (
            <div key={med.id} className="bg-card rounded-lg border border-border p-4 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${severityColors[med.severity] || severityColors.medium}`}>
                <Pill className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">{med.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${severityColors[med.severity] || severityColors.medium}`}>
                    {med.severity}
                  </span>
                  {!med.is_active && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inactive</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{med.dosage}</p>
                {med.composition && <p className="text-xs text-muted-foreground">{med.composition}</p>}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {(med.scheduled_times || [med.scheduled_time]).map((t) => t.slice(0, 5)).join(", ")}
                  </div>
                  {med.current_quantity != null && (
                    <div className={`flex items-center gap-1 text-xs ${isLowStock(med) ? "text-health-red font-medium" : "text-muted-foreground"}`}>
                      {isLowStock(med) && <AlertTriangle className="h-3 w-3" />}
                      Stock: {med.current_quantity}/{med.total_quantity ?? "—"}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(med)} className="p-2 rounded-md hover:bg-muted transition-colors">
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => deleteMutation.mutate(med.id)} className="p-2 rounded-md hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
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
              <h2 className="text-lg font-semibold text-foreground">{editId ? "Edit Medication" : "Add Medication"}</h2>
              <button onClick={closeDialog} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Dosage *</label>
                  <input required value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                    placeholder="e.g. 500mg" className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Severity</label>
                  <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Composition</label>
                <input value={form.composition} onChange={(e) => setForm({ ...form, composition: e.target.value })}
                  placeholder="Salt / active ingredient" className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Scheduled Times</label>
                <div className="flex gap-2">
                  <input type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                  <button type="button" onClick={addTime} className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.scheduled_times.map((t) => (
                    <span key={t} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">
                      {t.slice(0, 5)}
                      <button type="button" onClick={() => removeTime(t)}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Total Qty</label>
                  <input type="number" min={0} value={form.total_quantity} onChange={(e) => setForm({ ...form, total_quantity: +e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Current Qty</label>
                  <input type="number" min={0} value={form.current_quantity} onChange={(e) => setForm({ ...form, current_quantity: +e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Low Stock At</label>
                  <input type="number" min={0} value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: +e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeDialog} className="px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                  {saveMutation.isPending ? "Saving…" : editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
