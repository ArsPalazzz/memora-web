import { Navigate, Outlet } from "react-router-dom";
import { FullPageLoader } from "@/components/ui/Loader";
import { useAuth } from "@/utils/auth";
import { ROUTES } from "@/routes/paths";

export function ProtectedRoute() {
  const { loading, authenticated } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!authenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
