import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getCurrentUser } from "./auth";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ClientDashboard from "./pages/ClientDashboard";
import CreateBooking from "./pages/Client/CreateBooking";
import MyBookings from "./pages/Client/MyBookings";
import ClientSettings from "./pages/Client/Settings";
import GarageDashboard from "./pages/GarageDashboard";
import ClientLayout from "./components/ClientLayout";
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
        <Route element={<ProtectedRoute role="client"><ClientLayout /></ProtectedRoute>}>
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/client/book" element={<CreateBooking />} />
          <Route path="/client/bookings" element={<MyBookings />} />
          <Route path="/client/settings" element={<ClientSettings />} />
        </Route>
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

