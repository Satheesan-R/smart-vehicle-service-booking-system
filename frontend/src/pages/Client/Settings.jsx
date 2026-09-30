import { getCurrentUser } from "../../auth";

import "../ClientDashboard.css";

export default function ClientSettings() {
  const user = getCurrentUser();

  return (
    <div id="client-settings">
      <section className="client-welcome" aria-labelledby="client-settings-title">
        <div>
          <p className="client-eyebrow">ACCOUNT PREFERENCES</p>
          <h1 id="client-settings-title">Settings<span>.</span></h1>
          <p>Review the account currently connected to your customer portal.</p>
        </div>
      </section>
      <section className="client-panel" aria-labelledby="client-account-settings-title">
        <div className="client-panel-heading">
          <div>
            <h2 id="client-account-settings-title">Account details</h2>
            <p className="client-panel-description">Your account information used for service bookings.</p>
          </div>
        </div>
        <div className="client-next-details">
          <div><small>NAME</small><strong>{user?.name || "Vehicle owner"}</strong></div>
          <div><small>EMAIL</small><strong>{user?.email || "Not available"}</strong></div>
          <div><small>ACCOUNT TYPE</small><strong>Client</strong></div>
        </div>
      </section>
    </div>
  );
}
