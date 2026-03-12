import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/auth"
        element={!user ? <AuthPage /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
