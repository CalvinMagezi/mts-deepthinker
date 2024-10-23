import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function DashboardLayout() {
  const { userId } = useAuth();

  if (!userId) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
