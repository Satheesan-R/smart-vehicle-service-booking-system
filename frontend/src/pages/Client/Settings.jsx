import { useEffect, useState } from "react";
import { getCurrentUser } from "../../auth";
import { getBookings } from "../../services/api";

import "../ClientDashboard.css";
import "./Settings.css";

const notificationDefaults = {
  service: true,
  email: true,
  sms: true,
  completion: true,
  invoice: true,
  reminders: true
};

export default function ClientSettings() {
  const user = getCurrentUser();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState(notificationDefaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    getBookings(user.id).then(setBookings).catch(() => setBookings([]));
  }, [user?.id]);

  const vehicles = [...new Map(bookings.filter(booking => booking.vehicle_id).map(booking => [booking.vehicle_id, booking])).values()];
  const toggleNotification = (name) => {
    setNotifications(previous => ({ ...previous, [name]: !previous[name] }));
    setSaved(false);
  };

  return (
    <div id="client-settings">
      <section className="settings-heading" aria-labelledby="client-settings-title">
        <div>
          <p className="client-eyebrow">ACCOUNT PREFERENCES</p>
          <h1 id="client-settings-title">Profile &amp; Settings<span>.</span></h1>
          <p>Manage your personal information, registered vehicles, privacy preferences, and notification alerts.</p>
        </div>
        <div className="settings-heading-actions">
          <button type="button" className="settings-button settings-button-light" onClick={() => setSaved(false)}>Discard Changes</button>
          <button type="button" className="settings-button" onClick={() => setSaved(true)}>Save Changes</button>
        </div>
      </section>

      <div className="settings-layout">
        <div className="settings-main-column">
          <section className="settings-card settings-profile-card" aria-labelledby="personal-title">
            <div className="settings-profile-summary"><div className="settings-avatar">{user?.name?.charAt(0).toUpperCase() || "C"}</div><div><strong>{user?.name || "Vehicle owner"}</strong><small>{user?.email || "Customer account"}</small><span>Registered Client</span></div><div className="settings-telemetry"><small>ACCOUNT STATUS</small><strong>Active</strong><span>Since your registration</span></div></div>
            <div className="settings-section-heading"><div><h2 id="personal-title">Personal Information</h2><p>Keep your contact details up to date.</p></div><small>Last updated: Today</small></div>
            <div className="settings-form-grid"><label>Full name<input defaultValue={user?.name || ""} /></label><label>Email address<input type="email" defaultValue={user?.email || ""} /></label><label>Phone number<input type="tel" placeholder="+94 771 234 567" /></label><label>Account type<input value="Client account" readOnly /></label><label className="settings-field-wide">Address<input placeholder="Your service address" /></label></div>
            <button type="button" className="settings-button settings-button-inline" onClick={() => setSaved(true)}>Save Changes</button>
          </section>

          <section className="settings-card" aria-labelledby="vehicles-title"><div className="settings-section-heading"><div><h2 id="vehicles-title">My Vehicles</h2><p>Manage vehicles linked to your service history.</p></div><button type="button" className="settings-add-button">+ Add Vehicle</button></div><div className="settings-vehicle-list">{vehicles.length ? vehicles.map(vehicle => <article className="settings-vehicle" key={vehicle.vehicle_id}><div className="settings-vehicle-image" aria-hidden="true">CAR</div><div className="settings-vehicle-info"><strong>{vehicle.vehicle_id}</strong><span>{vehicle.service_type || "Vehicle service"}</span><small>Service requests: {bookings.filter(booking => booking.vehicle_id === vehicle.vehicle_id).length}</small></div><button type="button" className="settings-icon-button" aria-label={`Edit ${vehicle.vehicle_id}`}>Edit</button></article>) : <p className="settings-empty">Vehicles from your bookings will appear here.</p>}</div></section>

          <section className="settings-card" aria-labelledby="security-title"><div className="settings-section-heading"><div><h2 id="security-title">Security</h2><p>Change your password and authorization protocols.</p></div><span className="settings-health">High security</span></div><div className="settings-form-grid settings-password-grid"><label>Current password<input type="password" placeholder="••••••••" /></label><label>New password<input type="password" placeholder="New password" /></label><label>Confirm new password<input type="password" placeholder="Confirm password" /></label></div><button type="button" className="settings-button settings-button-inline">Update Password</button></section>

          <section className="settings-card settings-two-factor" aria-labelledby="two-factor-title"><div className="settings-mini-icon">2FA</div><div><h2 id="two-factor-title">Two-Factor Authentication</h2><p>Secure your account with an extra verification step.</p></div><span className="settings-enabled">Active</span><button type="button" className="settings-button settings-button-light">Manage 2FA</button></section>
        </div>

        <div className="settings-side-column">
          <section className="settings-card" aria-labelledby="notifications-title"><div className="settings-section-heading"><div><h2 id="notifications-title">Notification Settings</h2><p>Choose how and when you receive service updates.</p></div></div><div className="settings-toggle-list">{[["service", "Service and maintenance", "Updates about your vehicle service"], ["email", "Email notifications", "Receive daily diagnostics and summaries"], ["sms", "SMS notifications", "Critical updates and reminders"], ["completion", "Service completion notifications", "Know when your vehicle is ready"], ["invoice", "Invoice notifications", "Digital receipts and payment notices"], ["reminders", "Service reminders", "Automated maintenance reminders"]].map(([name, label, note]) => <div className="settings-toggle-row" key={name}><div><strong>{label}</strong><small>{note}</small></div><button type="button" className={`settings-toggle ${notifications[name] ? "is-on" : ""}`} aria-pressed={notifications[name]} aria-label={`${notifications[name] ? "Disable" : "Enable"} ${label}`} onClick={() => toggleNotification(name)}><span /></button></div>)}</div></section>

          <section className="settings-card settings-account-card" aria-labelledby="account-title"><div className="settings-section-heading"><div><h2 id="account-title">Account Settings</h2><p>Control location and platform preferences.</p></div></div><dl><div><dt>Language</dt><dd>English (US)</dd></div><div><dt>Dark mode</dt><dd><button type="button" className="settings-toggle" aria-label="Enable dark mode"><span /></button></dd></div><div><dt>Session management</dt><dd><button type="button" className="settings-session-button">Log out</button></dd></div></dl></section>

          <section className="settings-danger" aria-labelledby="danger-title"><h2 id="danger-title">Danger Zone: Delete Account</h2><p>Permanently deactivate and delete your account. This action cannot be undone.</p><button type="button" className="settings-delete-button">Delete Account</button></section>
        </div>
      </div>
      {saved && <p className="settings-saved" role="status">Changes saved for this session.</p>}
    </div>
  );
}
