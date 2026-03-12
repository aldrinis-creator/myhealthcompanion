import { Navigate, Outlet } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

interface Props {
  session: Session | null;
}

export default function ProtectedRoute({ session }: Props) {
  if (!session) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
