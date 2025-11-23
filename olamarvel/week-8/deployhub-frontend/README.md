# DeployHub Frontend — PulseTrack

# Table of contents

* [Live demo](#live-demo)
* [Observability and analytics](#observability-and-analytics)
* [Project overview](#project-overview)
* [Features implemented](#features-implemented)
* [Technology stack](#technology-stack)
* [Setup and installation](#setup-and-installation)
* [Quick dev commands](#quick-dev-commands)
* [Usage](#usage)

# Live demo

The live frontend is deployed on Vercel:
[https://deployhub-nine.vercel.app/](https://deployhub-nine.vercel.app/)

Note: the backend is hosted separately so the first API request can take a moment.

# Observability and analytics

The frontend performs lightweight readiness checks so you can actually measure things when users show up.

What it does

* Pings `/health-check` for readiness checks
* Optionally can scrape `/metrics` if you enable it
Add this to `.env.local` at the root of the frontend repo:

```env
VITE_API_BASE_URL=http://localhost:5000
```

This variable is used by the client to:

* make auth and data requests
* perform health checks
* optionally poll or reference `/metrics`

# Project overview

PulseTrack frontend is the UX for a health monitoring app that manages activities, appointments, and doctors. It focuses on solid auth flows, protected routes, and a responsive, accessible UI.

# Features implemented

* Authentication UI

  * Login and register pages
  * Axios interceptor that refreshes access tokens automatically
  * Persistent sessions
* Protected routes for Activities, Doctors, and Appointments
* Activities module: create, list, view details
* Doctors module: list, add, view details
* Appointments module: schedule, list, view details
* Observability integration: readiness ping, optional metrics, client-side login events
* Responsive UI built with Tailwind CSS
* Swiper.js for carousels and interactive components
* "Coming soon" placeholders for future features like Meals

# Technology stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Axios (with interceptors)
* Swiper.js
* Env config via `.env.local` using VITE_API_BASE_URL

# Setup and installation

Prerequisites: Node.js v18 or later

1. Clone the frontend repo

```bash
git clone
cd pulsetrack-frontend
```

2. Install dependencies

```bash
npm install
```

3. Create `.env.local`

```env
VITE_API_BASE_URL=http://localhost:5000
```

4. Start dev server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

# Quick dev commands

* `npm run dev` - start dev server
* `npm run build` - production build
* `npm run start` - start production server
* `npm run lint` - lint the codebase
* `npm run test` - run tests

# Usage

1. Start the frontend (`npm run dev`).
2. Visit `http://localhost:3000`.
3. Register or login.
4. Explore Activities, Doctors, and Appointments.
<<<<<<< HEAD
5. Watch network calls for `/health-check` pings and login analytics events if you want proof that it is working.
=======
5. Watch network calls for `/health-check` pings and login analytics events if you want proof that it is working.
>>>>>>> a8e71cd (Fix: added readme documentation.)
