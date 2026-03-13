import { useNavigate } from "react-router-dom";
import { ClipboardList, FileText, Search, MessageSquare, Pill, Video, ArrowLeft, Heart, Pill as Tablets, Globe } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
};

export default function HealthTools() {
    const navigate = useNavigate();

    const tools = [
        { title: "Doctor Visit Report", desc: "Consolidated health summary with vitals...", icon: <ClipboardList className="w-6 h-6" />, path: "/doctor-visit-report" },
        { title: "Medical Documents", desc: "Store, organize, and share your medical...", icon: <FileText className="w-6 h-6" /> },
        { title: "Document Analyzer", desc: "Upload X-rays, lab reports, prescription...", icon: <Search className="w-6 h-6" /> },
        { title: "Symptom Checker", desc: "Describe symptoms and get guidance on...", icon: <MessageSquare className="w-6 h-6" /> },
        { title: "Medication Info", desc: "Look up dosages, side effects, and...", icon: <Pill className="w-6 h-6" /> },
        { title: "Tele-Consult", desc: "Record consultations and get AI transcripti...", icon: <Video className="w-6 h-6" /> },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
            <AppHeader title="Health Tools" showBack showTabs={false} onBack={() => navigate("/my-health")} />

            <main className="container max-w-4xl mx-auto py-8 px-6 space-y-10">
                <div className="grid grid-cols-2 gap-4">
                    {tools.map((tool, i) => (
                        <motion.div
                            key={i}
                            {...fadeIn}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => tool.path && navigate(tool.path)}
                            className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col text-center items-center gap-4 hover:shadow-md transition-shadow group cursor-pointer"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                {tool.icon}
                            </div>
                            <div>
                                <h3 className="font-black text-[15px] mb-1 text-foreground">{tool.title}</h3>
                                <p className="text-[12px] text-muted-foreground font-medium leading-tight">{tool.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Emergency First Aid Card */}
                <motion.div
                    {...fadeIn}
                    transition={{ delay: 0.4 }}
                    className="bg-destructive/5 p-6 rounded-[24px] border border-destructive/10 flex items-center gap-5 cursor-pointer hover:shadow-md transition-shadow group"
                >
                    <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground transition-colors shrink-0">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black text-[15px] mb-1 text-foreground">Emergency First Aid</h3>
                        <p className="text-[12px] text-muted-foreground font-medium leading-tight">Quick access to life-saving first aid guides</p>
                        <p className="text-[9px] text-destructive/60 font-bold mt-2 uppercase tracking-wider">⚠ For guidance only — always call emergency services</p>
                    </div>
                </motion.div>
            </main>

            <AppFooter />
        </div>
    );
}
