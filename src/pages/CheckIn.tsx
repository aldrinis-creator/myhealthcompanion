import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, CheckCircle2, ChevronRight, Activity, Smile, Heart, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import AppFooter from "@/components/AppFooter";

const fadeIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 }
};

export default function CheckIn() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [mood, setMood] = useState<string | null>(null);

    const handleFinish = async () => {
        try {
            const { error } = await supabase
                .from("user_activity")
                .update({ last_check_in_at: new Date().toISOString() })
                .eq("user_id", user!.id);

            if (error) throw error;

            toast.success("Check-In completed! Stay healthy.");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Failed to record Check-In.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#334155] font-sans flex flex-col">
            <header className="bg-white border-b-2 border-[#0087c1]/10 h-20 shrink-0">
                <div className="container h-full flex items-center justify-between px-6 max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                            <ArrowLeft className="w-6 h-6 text-[#64748b]" />
                        </Button>
                        <h1 className="text-2xl font-bold text-[#0087c1]">Daily Check-IN</h1>
                    </div>
                    <div className="text-sm font-bold text-[#64748b] bg-[#f1f3fd] px-4 py-1.5 rounded-full">
                        Step {step} of 3
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" {...fadeIn} className="text-center space-y-10 w-full">
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-black/5 space-y-8">
                                <Smile className="w-20 h-20 text-[#0087c1] mx-auto" />
                                <h2 className="text-3xl font-black text-[#1e293b] tracking-tight">How are you feeling today?</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {["Great", "Good", "Okay", "Not Well"].map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setMood(m)}
                                            className={`h-16 rounded-2xl font-bold text-lg transition-all border-2 ${mood === m ? "bg-[#0087c1] text-white border-[#0087c1] shadow-lg shadow-[#0087c1]/20" : "bg-white text-[#64748b] border-black/5 hover:border-[#0087c1]/30"
                                                }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Button
                                disabled={!mood}
                                onClick={() => setStep(2)}
                                className="w-full h-16 bg-[#0087c1] hover:bg-[#0076a8] rounded-[24px] text-xl font-black shadow-xl shadow-[#0087c1]/20 text-white flex gap-2"
                            >
                                Next <ChevronRight className="w-6 h-6" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" {...fadeIn} className="text-center space-y-10 w-full">
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-black/5 space-y-8">
                                <Heart className="w-20 h-20 text-[#e11d48] mx-auto" />
                                <h2 className="text-3xl font-black text-[#1e293b] tracking-tight">Any new symptoms?</h2>
                                <p className="text-[#64748b] font-medium text-lg">Did you experience anything unusual since yesterday?</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(3)} className="flex-1 h-16 rounded-2xl bg-[#f1f3fd] text-[#64748b] font-bold text-lg border border-black/5 hover:bg-blue-50 transition-colors">
                                        No Symptoms
                                    </button>
                                    <button onClick={() => setStep(3)} className="flex-1 h-16 rounded-2xl bg-white border-2 border-[#0087c1] text-[#0087c1] font-bold text-lg shadow-sm">
                                        Report Issue
                                    </button>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => setStep(1)}
                                className="text-[#64748b] font-bold"
                            >
                                Go Back
                            </Button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" {...fadeIn} className="text-center space-y-10 w-full">
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-black/5 space-y-8">
                                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                                </div>
                                <h2 className="text-3xl font-black text-[#1e293b] tracking-tight">You're all set!</h2>
                                <p className="text-[#64748b] font-medium text-lg">Thank you for updating your health status. Your guardians will be informed if anything needs attention.</p>
                            </div>
                            <Button
                                onClick={handleFinish}
                                className="w-full h-16 bg-[#0087c1] hover:bg-[#0076a8] rounded-[24px] text-xl font-black shadow-xl shadow-[#0087c1]/20 text-white"
                            >
                                Complete Check-IN
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <AppFooter />
        </div>
    );
}
