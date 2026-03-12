import { useState } from "react";
import { ShieldAlert, CheckCircle, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function QuickActions() {
    const { user } = useAuth();
    const [isSleepMode, setIsSleepMode] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSOS = async () => {
        if (!user) return;
        setIsProcessing(true);
        try {
            const { error } = await supabase
                .from("user_activity")
                .update({
                    sos_status: "active",
                    sos_started_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq("user_id", user.id);

            if (error) throw error;

            toast.error("SOS Alert Triggered!", {
                description: "Emergency services and guardians are being notified.",
                duration: 10000,
            });
        } catch (error: any) {
            toast.error("SOS failed", { description: error.message });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCheckIn = async () => {
        if (!user) return;
        setIsProcessing(true);
        try {
            const { error } = await supabase
                .from("user_activity")
                .update({
                    last_check_in_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq("user_id", user.id);

            if (error) throw error;
            toast.success("Check-in successful!", {
                description: "Your health status has been updated.",
            });
        } catch (error: any) {
            toast.error("Check-in failed", { description: error.message });
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleSleepMode = () => {
        setIsSleepMode(!isSleepMode);
        toast(isSleepMode ? "Sleep Mode Off" : "Sleep Mode On", {
            description: isSleepMode ? "Monitoring restored to normal." : "Monitoring adjusted for rest.",
            icon: isSleepMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl px-4">
            <Button
                variant="destructive"
                size="lg"
                disabled={isProcessing}
                onClick={handleSOS}
                className="h-24 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
            >
                <ShieldAlert className="w-8 h-8" />
                <span className="font-bold text-lg uppercase tracking-tighter text-white">Emergency SOS</span>
            </Button>

            <Button
                variant="secondary"
                size="lg"
                disabled={isProcessing}
                onClick={handleCheckIn}
                className="h-24 rounded-2xl flex flex-col items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
            >
                <CheckCircle className="w-8 h-8" />
                <span className="font-bold text-lg uppercase tracking-tighter">Daily Check-In</span>
            </Button>

            <Button
                variant="outline"
                size="lg"
                onClick={toggleSleepMode}
                className={cn(
                    "h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all duration-300 hover:scale-[1.02] active:scale-95",
                    isSleepMode
                        ? "bg-indigo-900 border-indigo-400 text-indigo-100 shadow-lg shadow-indigo-500/20"
                        : "bg-white/5 border-white/10 text-white"
                )}
            >
                {isSleepMode ? <Moon className="w-8 h-8" /> : <Sun className="w-8 h-8" />}
                <span className="font-bold text-lg uppercase tracking-tighter">
                    {isSleepMode ? "Sleep Mode On" : "Sleep Mode Off"}
                </span>
            </Button>
        </div>
    );
}
