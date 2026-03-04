import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getCurrentUser } from "./auth";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ClientDashboard from "./pages/ClientDashboard";
import GarageDashboard from "./pages/GarageDashboard";
import "./App.css";

function ProtectedRoute({ children, role }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "garage" ? "/garage" : "/client"} replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route
          path="/client"
          element={(
            <ProtectedRoute role="client">
              <ClientDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/garage"
          element={(
            <ProtectedRoute role="garage">
              <GarageDashboard />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}