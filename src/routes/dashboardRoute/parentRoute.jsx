import { Navigate, Route } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardPage from "../../pages/dashboard/parent/Index";
import ProtectedRoute from "../guardsRoute/protectedRoute";
import Family from "../../pages/dashboard/parent/Family";

const parentRoute = () => {
  return (
    <>
      <Route
        path="/parent"
        element={<Navigate to="/parent/dashboard" replace />}
      />
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="management-family" element={<Family />} />
      </Route>
    </>
  );
};

export default parentRoute;
