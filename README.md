# Smart Vehicle Service Booking System

A React and Node.js application for customer vehicle service bookings and garage progress updates.

## Current Features

### Customers

- Register and log in with a vehicle profile.
- Add and view registered vehicles.
- Create service bookings.
- View booking history and statuses.
- Read progress updates sent by a garage.
- Manage customer settings and notification preferences.

### Garages

- Log in with a garage account created directly in the database.
- View all customer service requests.
- Change booking status.
- Send progress messages with an optional ETA.
- View active work and garage settings.

Invoices are not implemented yet. Do not rely on invoice-related UI or API documentation.

## Technology

- Frontend: React, React Router, Vite, CSS
- Backend: Node.js, Express
- Database: MySQL
- HTTP client: browser `fetch` through `frontend/src/services/api.js`
- Authentication: JWT bearer tokens

## Project Structure

```text
backend/
  config/db.js                 MySQL connection pool
  controllers/                 Request handlers
  middleware/auth.js           JWT verification and role authorization
  models/queries.js            Runtime table definitions
  routes/                      Express route modules
  server.js                    API server entry point
frontend/
  src/components/              Shared layouts
  src/pages/                   Customer and garage pages
  src/services/api.js          Fetch-based API client
schema.sql                     Complete database schema
```

## Setup

### 1. Create the database

Run `schema.sql` using MySQL:

```bash
mysql -u root -p < schema.sql
```

The schema creates the `vehicle_service_db` database and these tables:

- `users`
- `registration_profiles`
- `vehicles`
- `bookings`
- `booking_updates`

### 2. Configure the backend

Copy `backend/.env.example` to `backend/.env` and set the values:

```env
JWT_SECRET=replace-with-a-long-random-secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=vehicle_service_db
```

`backend/.env` is ignored by Git and must not be committed.

### 3. Install and start the backend

```bash
cd backend
npm install
npm start
```

The API runs at `http://localhost:5000`.

### 4. Install and start the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite prints the local frontend URL in the terminal.

## Authentication

Login returns a JWT. The frontend stores it with the user profile and sends it on every API request:

```http
Authorization: Bearer <token>
```

Protected routes use `verifyToken` and `authorize` from `backend/middleware/auth.js`.

Public signup creates client accounts only. Garage accounts must be created directly in the `users` table with `role = 'garage'` and a bcrypt password hash.

## API Routes

### Public authentication

- `POST /api/auth/register` - Create a client account and primary vehicle.
- `POST /api/auth/login` - Log in a client or garage account.

### Protected bookings

All booking routes require a bearer token.

- `POST /api/bookings` - Client creates a booking.
- `GET /api/bookings` - Client receives only their bookings; garage receives all bookings.
- `PUT /api/bookings/:id/status` - Garage changes a booking status.
- `POST /api/bookings/:id/updates` - Garage sends a progress update.
- `GET /api/bookings/:id/updates` - Read progress updates for a booking.

### Protected vehicles

All vehicle routes require a client bearer token.

- `GET /api/vehicles` - Get vehicles belonging to the authenticated client.
- `POST /api/vehicles` - Add a vehicle for the authenticated client.

User IDs are taken from the verified JWT, not from request query strings or request bodies.

## Booking Status Values

Only these values are supported:

- `pending`
- `in-progress`
- `completed`

## Development Checks

Frontend lint and build:

```bash
cd frontend
npm run lint
npm run build
```

Backend syntax checks can be run with Node:

```bash
node --check backend/server.js
```
