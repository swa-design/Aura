import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="glass rounded-3xl p-8 border border-white/10 flex items-center gap-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <div>
            <p className="font-semibold">Securing your workspace</p>
            <p className="text-sm text-foreground/60">Restoring your session and preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
