# Quick Start - Simple Guide

## Your Project Folders (7 main folders only)

### BACKEND
1. **config/** → Connect to database
2. **controllers/** → What each button does
3. **routes/** → URL paths (`/login`, `/booking`)
4. **middleware/** → Check if user logged in
5. **models/** → Talk to database
6. **server.js** → Start everything

### FRONTEND  
1. **components/** → Buttons, Forms, Lists (reuse them)
2. **pages/** → Home page, Login page, Booking page
3. **services/api.js** → Connect to backend
4. **App.js** → Main page
5. **index.js** → Start

---

## To Start:

### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

Done! That's all you need to know.

## Registration profile setup

Before starting an updated backend, run `node backend/scripts/setup-registration.js`
from the repository root. This creates the additive `registration_profiles` table
for phone and primary vehicle details; existing users are unchanged. Restart the
backend after updating. New client accounts require phone and vehicle details;
garage accounts require phone but no personal vehicle. VIN/OBD-II integration is
not connected. Terms and privacy documents must be supplied before adding policy
links or requesting agreement to them.
