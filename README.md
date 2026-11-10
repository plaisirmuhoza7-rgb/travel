# Travel Rwanda — Transport Services
**Premium Ground Transport, Car Rental & Booking Enquiry Platform**

> “Arrive with confidence. Travel in comfort.”

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and server-side data persistence designed for cloud deployment on Vercel / Node.js and Supabase PostgreSQL.

---

## Key Highlights & Design Directives

1. **Zero Stock or Synthetic AI Images**: Every image across the platform uses an architectural placeholder framework mapped via `src/lib/assets.ts`. Visual frames display exact target file paths, aspect ratios, and dimensions so real fleet photos can be dropped into `/public/images/...` seamlessly.
2. **Controlled Hospitality Palette**:
   - Forest Green: `#0B3D2E`
   - Deeper Green: `#06281E`
   - Warm Ivory: `#F7F6F2`
   - Charcoal: `#171D19`
   - Muted Champagne: `#BCA77B` (used strictly as an accent)
3. **Structured 4-Step Booking Wizard (`/plan-your-journey`)**:
   - Step 1: Service Selection (Rental, Airport Transfer, Wedding Convoy, Group Transport, Corporate).
   - Step 2: Journey Logistics with Africa/Kigali local time validation and conditional fields (e.g. flight number tracking for KGL airport transfers).
   - Step 3: Contact & Third-Party Traveller Details (book from abroad for family in Rwanda).
   - Step 4: Summary, Privacy Acknowledgement, Server Idempotency, and Honeypot anti-spam.
   - Status issued upon save: Non-sequential reference code (e.g. `TRW-20261105-8F3K`) with clear *"Request received — pending confirmation"* notice.
4. **Administrative Operations Portal (`/admin`)**:
   - Status workflow (`New` → `Contacted` → `Quoted` → `Confirmed` → `Completed` → `Cancelled`).
   - Mandatory manual vehicle assignment reminder before confirming reservations.
   - Private staff notes and immutable status history audit log.
   - Live readiness checklist tracking SMTP configuration, contact email verification, and placeholder image counts.

---

## Getting Started

### 1. Install & Run Locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` in your browser.

### 2. Access Admin Portal
- URL: `http://localhost:3000/admin`
- Email: `admin@travelrwanda.rw`
- Password: `Rwanda2026!Admin` (Set in `.env.local`)

### 3. Verification & Type Checking
```bash
# Run TypeScript type check
npx tsc --noEmit

# Run production build
npm run build

# Run automated backend & idempotency verification suite
npx tsx scripts/test-suite.ts
```

---

## Database Migrations
Supabase PostgreSQL migrations with least-privilege Row-Level Security (RLS) are located in:
`supabase/migrations/001_initial_schema.sql`
