const API_BASE = "http://localhost:5000/api";

async function request(path, options = {}) {
	const response = await fetch(`${API_BASE}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {})
		},
		...options
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(data.message || "Request failed");
	}

	return data;
}

export function registerUser(payload) {
	return request("/auth/register", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}

export function loginUser(payload) {
	return request("/auth/login", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}

export function createBooking(payload) {
	return request("/bookings", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}

export function getBookings(userId) {
	const query = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
	return request(`/bookings${query}`);
}

export function updateBookingStatus(bookingId, status) {
	return request(`/bookings/${bookingId}/status`, {
		method: "PUT",
		body: JSON.stringify({ status })
	});
}

export function createBookingUpdate(bookingId, payload) {
	return request(`/bookings/${bookingId}/updates`, {
		method: "POST",
		body: JSON.stringify(payload)
	});
}

export function getBookingUpdates(bookingId) {
	return request(`/bookings/${bookingId}/updates`);
}
