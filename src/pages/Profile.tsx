import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { UserCircle, Save, Heart, Phone, Shield } from "lucide-react";

export default function Profile() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const qc = useQueryClient();

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
    allergies: "" as string, medical_conditions: "" as string, food_preference: "",
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

  const bmi = form.height_cm && form.weight_kg
    ? (+form.weight_kg / (+form.height_cm / 100) ** 2).toFixed(1)
    : null;

  const inputCls = "w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none";

  if (isLoading) return <div className="text-muted-foreground text-sm animate-pulse p-6">Loading profile…</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">{session?.user?.email}</p>
        </div>
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
          <Save className="h-4 w-4" />{saveMutation.isPending ? "Saving…" : "Save"}
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-6">
        {/* Personal */}
        <section className="bg-card rounded-lg border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><UserCircle className="h-4 w-4" />Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">First Name</label><input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={inputCls} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Last Name</label><input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={inputCls} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Display Name</label><input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className={inputCls} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Date of Birth</label><input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className={inputCls} /></div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputCls}>
                <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Mobile</label>
              <div className="flex gap-2">
                <input value={form.mobile_country_code} onChange={(e) => setForm({ ...form, mobile_country_code: e.target.value })} className={`${inputCls} w-20`} />
                <input value={form.mobile_number} onChange={(e) => setForm({ ...form, mobile_number: e.target.value })} className={inputCls} placeholder="Phone number" />
              </div>
            </div>
          </div>
        </section>

        {/* Medical */}
        <section className="bg-card rounded-lg border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><Heart className="h-4 w-4" />Medical Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Blood Type</label>
              <select value={form.blood_type} onChange={(e) => setForm({ ...form, blood_type: e.target.value })} className={inputCls}>
                <option value="">Select</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Height (cm)</label>
              <input type="number" value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Weight (kg)</label>
              <input type="number" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} className={inputCls} />
              {bmi && <p className="text-xs text-muted-foreground">BMI: {bmi}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Allergies (comma-separated)</label>
            <input value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} className={inputCls} placeholder="e.g. Penicillin, Nuts" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Medical Conditions (comma-separated)</label>
            <input value={form.medical_conditions} onChange={(e) => setForm({ ...form, medical_conditions: e.target.value })} className={inputCls} placeholder="e.g. Diabetes, Hypertension" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Food Preference</label>
              <select value={form.food_preference} onChange={(e) => setForm({ ...form, food_preference: e.target.value })} className={inputCls}>
                <option value="">Select</option><option value="vegetarian">Vegetarian</option><option value="non-vegetarian">Non-Vegetarian</option><option value="vegan">Vegan</option><option value="eggetarian">Eggetarian</option>
              </select>
            </div>
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Doctor Name</label><input value={form.doctor_name} onChange={(e) => setForm({ ...form, doctor_name: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Doctor Mobile</label><input value={form.doctor_mobile} onChange={(e) => setForm({ ...form, doctor_mobile: e.target.value })} className={inputCls} /></div>
        </section>

        {/* Emergency */}
        <section className="bg-card rounded-lg border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><Phone className="h-4 w-4" />Emergency Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Name</label><input value={form.emergency_contact_name} onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })} className={inputCls} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Phone</label><input value={form.emergency_contact_phone} onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })} className={inputCls} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Relationship</label><input value={form.emergency_contact_relationship} onChange={(e) => setForm({ ...form, emergency_contact_relationship: e.target.value })} className={inputCls} /></div>
          </div>
        </section>

        {/* Settings */}
        <section className="bg-card rounded-lg border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><Shield className="h-4 w-4" />Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Medication Window (min)</label>
              <input type="number" value={form.medication_window_minutes} onChange={(e) => setForm({ ...form, medication_window_minutes: +e.target.value })} className={inputCls} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Nudge Interval (hrs)</label>
              <input type="number" value={form.nudge_interval_hours} onChange={(e) => setForm({ ...form, nudge_interval_hours: +e.target.value })} className={inputCls} /></div>
            <div className="space-y-1 flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={form.weekly_report_enabled} onChange={(e) => setForm({ ...form, weekly_report_enabled: e.target.checked })}
                  className="rounded border-input" />
                Weekly Report
              </label>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
