import { useNavigate } from "react-router-dom";
import { Pill, Wrench, Truck, Activity, Scan, Heart, Utensils, Stethoscope, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.04 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
};

export default function MyHealth() {
    const navigate = useNavigate();

    const categories = [
        { id: "tablets", name: "Tablets", icon: <Pill className="w-6 h-6" />, color: "text-[#0087C1]", bg: "bg-blue-50" },
        { id: "health-tools", name: "Health Tools", icon: <Wrench className="w-6 h-6" />, color: "text-[#0087C1]", bg: "bg-blue-50" },
        { id: "ambulance", name: "Ambulance", icon: <Truck className="w-6 h-6" />, color: "text-[#e11d48]", bg: "bg-red-50" },
        { id: "activity", name: "Activity / Workout", icon: <Activity className="w-6 h-6" />, color: "text-emerald-500", bg: "bg-emerald-50" },
        { id: "face-scan", name: "Face Scan", icon: <Scan className="w-6 h-6" />, color: "text-indigo-500", bg: "bg-indigo-50" },
        { id: "wellness", name: "Wellness", icon: <Heart className="w-6 h-6" />, color: "text-rose-500", bg: "bg-rose-50" },
        { id: "nutrition", name: "Nutrition", icon: <Utensils className="w-6 h-6" />, color: "text-orange-500", bg: "bg-orange-50" },
        { id: "services", name: "Services", icon: <Stethoscope className="w-6 h-6" />, color: "text-slate-500", bg: "bg-slate-50" },
        { id: "care-journal", name: "Care Journal", icon: <BookOpen className="w-6 h-6" />, color: "text-teal-500", bg: "bg-teal-50" },
    ];

    const handleCategoryClick = (id: string) => {
        switch (id) {
            case "tablets": navigate("/medications"); break;
            case "health-tools": navigate("/health-tools"); break;
            case "activity": navigate("/activity"); break;
            case "face-scan": navigate("/face-scan"); break;
            case "wellness": navigate("/health-vitals"); break;
            case "nutrition": navigate("/nutrition-advisor"); break;
            default: console.log("Category clicked:", id);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
            <AppHeader />

            <main className="container max-w-lg mx-auto py-6 px-6 space-y-8">
                <motion.div
                    className="grid grid-cols-3 gap-3"
                    style={{ willChange: "transform" }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {categories.map((cat) => (
                        <motion.button
                            key={cat.id}
                            variants={itemVariants}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`bg-white p-5 rounded-[24px] border border-black/5 shadow-sm flex flex-col items-center gap-3 hover:shadow-xl hover:border-[#0087c1]/20 transition-all group ${cat.id === 'tablets' ? 'ring-2 ring-[#0087c1]' : ''}`}
                        >
                            <div className={`w-12 h-12 ${cat.bg} rounded-2xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                                {cat.icon}
                            </div>
                            <span className="font-black text-[12px] text-center leading-tight opacity-90">{cat.name}</span>
                        </motion.button>
                    ))}
                </motion.div>

                <div className="bg-white rounded-[32px] border-t-[6px] border-[#0087c1] shadow-2xl shadow-blue-900/10 p-8 space-y-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-[#0087c1] shadow-inner">
                        <Pill className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-[#1e293b]">Medication Manager</h3>
                        <p className="text-[#64748b] font-bold text-sm mt-3 leading-relaxed">
                            Track your prescriptions, set reminders, and monitor adherence scores.
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/medications")}
                        className="w-full h-14 bg-[#0087c1] hover:bg-[#0076a8] rounded-[22px] text-lg font-black text-white shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                    >
                        Open Tablets
                    </Button>
                </div>
            </main>

            <AppFooter />
        </div>
    );
}
