const createBookingUpdatesTable = `
	CREATE TABLE IF NOT EXISTS booking_updates (
		id INT AUTO_INCREMENT PRIMARY KEY,
		booking_id INT NOT NULL,
		garage_id INT NOT NULL,
		message TEXT NOT NULL,
		eta_value INT NULL,
		eta_unit ENUM('hours', 'days') NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
		FOREIGN KEY (garage_id) REFERENCES users(id) ON DELETE CASCADE
	);
`;

module.exports = {
	createBookingUpdatesTable
};
