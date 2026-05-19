# PRD — BENNOURI Pièces Auto

## Original Problem Statement
Build a French-language auto parts e-commerce platform "BENNOURI Pièces Auto" for the Tunisian market. Navigation: account & cart (panier). Users must register to order. Inspired by piecesautos.tn but using **VIN number** instead of license plate.

- **Screen 1**: User enters VIN, clicks "Valider"
- **Screen 2**: Vehicle data shown as breadcrumb (marque / modèle / carburant / VIN) + 3 cards (Mécanique, Électrique, Carrosserie) — data parsed from PartSouq-style source
- **Screen 3**: Parts subcategories for the chosen section with realistic icons
- Footer with shop address, phone, email, Visa/Mastercard icons
- Admin tab visible only to admin (users + orders)
- Logo provided (navy + steel BENNOURI logo)

## Architecture
- **Backend**: FastAPI + Motor (MongoDB async) + JWT (bcrypt + httpOnly cookie + Bearer fallback)
- **Frontend**: React 19 + React Router 7 + Tailwind + shadcn/ui + Sonner toasts
- **VIN decoding**: NHTSA public API + curated fallback dictionary
- **Catalog**: In-memory Python dict (3 sections × 5-6 categories × 4-6 parts each)
- **Payments**: Cash on Delivery (Visa/Mastercard logos in footer for trust)

## User Personas
- **Particulier**: car owner needing replacement parts identified by VIN
- **Garagiste**: mechanic ordering specific OEM parts for clients
- **Admin BENNOURI**: shop owner monitoring registered users + orders

## Core Requirements (static)
1. French UI throughout
2. VIN-based vehicle identification (no license plate)
3. 3-screen browsing flow (VIN → vehicle → categories)
4. Mandatory registration for ordering
5. Admin dashboard restricted by role
6. Tunisia-localized footer (TND currency, Tunis address)

## What's Been Implemented (2026-05-19)
### Backend
- `POST /api/auth/register|login|logout`, `GET /api/auth/me` — JWT + bcrypt
- `POST /api/vin/decode` — NHTSA + fallback
- `GET /api/catalog/sections|/{section}|/{section}/{category}`
- `POST /api/orders`, `GET /api/orders/mine`
- `GET /api/admin/{users,orders,stats}`, `PATCH /api/admin/orders/{id}`
- Admin seeded on startup: `admin@bennouri.com / Admin@123`
- MongoDB indexes on users.email (unique), users.id, orders.user_id, orders.id
- **Tests: 25/25 pytest cases passing (100%)**

### Frontend (12 pages/components)
- LandingPage with hero, VIN form, 3 section cards, brand showcase, CTA strip
- VinSearch (dedicated screen 1)
- VehicleDetail (screen 2 with breadcrumb + 3 cards)
- PartsCategory (screen 3 with subcategories + realistic SVG icons)
- PartsList (cards with image, ref, brand, price TND, add-to-cart)
- Cart (with Cash-on-Delivery checkout, vehicle reminder)
- Login / Register
- Account (my orders)
- AdminDashboard (stats + orders table with status updates + users table)
- Footer (address, phone, email, Visa/Mastercard/Cash SVG icons, trust strip)
- Custom SVG icons for engine, gearbox, brake, battery, headlight, etc.

### Design system
- Typography: Outfit (display) + IBM Plex Sans (body) + JetBrains Mono (VIN)
- Colors: Navy `#0F172A` + Steel `#64748B` + Red `#DC2626` accent
- Sharp corners (industrial feel), 1px borders, subtle hover shadows
- Custom animations (bn-fade-up, bn-stagger)

## Prioritized Backlog
### P1
- Real payment integration (Stripe / D17 / Konnect for Tunisia)
- Email notifications on order confirmation (Resend / SendGrid)
- Search bar inside parts list (by ref or name)
- Real parts database (currently in-memory dict)

### P2
- Multi-language toggle (FR / AR)
- Wishlist / save vehicles
- Image gallery per part (multiple angles)
- PDF invoice export
- SMS notifications via Twilio for delivery updates
- Brute-force lockout on login (mentioned by testing agent)
- Password strength validation (mentioned by testing agent)
- Replace CORS `*` with explicit frontend origin (when production-ready)
