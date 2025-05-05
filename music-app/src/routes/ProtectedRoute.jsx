import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/hooks";

    const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token } = useAuth();

    if (!token) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
    };

export default ProtectedRoute;
