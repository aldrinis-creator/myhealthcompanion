import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Auth from "@/pages/Auth";

// Lazy load all pages for better performance
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Activity = lazy(() => import("@/pages/Activity"));
const Appointments = lazy(() => import("@/pages/Appointments"));
const Guardian = lazy(() => import("@/pages/Guardian"));
const Vault = lazy(() => import("@/pages/Vault"));
const Medications = lazy(() => import("@/pages/Medications"));
const Help = lazy(() => import("@/pages/Help"));
const CheckIn = lazy(() => import("@/pages/CheckIn"));
const MyHealth = lazy(() => import("@/pages/MyHealth"));
const HealthPassport = lazy(() => import("@/pages/HealthPassport"));
const HealthTools = lazy(() => import("@/pages/HealthTools"));
const ActivityWorkout = lazy(() => import("@/pages/ActivityWorkout"));
const Profile = lazy(() => import("@/pages/Profile"));
const FaceScan = lazy(() => import("@/pages/FaceScan"));
const HealthVitals = lazy(() => import("@/pages/HealthVitals"));
const NutritionAdvisor = lazy(() => import("@/pages/NutritionAdvisor"));
const DoctorVisitReport = lazy(() => import("@/pages/DoctorVisitReport"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="animate-pulse text-[#0087c1] text-lg font-black tracking-widest uppercase">Loading…</div>
  </div>
);

function App() {
  const { session, loading } = useAuth();

  if (loading) return <PageLoader />;

  return (
    <>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/auth" element={session ? <Navigate to="/dashboard" replace /> : <Auth />} />
          
          <Route element={<ProtectedRoute session={session} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/guardian" element={<Guardian />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/help" element={<Help />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/my-health" element={<MyHealth />} />
            <Route path="/health-passport" element={<HealthPassport />} />
            <Route path="/health-tools" element={<HealthTools />} />
            <Route path="/activity-workout" element={<ActivityWorkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/face-scan" element={<FaceScan />} />
            <Route path="/health-vitals" element={<HealthVitals />} />
            <Route path="/nutrition-advisor" element={<NutritionAdvisor />} />
            <Route path="/doctor-visit-report" element={<DoctorVisitReport />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
