import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../auth";
import "../pages/ClientDashboard.css";

const pageTitles = {
  "/client": "Customer Portal / Dashboard",
  "/client/book": "Customer Portal / Book Service",
  "/client/bookings": "Customer Portal / Booking History"
};

export default function ClientLayout() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="client-dashboard">
      <aside className="client-sidebar">
        <Link className="client-brand" to="/" aria-label="Smart Vehicle Service home">
          <span className="client-brand-mark">S.</span>
          <span>AutoCare<small>CUSTOMER PORTAL</small></span>
        </Link>
        <p className="client-nav-label">YOUR SERVICE WORKSPACE</p>
        <nav aria-label="Customer navigation">
          <NavLink to="/client" end className={location.pathname === "/client" && !location.hash ? "active" : ""}>Dashboard <span aria-hidden="true">↗</span></NavLink>
          <Link className={location.hash === "#client-vehicles" ? "active" : ""} to="/client#client-vehicles">My Vehicles <span aria-hidden="true">▣</span></Link>
          <NavLink to="/client/book">Book a service <span aria-hidden="true">+</span></NavLink>
          <NavLink to="/client/bookings">My Bookings</NavLink>
          <Link className={location.hash === "#client-progress" ? "active" : ""} to="/client#client-progress">Service updates <span aria-hidden="true">↗</span></Link>
          <NavLink to="/client/settings">Settings <span aria-hidden="true">⚙</span></NavLink>
        </nav>
        <div className="client-account">
          <span className="client-avatar" aria-hidden="true">{user?.name?.charAt(0).toUpperCase() || "C"}</span>
          <div><strong>{user?.name || "Vehicle owner"}</strong><small>Client account</small></div>
          <button type="button" onClick={onLogout}>Log out</button>
        </div>
      </aside>
      <main className="client-main">
        <header className="client-topbar">
          <label className="client-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              aria-label="Search bookings by vehicle, service or booking ID"
              placeholder="Search vehicle, service, or booking ID..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </label>
          <span className="client-topbar-title">{pageTitles[location.pathname] || "Customer Portal"}</span>
          <div className="client-topbar-user">
            <span className="client-avatar" aria-hidden="true">{user?.name?.charAt(0).toUpperCase() || "C"}</span>
            <span>{user?.name || "Vehicle owner"}<small>Customer account</small></span>
          </div>
        </header>
        <Outlet context={{ search }} />
      </main>
    </div>
  );
}
