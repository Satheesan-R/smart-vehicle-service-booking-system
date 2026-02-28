# 🚗 Smart Vehicle Service Booking & Management System

A web-based client-server middleware system that enables customers to book vehicle servicing appointments online and allows garages to manage service orders efficiently.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [System Modules](#system-modules)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [Middleware Concepts](#middleware-concepts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)


## 🎯 Overview

The Smart Vehicle Service Booking System is a comprehensive web application that addresses the challenges faced by small and medium garages in managing vehicle service appointments. The system replaces traditional manual booking systems with an automated, transparent, and efficient digital platform.

### Problem Statement

Many garages rely on manual booking systems and phone-based communication, leading to:
- Appointment conflicts
- Poor service tracking
- Lack of transparency
- Manual invoice handling
- Inefficient resource management

This middleware-based solution automates and streamlines the entire service booking and management process.

## ✨ Features

### Customer Features
- 👤 User registration and authentication
- 📅 Online service booking with date and time selection
- 🔧 Multiple service type options
- 📊 Real-time service status tracking
- 🧾 Invoice viewing and download
- 📧 Email notifications for status updates

### Garage Features
- 🔐 Secure garage login
- 📋 View and manage service requests
- ⚙️ Update repair progress in real-time
- 🔄 Change service status (Pending → In Progress → Completed)
- 📄 Upload invoices for completed services
- 📈 Dashboard for service analytics

### System Features
- 🔒 Secure authentication and authorization
- 🌐 RESTful API architecture
- 💾 Persistent data storage with MySQL
- 🔄 Real-time synchronization between client and server
- 📱 Responsive design for mobile and desktop
- ✅ Transaction handling and data validation

## 🏗️ System Architecture

### Architecture Pattern: Client-Server Middleware

                     
                        ┌─────────────────┐
                        │  Customer Web   │
                        │   (React.js)    │
                        └────────┬────────┘
                                 │
                                 │ REST API (JSON/HTTP)     
                                 │
                     ┌───────────▼───────────┐
                     |     Middleware        │
                     │ (Node.js +Express.js) | 
                     │                       │           
                     └───────────────────────┘
                                 │
                                 │
                        ┌────────▼────────┐
                        │  MySQL Database │
                        └─────────────────┘
                                 ▲
                                 │
                        ┌────────┴────────┐
                        │  Garage Portal  │
                        │   (React.js)    │
                        └─────────────────┘
                  

### Communication Flow

1. **Customer/Garage** → Makes HTTP request to backend API
2. **Middleware Layer** → Validates request, processes business logic
3. **Database Layer** → Stores/retrieves data
4. **Middleware Layer** → Formats response
5. **Customer/Garage** → Receives JSON response

## 🛠️ Technologies Used

| Layer |             Technology |
|-------|             -----------|
| **Frontend**    | React.js, HTML5, CSS3, JavaScript (ES6+) |
| **Backend**     | Node.js, Express.js |
| **Database**    | MySQL |
| **API Testing** | Postman |
| **Version Control** | Git, GitHub |
| **Authentication** | JWT (JSON Web Tokens) |
| **HTTP Client** | Axios |

## 📦 System Modules

### 1. Customer Module
- User registration and login
- Service booking interface
- Service type selection (Oil Change, Brake Repair, Engine Service, etc.)
- Date and time picker for appointments
- Real-time service status tracking
- Invoice viewing

### 2. Garage Module
- Garage admin login
- Service request dashboard
- Order management system
- Status update controls:
  - **Pending**: New service request
  - **In Progress**: Work has begun
  - **Completed**: Service finished
- Invoice upload functionality
- Customer notification system

### 3. Middleware Layer
- **Request Routing**: Directs API calls to appropriate handlers
- **Validation**: Validates incoming requests and data
- **Order Processing**: Handles service booking workflow
- **Status Synchronization**: Updates service status across system
- **Transaction Management**: Ensures data consistency
- **Security**: Implements authentication and authorization
- **Error Handling**: Manages and logs errors

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-vehicle-service-booking-system.git
cd smart-vehicle-service-booking-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Configure database:
   - Create a MySQL database
   - Update `db.js` with your database credentials

4. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - User login
- `POST /api/auth/garage-login` - Garage admin login

### Customer Endpoints
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer profile

### Service Booking
- `POST /api/bookings` - Create new service booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/customer/:customerId` - Get customer's bookings
- `PUT /api/bookings/:id` - Update booking

### Garage Management
- `GET /api/bookings/garage/all` - Get all service requests
- `PUT /api/bookings/:id/status` - Update service status
- `POST /api/invoices` - Upload invoice
- `GET /api/invoices/:bookingId` - Get invoice

### Service Types
- `GET /api/services` - Get all available services

## 🗄️ Database Schema

### Tables

#### `customers`
- `id` - Primary Key
- `name` - VARCHAR
- `email` - VARCHAR (Unique)
- `password` - VARCHAR (Hashed)
- `phone` - VARCHAR
- `created_at` - TIMESTAMP

#### `garages`
- `id` - Primary Key
- `name` - VARCHAR
- `email` - VARCHAR (Unique)
- `password` - VARCHAR (Hashed)
- `location` - VARCHAR
- `created_at` - TIMESTAMP

#### `services`
- `id` - Primary Key
- `service_name` - VARCHAR
- `description` - TEXT
- `estimated_time` - INT (in hours)
- `base_price` - DECIMAL

#### `bookings`
- `id` - Primary Key
- `customer_id` - Foreign Key → customers(id)
- `garage_id` - Foreign Key → garages(id)
- `service_id` - Foreign Key → services(id)
- `booking_date` - DATE
- `booking_time` - TIME
- `status` - ENUM ('Pending', 'In Progress', 'Completed', 'Cancelled')
- `vehicle_details` - TEXT
- `created_at` - TIMESTAMP

#### `invoices`
- `id` - Primary Key
- `booking_id` - Foreign Key → bookings(id)
- `amount` - DECIMAL
- `invoice_url` - VARCHAR
- `created_at` - TIMESTAMP

## 📖 Usage

### For Customers

1. **Register/Login**: Create an account or log in
2. **Browse Services**: View available service types
3. **Book Service**: 
   - Select service type
   - Choose date and time
   - Provide vehicle details
4. **Track Status**: Monitor service progress in real-time
5. **View Invoice**: Access and download invoice once service is completed

### For Garage Admins

1. **Login**: Access garage dashboard
2. **View Requests**: See all pending service requests
3. **Accept Booking**: Review and accept service appointments
4. **Update Progress**: Change status as work progresses
5. **Upload Invoice**: Generate and upload invoice
6. **Complete Service**: Mark service as completed

## 🎓 Middleware Concepts Demonstrated

This project demonstrates key middleware architecture concepts:

1. **Request Routing**: API endpoints route requests to appropriate handlers
2. **Order Processing Workflow**: Multi-step transaction handling for service bookings
3. **Status Update System**: Real-time synchronization of service status
4. **Transaction Handling**: Database transactions for data consistency
5. **Database Integration**: ORM-like patterns for data access
6. **Client-Server Communication**: RESTful API design principles
7. **API Security**: Authentication, authorization, and input validation
8. **Error Handling**: Centralized error handling middleware
9. **Logging**: Request/response logging for debugging

## 📁 Project Structure

```
smart-vehicle-service-booking-system/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── bookingController.js
│   │   └── invoiceController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── validation.js      # Request validation
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   └── services.js
│   ├── models/
│   │   └── queries.js         # Database queries
│   ├── server.js              # Entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Customer/
│   │   │   ├── Garage/
│   │   │   └── Common/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── api.js         # API client
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Middleware architecture concepts
- RESTful API design principles
- Full-stack web development best practices



---

**Note**: This is an academic project demonstrating middleware concepts and full-stack development skills.