# TravelWise — Enterprise Microservices Booking Platform

A full-stack travel booking engine with live flight/train search, interactive seat selection, Razorpay payments, and real-time flight radar.

## Quick Start

### 1. Backend (Port 5002)
```bash
cd backend
npm install
npx prisma db push
node server.js
```

### 2. Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

## Tech Stack
- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Poppins font
- **Backend**: Node.js, Express.js, Prisma ORM, SQLite (→ PostgreSQL in prod)
- **Auth**: Firebase Google OAuth + JWT httpOnly cookies
- **Payments**: Razorpay split-settlement
- **Tracking**: OpenSky Network real-time radar

## Project Structure
```
travelwise/
├── frontend/        # Next.js app
│   └── app/
│       ├── page.tsx          # Homepage + search widget
│       ├── search/           # Live search results
│       ├── seat-selection/   # Cabin seat map with locking
│       ├── checkout/         # Razorpay payment UI
│       ├── tracking/         # Live flight radar
│       ├── airport-info/     # Airport directory
│       └── profile/          # E-ticket dashboard
└── backend/         # Express microservices
    ├── server.js             # API Gateway
    └── services/
        ├── auth-service/     # Firebase OAuth + JWT
        ├── search-service/   # Amadeus / RailYatri
        ├── airport-service/  # OpenFlights data
        ├── booking-service/  # Redis seat locking
        ├── payment-service/  # Razorpay orders
        ├── tracking-service/ # OpenSky telemetry
        └── notification-service/ # SendGrid + Twilio
```

## Deploying to Production
| Layer | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Railway / Render |
| Database | Supabase (PostgreSQL) |
| Cache | Upstash (Redis) |

## Pushing to GitHub
```bash
cd travelwise
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/travelwise.git
git push -u origin main
```
