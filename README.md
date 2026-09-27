# Ravi Tools & Hydraulics — Website

A full-stack e-commerce site for Ravi Tools & Hydraulics (borewell hardware &
hydraulics retailer, Tiruchengode, Tamil Nadu). Built with Next.js 15 (App
Router), React 19, TypeScript, Tailwind CSS and SQLite (`better-sqlite3`).

## What's included

**Storefront (customer-facing)**
- Homepage with trust signals, category cards (photo + icon), featured products
- Live search (matches name / description / category as you type)
- Category browsing, product detail pages, breadcrumbs everywhere
- Two order paths: straight checkout (online payment via Razorpay, with a
  pay-on-delivery fallback) **or** "Request a Call" → opens WhatsApp with a
  pre-filled enquiry message
- Cart, checkout, order confirmation
- Enquiry form (name / phone / message) → also reachable from WhatsApp
- About & Location page (address, phone, email, hours, embeddable map, shop photos)
- Sticky call/WhatsApp button, mobile-first responsive design throughout
- Steel-blue + safety-orange + charcoal brand palette, industrial heading
  font (Oswald) + readable body font (Inter), new logo (wrench/bolt mark)

**Admin panel (owner-facing, at `/admin`)**
- Single secure login (bcrypt-hashed password, rate-limited, session cookie)
- Add / edit / remove products (photo, name, description, price, category) —
  changes publish instantly, no extra "go live" step
- Mark a product out of stock without deleting it
- Manage categories: rename, merge two categories into one, or split
- View incoming orders and enquiries in the same panel

## Getting started locally

```bash
npm install
cp .env.example .env      # then edit the values described below
npm run dev
```

Open http://localhost:3000 for the storefront and http://localhost:3000/admin
for the admin panel.

The database is a single SQLite file. **It is created and seeded
automatically the first time the app runs** — you do not need to run a
separate seed command. It creates:

- One admin account, using the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`
- The 5 launch categories from the brief (Bolts and Nuts, Screw Drivers,
  Double End and Rings, Hydraulic Fittings, MS Pipe Fittings), each with a
  couple of sample placeholder products so the site isn't empty on first boot

**Replace the sample products from the admin panel** before going live — they
exist only so the storefront isn't blank; look for the products marked as
samples and either edit them with your real photos/prices or delete them.

### Resetting the database

```bash
npm run reset-db
```

This deletes the local SQLite file; it will be recreated and reseeded the
next time the app starts.

### Environment variables (`.env`)

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_PATH` | yes | Path to the SQLite file, e.g. `./data/app.db`. Needs a **persistent disk** — see Deployment below. |
| `SESSION_SECRET` | yes | Any long random string, used to sign session identifiers. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | yes (first boot only) | Used once, to create the first admin account when the database is empty. Change the password from inside the admin panel after your first login — see below. |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | no | Leave blank to launch immediately with the "Request a Call" / pay-on-delivery flow only. Fill in real Razorpay keys later to accept online card/UPI payments at checkout — no code changes needed. |
| `STORAGE_DRIVER` | no | `local` by default — product photos are saved to `public/uploads/`. See below for swapping to Cloudinary. |

### Changing the admin password after first login

The admin account created from `.env` uses whatever `ADMIN_PASSWORD` was set
at first boot. Log in, then change it from the admin panel's account
settings — don't leave the boot-time password in place long-term, and treat
`.env` as a secret file (never commit it).

A note on the auth model: it's a real, working login — bcrypt-hashed
password, rate-limited attempts, httpOnly session cookie — appropriate for a
single-owner admin panel like this one. It is not a bank-grade auth system
(no 2FA, no audit log), which is more security than a shop admin panel
like this typically needs, but worth knowing if you ever expose it beyond
yourself.

## Deployment

This app needs a host with a **persistent filesystem**, because it uses:
- a local SQLite database file, and
- local disk storage for uploaded product photos

**This means it will NOT work as-is on Vercel or other serverless hosts**,
since their filesystems are ephemeral/read-only at runtime. Good options:

- **Railway**, **Render**, or **Fly.io** — each supports a small persistent
  volume; point `DATABASE_PATH` and the uploads folder at that volume.
- A basic **VPS** (DigitalOcean, Linode, Hetzner, etc.) running `npm run
  build && npm run start` behind a process manager (pm2/systemd) and a
  reverse proxy (nginx/Caddy) for HTTPS.
- **Docker**, on any of the above, with the SQLite file and `public/uploads/`
  mounted as a volume so they survive redeploys.

If you later want to move to a serverless host (Vercel etc.), swap the image
storage driver to Cloudinary — a placeholder adapter and env vars for this
are already stubbed in `.env.example` (`STORAGE_DRIVER=cloudinary` plus the
Cloudinary credential vars) — and move the SQLite database to a hosted
Postgres/MySQL, since serverless functions can't persist a local file.

### Enabling real online payments

Leave `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` blank to launch now — checkout
still works, falling back to "pay on delivery / pay by UPI on call". Whenever
you're ready:

1. Create a Razorpay account and generate API keys.
2. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your production `.env`.
3. Redeploy. Checkout will automatically start creating real Razorpay orders
   and opening the payment widget — no code changes needed.

## A couple of things worth knowing

- **Google Fonts / Google Maps**: the app uses `next/font/google` (self-hosted
  at build time, standard Next.js behavior) and can embed a Google Maps
  location on the About page. Both are ordinary, widely-supported features —
  they simply couldn't be live-tested inside this sandboxed build
  environment (its network allowlist blocks those domains), but will work
  normally wherever you build/host this.
- **Product photos**: uploaded through the admin panel, they're
  automatically compressed client-side before upload (resized, JPEG-compressed)
  to keep the site fast — no need to pre-resize photos yourself.
- **Checkout pricing is re-verified server-side**: even if someone tampered
  with prices in their browser, the server always re-prices every order line
  from the current database price before creating an order.
