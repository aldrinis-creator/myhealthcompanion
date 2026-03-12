import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";

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
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
