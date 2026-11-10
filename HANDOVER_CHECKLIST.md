# Launch Readiness & Owner Handover Checklist
**Client**: Travel Rwanda — Transport Services  
**Location**: Kicukiro, Gahanga Center, Rwanda  
**Primary Contact**: +250 784 129 579 / +250 781 782 882  
**Platform Version**: Release 1.0 (Next.js 15, TypeScript, Tailwind CSS)

---

## 1. Architectural Image Replacement Slots (`src/lib/assets.ts`)
Per client direction, **zero stock or synthetic AI images** are included in the build. All visual positions across the website render structured architectural frames displaying recommended dimensions and target file locations. 

To replace placeholders with real photos of Travel Rwanda vehicles and operations, save photos directly into `/public/images/...`:

| Slot ID | Slot Purpose | Target File Path in Project | Recommended Aspect & Dimensions |
| :--- | :--- | :--- | :--- |
| `brand-logo` | Official Brand Logo | `/public/images/brand/logo.svg` | Transparent PNG or SVG (400×120px) |
| `hero-primary-vehicle` | Homepage Hero Vehicle | `/public/images/hero/hero-vehicle-rwanda.jpg` | 4:3 (1600×1200px) |
| `editorial-diaspora` | Diaspora Section Feature | `/public/images/editorial/diaspora-arrival.jpg` | 4:3 (1400×1050px) |
| `editorial-weddings` | Weddings & Convoy Feature | `/public/images/editorial/wedding-convoy.jpg` | 16:10 (1600×1000px) |
| `editorial-airport` | Kigali Airport Transfer Page | `/public/images/editorial/kigali-airport-pickup.jpg` | 16:10 (1600×1000px) |
| `editorial-about` | About Gahanga Center Operations | `/public/images/editorial/gahanga-operations.jpg` | 4:3 (1400×1050px) |
| `fleet-txl-main` | Toyota Land Cruiser Prado TXL | `/public/images/fleet/prado-txl-main.jpg` | 16:10 (1600×1000px) |
| `fleet-v8-main` | Toyota Land Cruiser V8 | `/public/images/fleet/land-cruiser-v8-main.jpg` | 16:10 (1600×1000px) |
| `fleet-kia-k5-main` | Kia K5 Executive Sedan | `/public/images/fleet/kia-k5-main.jpg` | 16:10 (1600×1000px) |
| `fleet-tucson-main` | Hyundai Tucson Compact SUV | `/public/images/fleet/hyundai-tucson-main.jpg` | 16:10 (1600×1000px) |
| `fleet-sorento-main` | Kia Sorento Crossover | `/public/images/fleet/kia-sorento-main.jpg` | 16:10 (1600×1000px) |
| `fleet-starex-main` | Hyundai Starex Passenger Van | `/public/images/fleet/hyundai-starex-main.jpg` | 16:10 (1600×1000px) |
| `fleet-hiace-main` | Passenger Van (HiAce Class) | `/public/images/fleet/toyota-hiace-main.jpg` | 16:10 (1600×1000px) |
| `fleet-coaster-main` | Toyota Coaster Minibus (28+ Seats) | `/public/images/fleet/toyota-coaster-main.jpg` | 16:10 (1600×1000px) |
| `fleet-wedding-bridal` | Wedding Convoy Package | `/public/images/fleet/wedding-bridal-car.jpg` | 16:10 (1600×1000px) |

---

## 2. Business Verification Tasks (Owner Action Required)

- [ ] **Official Contact Email**: Transcribe or verify the official business email address. Enter it in the Admin Dashboard at `/admin/settings` (currently unconfigured).
- [ ] **Booking Terms & Privacy Policy Sign-Off**: Review `/privacy` and `/terms`. Once reviewed and approved by management, toggle **"Booking Terms & Privacy Policy Approved"** in `/admin/settings` to lift draft notices.
- [ ] **Vehicle Specifications Verification**: Review vehicle specifications (fuel type, manual/automatic transmission, exact seat counts) in `/admin/fleet`.
- [ ] **Demonstration Mode Production Toggle**: Once real photos and verified specs are completed, set `NEXT_PUBLIC_DEMO_MODE="false"` in `.env.local` to remove review banners.

---

## 3. Email Notification Setup (Gmail SMTP)
To enable automated dispatch notification emails to staff and customers upon enquiry submission:
1. Generate a 16-character **Google App Password** for the business Gmail account (`myaccount.google.com/apppasswords`).
2. Add the following to `.env.local`:
   ```bash
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="465"
   SMTP_USER="notifications@yourdomain.rw"
   SMTP_APP_PASSWORD="your-16-digit-app-password"
   STAFF_NOTIFICATION_EMAIL="info@yourdomain.rw"
   ```
3. Test delivery in the Admin Portal by clicking **"Retry Emails"** on any enquiry detail screen.

---

## 4. Admin Access & Credentials
- **Admin Login Route**: `/admin/login`
- **Default Development Admin User**: `admin@travelrwanda.rw`
- **Default Development Password**: `Rwanda2026!Admin` (configurable via `ADMIN_SETUP_PASSWORD` in `.env.local`).
