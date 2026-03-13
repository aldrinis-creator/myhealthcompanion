import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, differenceInYears } from "date-fns";
import { motion } from "framer-motion";
import {
  FileDown, Share2, Heart, Thermometer, Droplets, Wind, Activity, AlertTriangle
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { toast } from "sonner";
import jsPDF from "jspdf";

const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

export default function DoctorVisitReport() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["dvr-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, date_of_birth, gender, blood_type, allergies, medical_conditions, weight_kg, height_cm")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: latestVitals } = useQuery({
    queryKey: ["dvr-vitals", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("wellness_scores")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const { data: meds = [] } = useQuery({
    queryKey: ["dvr-meds", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_active", true)
        .order("severity", { ascending: true });
      return data || [];
    },
  });

  const age = profile?.date_of_birth
    ? differenceInYears(new Date(), new Date(profile.date_of_birth))
    : null;

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "—";

  const riskColor = latestVitals?.risk_level === "high"
    ? "text-destructive"
    : latestVitals?.risk_level === "low"
    ? "text-health-green"
    : "text-health-amber";

  const vitalsItems = [
    { label: "Blood Pressure", value: latestVitals?.bp_systolic && latestVitals?.bp_diastolic ? `${latestVitals.bp_systolic}/${latestVitals.bp_diastolic}` : "—", unit: "mmHg", icon: <Activity className="w-4 h-4" /> },
    { label: "Heart Rate", value: latestVitals?.heart_rate ?? "—", unit: "bpm", icon: <Heart className="w-4 h-4" /> },
    { label: "SpO2", value: latestVitals?.spo2 ?? "—", unit: "%", icon: <Droplets className="w-4 h-4" /> },
    { label: "Temperature", value: latestVitals?.temperature ?? "—", unit: "°F", icon: <Thermometer className="w-4 h-4" /> },
    { label: "Blood Sugar", value: latestVitals?.diabetes_value ?? "—", unit: "mg/dL", icon: <Droplets className="w-4 h-4" /> },
    { label: "Respiratory", value: latestVitals?.respiratory_rate ?? "—", unit: "bpm", icon: <Wind className="w-4 h-4" /> },
  ];

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Doctor Visit Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(), "PPP p")}`, 20, 28);

    doc.setFontSize(13);
    doc.text("Patient Information", 20, 42);
    doc.setFontSize(10);
    doc.text(`Name: ${fullName}`, 20, 50);
    doc.text(`Age: ${age ?? "—"} | Gender: ${profile?.gender || "—"} | Blood Type: ${profile?.blood_type || "—"}`, 20, 56);
    doc.text(`Allergies: ${profile?.allergies?.join(", ") || "None"}`, 20, 62);
    doc.text(`Conditions: ${profile?.medical_conditions?.join(", ") || "None"}`, 20, 68);

    doc.setFontSize(13);
    doc.text("Latest Vitals", 20, 82);
    doc.setFontSize(10);
    vitalsItems.forEach((v, i) => {
      doc.text(`${v.label}: ${v.value} ${v.unit}`, 20, 90 + i * 6);
    });

    doc.setFontSize(13);
    doc.text("Active Medications", 20, 130);
    doc.setFontSize(10);
    meds.forEach((med: any, i: number) => {
      doc.text(`${med.name} (${med.dosage}) — ${med.severity}`, 20, 138 + i * 6);
    });

    doc.save(`doctor-visit-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    toast.success("PDF downloaded");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Doctor Visit Report",
          text: `Health report for ${fullName} — ${format(new Date(), "PPP")}`,
        });
      } catch {}
    } else {
      toast.info("Share not supported on this device");
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-20">
      <AppHeader title="Doctor Visit Report" showBack showTabs={false} onBack={() => navigate("/health-tools")} />

      <main className="max-w-lg mx-auto p-6 space-y-6">
        {/* Action Buttons */}
        <motion.div {...fadeIn} className="flex gap-3">
          <button onClick={generatePDF} className="flex-1 h-12 rounded-[16px] bg-primary text-primary-foreground font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all">
            <FileDown className="w-5 h-5" /> Download PDF
          </button>
          <button onClick={handleShare} className="flex-1 h-12 rounded-[16px] bg-card border border-border text-foreground font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
            <Share2 className="w-5 h-5" /> Share
          </button>
        </motion.div>

        {/* Patient Info */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }} className="bg-card rounded-[24px] border border-border shadow-sm p-6 space-y-4">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em]">Patient Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="font-bold text-muted-foreground">Name</span><span className="font-black text-foreground">{fullName}</span></div>
            <div className="flex justify-between"><span className="font-bold text-muted-foreground">Age</span><span className="font-black text-foreground">{age ?? "—"}</span></div>
            <div className="flex justify-between"><span className="font-bold text-muted-foreground">Gender</span><span className="font-black text-foreground">{profile?.gender || "—"}</span></div>
            <div className="flex justify-between"><span className="font-bold text-muted-foreground">Blood Type</span><span className="font-black text-foreground">{profile?.blood_type || "—"}</span></div>
            <div className="flex justify-between"><span className="font-bold text-muted-foreground">Allergies</span><span className="font-black text-foreground">{profile?.allergies?.join(", ") || "None"}</span></div>
            <div className="flex justify-between"><span className="font-bold text-muted-foreground">Conditions</span><span className="font-black text-foreground text-right max-w-[60%]">{profile?.medical_conditions?.join(", ") || "None"}</span></div>
          </div>
        </motion.div>

        {/* Vitals */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="bg-card rounded-[24px] border border-border shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em]">Latest Vitals</h3>
            {latestVitals && (
              <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${riskColor}`}>
                <AlertTriangle className="w-3 h-3" /> {latestVitals.risk_level} risk
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {vitalsItems.map((v, i) => (
              <div key={i} className="p-3 bg-muted rounded-[16px] flex items-center gap-3">
                <div className="text-primary">{v.icon}</div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">{v.label}</p>
                  <p className="text-lg font-black text-foreground leading-tight">{v.value} <span className="text-[10px] text-muted-foreground font-bold">{v.unit}</span></p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Medications */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="bg-card rounded-[24px] border border-border shadow-sm p-6 space-y-4">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em]">Active Medications</h3>
          {meds.length === 0 ? (
            <p className="text-sm text-muted-foreground font-bold">No active medications</p>
          ) : (
            <div className="space-y-3">
              {meds.map((med: any) => (
                <div key={med.id} className="flex items-center justify-between p-3 bg-muted rounded-[16px]">
                  <div>
                    <p className="font-black text-sm text-foreground">{med.name}</p>
                    <p className="text-[11px] text-muted-foreground font-bold">{med.dosage} {med.composition ? `(${med.composition})` : ""}</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                    med.severity === "critical" || med.severity === "high"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {med.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <p className="text-[10px] text-muted-foreground text-center font-bold">
          Report generated on {format(new Date(), "PPP 'at' p")}
        </p>
      </main>

      <AppFooter />
    </div>
  );
}
