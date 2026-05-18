import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PaymentPage from "../pages/landing/subscription/PaymentPage";
import Dashboard from "../pages/dashboard/Dashboard";
import Landing from "../pages/landing/Landing";
import DemoPage from "../pages/landing/DemoPage";
import POS from "../pages/dashboard/POS";
import Inventory from "../pages/dashboard/Inventory";
import Customers from "../pages/dashboard/Customers";
import Reports from "../pages/dashboard/Reports";
import Staff from "../pages/dashboard/Staff";
import Settings from "../pages/dashboard/Settings";
import MainLayout from "../components/layout/MainLayout";
import SubscriptionPlan from "../pages/landing/subscription/SubscriptionPlan";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/subscription" element={<SubscriptionPlan />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={
          <ProtectedRoute roles={["admin", "manager", "cashier"]}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/pos" element={
          <ProtectedRoute roles={["admin", "manager", "cashier"]}>
            <POS />
          </ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute roles={["admin", "manager"]}>
            <Inventory />
          </ProtectedRoute>
        } />
        <Route path="/customers" element={
          <ProtectedRoute roles={["admin", "manager", "cashier"]}>
            <Customers />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute roles={["admin", "manager"]}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/staff" element={
          <ProtectedRoute roles={["admin"]}>
            <Staff />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute roles={["admin", "manager", "cashier"]}>
            <Settings />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
