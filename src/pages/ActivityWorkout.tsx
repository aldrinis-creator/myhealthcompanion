import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Activity, Dumbbell } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default function ActivityWorkout() {
    const navigate = useNavigate();

    const handleBack = useCallback(() => {
        requestAnimationFrame(() => navigate("/my-health"));
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
            <AppHeader title="Activity / Workout Plan" showBack onBack={handleBack} />

            <main className="container max-w-4xl mx-auto py-12 px-6 space-y-8">
                <div className="text-center space-y-2 mb-10">
                    <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Activity / Workout Plan</h2>
                    <p className="text-lg text-[#64748b] font-medium">Track your activities or plan your workouts</p>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm text-center space-y-8 cursor-pointer hover:shadow-md transition-all duration-300 opacity-0 animate-fade-in">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#0087c1] mx-auto">
                        <Activity className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black">Start New Activity</h3>
                        <p className="text-[#64748b] font-medium mt-2">Track heart rate, steps, distance & duration in real-time</p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm text-center space-y-8 cursor-pointer hover:shadow-md transition-all duration-300 opacity-0 animate-fade-in [animation-delay:100ms]">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#0087c1] mx-auto">
                        <Dumbbell className="w-10 h-10 text-[#0087c1]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black">Workout Plan</h3>
                        <p className="text-[#64748b] font-medium mt-2">AI-generated or curated workout plans tailored to you</p>
                    </div>
                </div>

                <AppFooter />
            </main>
        </div>
    );
}
