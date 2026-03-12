import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/pages/Auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Medications = lazy(() => import("@/pages/Medications"));
const Vitals = lazy(() => import("@/pages/Vitals"));
const Appointments = lazy(() => import("@/pages/Appointments"));
const Activity = lazy(() => import("@/pages/Activity"));
const Profile = lazy(() => import("@/pages/Profile"));

const PageLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-pulse text-primary text-sm font-medium">Loading…</div>
  </div>
);

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-lg font-medium">Loading…</div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/auth" element={session ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route element={<ProtectedRoute session={session} />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
            <Route path="/medications" element={<Suspense fallback={<PageLoader />}><Medications /></Suspense>} />
            <Route path="/vitals" element={<Suspense fallback={<PageLoader />}><Vitals /></Suspense>} />
            <Route path="/appointments" element={<Suspense fallback={<PageLoader />}><Appointments /></Suspense>} />
            <Route path="/activity" element={<Suspense fallback={<PageLoader />}><Activity /></Suspense>} />
            <Route path="/profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
