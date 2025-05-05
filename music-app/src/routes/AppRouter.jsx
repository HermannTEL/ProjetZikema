import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/services/auth/Login";
// import Register from "../pages/services/auth/Register";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorised";

import AdminDashboard from "../pages/admin/AdminDashboard";
import { ManagerDashboard } from "../pages/manager";
import ProfessorDashboard from "../pages/professor/ProfessorDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import HomePage from "../pages/Home";
import MainLayout from "../layouts/dashboard/MainLayout";

import CoursDetail from "../pages/services/course/CoursDetail";
import CoursList from "../pages/services/course/CoursList";
import RegisterPage from "../pages/services/auth/Register";

const AppRouter = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Auth / public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/courses" element={<MainLayout><CoursList /></MainLayout>} />
        <Route path="/courses/:id" element={<MainLayout><CoursDetail /></MainLayout>} />

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={
            <MainLayout>
              < AdminDashboard />
            </MainLayout>
          } />
        </Route>

         {/* Manager */}
         <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
          <Route path="/manager/dashboard" element={
            <MainLayout>
              < ManagerDashboard />
            </MainLayout>
          } />
        </Route>

        {/* Professor */}
        <Route element={<ProtectedRoute allowedRoles={["professor"]} />}>
          <Route path="/prof/dashboard" element={
            <MainLayout>
              <ProfessorDashboard />
            </MainLayout>
          } />
        </Route>

        {/* Student */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={
            <MainLayout>
              <StudentDashboard />
            </MainLayout>
          } />
        </Route>

        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
