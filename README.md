# Cricbuzz IPL Virtual Prediction Web App

A full-stack premium platform for IPL match predictions using virtual points.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: NestJS, Prisma, PostgreSQL (Neon), Redis (Upstash)
- **Auth**: JWT with Email OTP (Resend)
- **Infrastructure**: BullMQ (Queues), Socket.IO (Real-time)

## Project Structure
- `/frontend`: Next.js application
- `/backend`: NestJS application

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL Database (Neon.tech recommended)
- Redis Instance (Upstash recommended)
- Resend API Key (for OTP emails)

### Installation
1. Clone the repository.
2. In `/backend`:
   - Copy `.env.example` to `.env` and fill in credentials.
   - Run `npm install`.
   - Run `npx prisma db push` to setup database.
   - Run `npm run start:dev`.
3. In `/frontend`:
   - Run `npm install --legacy-peer-deps`.
   - Run `npm run dev`.

## Legal Disclaimer
This platform is purely for entertainment purposes using virtual points. No real money or gambling is involved. Users must be 18+ to participate.
