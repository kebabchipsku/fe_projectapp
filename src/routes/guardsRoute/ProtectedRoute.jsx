import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, accessToken, refreshToken } = useAuth();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const init = async () => {
      try {
        // cek dari context dulu, fallback ke localStorage (mobile)
        const token = accessToken || localStorage.getItem("accessToken");
        if (!token) {
          await refreshToken();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [accessToken, refreshToken]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
        <div className="expand-circle circle-1"></div>
        <div className="expand-circle circle-2"></div>
        <div className="expand-circle circle-3"></div>
      </div>
    );
  }

  if (!allowedRoles.includes(user?.role)) {
    let redirectPath = "/";

    switch (user?.role) {
      case "admin":
        redirectPath = "/admin";
        break;
      case "school":
        redirectPath = "/school";
        break;
      case "teacher":
        redirectPath = "/school";
        break;
      case "parent":
        redirectPath = "/parent";
        break;
      case "healthcare":
        redirectPath = "/healthcare";
        break;
      case "staff":
        redirectPath = "/healthcare";
        break;
      default:
        redirectPath = "/auth/login";
    }

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
