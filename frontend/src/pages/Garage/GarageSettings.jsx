import { useState } from "react";
import { getCurrentUser } from "../../auth";
import "../GarageDashboard.css";
import "./GarageSettings.css";

const defaultNotifications = { requests: true, updates: true, reminders: true };

export default function GarageSettings() {
  const user = getCurrentUser();
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", address: "", openingHours: "08:00 AM - 06:00 PM" });

  const updateField = (event) => {
    setSaved(false);
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  return <section className="garage-settings-page" aria-labelledby="garage-settings-title">
    <div className="garage-settings-heading"><div><p className="garage-eyebrow">GARAGE WORKSPACE PREFERENCES</p><h1 id="garage-settings-title">Garage settings<span>.</span></h1><p>Manage your workshop profile, contact details, and notification preferences.</p></div><span className="garage-settings-status">GARAGE ACCOUNT</span></div>
    <div className="garage-settings-grid">
      <section className="garage-panel garage-settings-card" aria-labelledby="garage-profile-title"><div className="garage-settings-card-heading"><div><p className="garage-eyebrow">WORKSHOP PROFILE</p><h2 id="garage-profile-title">Business details</h2></div><span className="garage-settings-icon" aria-hidden="true">S.</span></div><div className="garage-settings-form"><label>Garage name<input name="name" value={form.name} onChange={updateField} placeholder="Your garage name" /></label><label>Email address<input name="email" type="email" value={form.email} readOnly /></label><label>Contact number<input name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="+94 771 234 567" /></label><label>Opening hours<input name="openingHours" value={form.openingHours} onChange={updateField} placeholder="08:00 AM - 06:00 PM" /></label><label className="garage-settings-wide">Workshop address<textarea name="address" rows="3" value={form.address} onChange={updateField} placeholder="Enter your garage address" /></label></div><button className="garage-button" type="button" onClick={() => setSaved(true)}>Save profile <span aria-hidden="true">↗</span></button></section>
      <section className="garage-panel garage-settings-card" aria-labelledby="garage-notifications-title"><div className="garage-settings-card-heading"><div><p className="garage-eyebrow">WORKSPACE ALERTS</p><h2 id="garage-notifications-title">Notifications</h2></div></div><p className="garage-settings-description">Choose which updates help your team stay on top of customer service.</p><div className="garage-settings-toggle-list">{[["requests", "New service requests", "Get notified when a customer submits a booking."], ["updates", "Customer update activity", "Keep track of progress updates sent to customers."], ["reminders", "Daily reminders", "Receive reminders about pending work and appointments."]].map(([name, label, description]) => <div className="garage-settings-toggle-row" key={name}><div><strong>{label}</strong><small>{description}</small></div><button className={`garage-settings-toggle ${notifications[name] ? "is-on" : ""}`} type="button" aria-pressed={notifications[name]} aria-label={`${notifications[name] ? "Disable" : "Enable"} ${label}`} onClick={() => { setSaved(false); setNotifications((previous) => ({ ...previous, [name]: !previous[name] })); }}><span /></button></div>)}</div></section>
      <section className="garage-panel garage-settings-card garage-settings-account" aria-labelledby="garage-account-title"><div className="garage-settings-card-heading"><div><p className="garage-eyebrow">ACCOUNT ACCESS</p><h2 id="garage-account-title">Account security</h2></div><span className="garage-settings-security">Active</span></div><div className="garage-settings-account-row"><div><strong>Garage team account</strong><small>{user?.email || "Account email"}</small></div><button className="garage-settings-secondary" type="button">Change password</button></div></section>
    </div>
    {saved && <p className="garage-settings-saved" role="status">Settings saved for this session.</p>}
  </section>;
}
