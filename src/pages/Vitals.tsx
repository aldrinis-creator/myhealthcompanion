import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import { Activity, Plus, Trash2, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type VitalScan = {
  id: string;
  heart_rate: number | null;
  respiratory_rate: number | null;
  hrv_sdnn: number | null;
  hrv_rmssd: number | null;
  heart_rate_confidence: number | null;
  scan_mode: string;
  created_at: string;
};

export default function Vitals() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ heart_rate: "", respiratory_rate: "", hrv_sdnn: "", hrv_rmssd: "" });

  const { data: scans = [], isLoading } = useQuery({
    queryKey: ["vitals-scans", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vitals_scans")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as VitalScan[];
    },
  });

  const chartData = [...scans].reverse().map((s) => ({
    date: format(new Date(s.created_at), "MMM d"),
    "Heart Rate": s.heart_rate,
    "Resp. Rate": s.respiratory_rate,
    "HRV (SDNN)": s.hrv_sdnn ? +s.hrv_sdnn : null,
  }));

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("vitals_scans").insert({
        user_id: userId!,
        heart_rate: form.heart_rate ? +form.heart_rate : null,
        respiratory_rate: form.respiratory_rate ? +form.respiratory_rate : null,
        hrv_sdnn: form.hrv_sdnn ? +form.hrv_sdnn : null,
        hrv_rmssd: form.hrv_rmssd ? +form.hrv_rmssd : null,
        scan_mode: "manual",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vitals-scans"] });
      toast.success("Vitals recorded");
      setDialogOpen(false);
      setForm({ heart_rate: "", respiratory_rate: "", hrv_sdnn: "", hrv_rmssd: "" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vitals_scans").delete().eq("id", id).eq("user_id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vitals-scans"] });
      toast.success("Record deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vitals</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your heart rate, respiratory rate & HRV</p>
        </div>
        <button onClick={() => setDialogOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Manual Entry
        </button>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="bg-card rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Trends</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Heart Rate" stroke="hsl(var(--health-red))" strokeWidth={2} dot={false} connectNulls />
              <Line type="monotone" dataKey="Resp. Rate" stroke="hsl(var(--health-blue))" strokeWidth={2} dot={false} connectNulls />
              <Line type="monotone" dataKey="HRV (SDNN)" stroke="hsl(var(--health-green))" strokeWidth={2} dot={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History */}
      {isLoading ? (
        <div className="text-muted-foreground text-sm animate-pulse">Loading…</div>
      ) : scans.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-10 text-center">
          <Activity className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No vitals recorded yet.</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">HR (bpm)</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">RR (/min)</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">HRV SDNN</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Mode</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {scans.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-foreground">{format(new Date(s.created_at), "MMM d, h:mm a")}</td>
                  <td className="px-4 py-3 text-foreground">{s.heart_rate ?? "—"}</td>
                  <td className="px-4 py-3 text-foreground">{s.respiratory_rate ?? "—"}</td>
                  <td className="px-4 py-3 text-foreground">{s.hrv_sdnn ? (+s.hrv_sdnn).toFixed(1) : "—"}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{s.scan_mode}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteMutation.mutate(s.id)} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
          <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Manual Vitals Entry</h2>
              <button onClick={() => setDialogOpen(false)} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate(); }} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Heart Rate (bpm)</label>
                  <input type="number" min={30} max={250} value={form.heart_rate} onChange={(e) => setForm({ ...form, heart_rate: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Resp. Rate (/min)</label>
                  <input type="number" min={5} max={60} value={form.respiratory_rate} onChange={(e) => setForm({ ...form, respiratory_rate: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">HRV SDNN (ms)</label>
                  <input type="number" min={0} value={form.hrv_sdnn} onChange={(e) => setForm({ ...form, hrv_sdnn: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">HRV RMSSD (ms)</label>
                  <input type="number" min={0} value={form.hrv_rmssd} onChange={(e) => setForm({ ...form, hrv_rmssd: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={addMutation.isPending} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                  {addMutation.isPending ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
