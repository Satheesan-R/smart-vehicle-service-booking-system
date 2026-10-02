CREATE DATABASE IF NOT EXISTS vehicle_service_db;
USE vehicle_service_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('client', 'garage') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registration_profiles (
  user_id INT PRIMARY KEY,
  phone VARCHAR(40) NOT NULL,
  vehicle JSON NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vehicle_number VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_vehicle_number (user_id, vehicle_number),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vehicle_id VARCHAR(255) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  booking_date DATE NOT NULL,
  status ENUM('pending', 'in-progress', 'completed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

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
