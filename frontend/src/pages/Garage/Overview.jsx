import { Link, useOutletContext } from "react-router-dom";

export default function Overview() {
  const { bookings, user } = useOutletContext();
  const activeBookings = bookings.filter((booking) => booking.status === "in-progress");
  const today = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter((booking) => String(booking.booking_date).slice(0, 10) === today);
  const stats = [["New service requests", bookings.filter((booking) => booking.status === "pending").length, "Booking requests", "dot-1"], ["Today's appointments", todayBookings.length, "Appointments today", "dot-2"], ["Active services", activeBookings.length, "Vehicles being serviced", "dot-3"], ["Completed services", bookings.filter((booking) => booking.status === "completed").length, "Completed requests", "dot-0"], ["Pending invoices", "—", "Connect invoices to track payments", "dot-1"], ["Monthly revenue", "—", "Invoice data not available", "dot-2"]];

  return <>
    <section className="garage-welcome" aria-labelledby="garage-title">
      <div>
         <p className="garage-eyebrow">SERVICE THAT KEEPS PEOPLE MOVING</p>
         <h1 id="garage-title">Welcome back, {user?.name || "garage team"}
            <span>.</span>
            </h1><p>Manage your service bookings, vehicles, customers, and ongoing repairs.</p>
    </div>
            <Link className="garage-button" to="/garage/update">Send an update
                 <span aria-hidden="true">↗</span>
             </Link>
   </section>
    <section className="garage-stats garage-stats-wide" aria-label="Garage summary">{stats.map(([label, count, note, dot]) => <article className="garage-stat" key={label}><div><span>{label}</span><span className={`garage-stat-dot ${dot}`} aria-hidden="true" /></div><strong>{count}</strong><p>{note}</p></article>)}</section>
    <section className="garage-panel garage-requests" aria-labelledby="schedule-title"><div className="garage-panel-heading"><div><p className="garage-eyebrow">TODAY'S SERVICE SCHEDULE</p><h2 id="schedule-title">Today's appointments</h2></div><Link className="garage-count" to="/garage/requests">View all {bookings.length}</Link></div><div className="garage-table-wrap"><table><thead><tr><th>Time</th><th>Customer</th><th>Vehicle</th><th>Service</th><th>Status</th><th>Action</th></tr></thead><tbody>{todayBookings.length === 0 ? <tr><td colSpan="6"><div className="garage-empty"><strong>No appointments scheduled today.</strong><p>New bookings will appear here when they are requested for today.</p></div></td></tr> : todayBookings.map((booking) => <tr key={booking.id}><td>{new Date(booking.booking_date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</td><td><span className="garage-customer-name">{booking.client_name || "Client"}</span><span className="garage-customer-email">{booking.client_email || "—"}</span></td><td>{booking.vehicle_id}</td><td>{booking.service_type}</td><td><span className={`garage-status garage-status-${booking.status}`}>{booking.status?.replace(/-/g, " ")}</span></td><td><Link className="garage-table-action" to="/garage/requests">View</Link></td></tr>)}</tbody></table></div></section>
    <section className="garage-panel garage-queue garage-overview-active" aria-labelledby="active-overview-title"><div className="garage-panel-heading"><div><p className="garage-eyebrow">ACTIVE SERVICES OVERVIEW</p><h2 id="active-overview-title">Vehicles in the garage</h2></div><Link className="garage-count" to="/garage/active">Manage service</Link></div>{activeBookings.length === 0 ? <div className="garage-queue-empty"><strong>No active services.</strong><p>Bookings marked in progress will appear here.</p></div> : <div className="garage-queue-list">{activeBookings.slice(0, 4).map((booking) => <Link key={booking.id} to="/garage/active"><span className="garage-job-id">#{booking.id}</span><div><strong>{booking.vehicle_id}</strong><small>{booking.client_name || "Client"} · {booking.service_type}</small></div><span aria-hidden="true">↗</span></Link>)}</div>}</section>
  </>;
}
