# DentalFlow AI – Dental Practice Marketing Automation Platform

> **Full-Stack Intelligent Dental Operations, Practice Marketing Automation & Predictive Patient Engagement**

DentalFlow AI is a specialized dental practice marketing automation and operational intelligence platform. It streamlines enquiry triage, predicts appointment no-show risks, automatically matches cancellation openings to waitlisted patients, groups multi-member household appointments, drafts empathetic treatment plan nudges, and generates HIPAA-compliant review responses.

Built as a full-stack application featuring a high-performance **React 19 + TypeScript** frontend and a modular **Node.js + Express + Prisma + SQLite** backend inside a unified monorepo repository.

---

## 🌟 Key Features

### 1. Patient Engagement & Clinical Directory
* **Comprehensive Patient Profiles**: Stores communication preferences, engagement scores, appointment histories, interaction timelines, and administrative staff notes.
* **Consent & Channel Preferences**: Respects patient communication channels (SMS, Email, Phone) and verifies communication consent.

### 2. Enquiry & Lead Management
* **Multi-Channel Ingestion**: Handles website booking forms, emergency requests, email queries, and phone notes.
* **Lead Pipeline**: Tracks lead progression through `New`, `Pending Review`, `Responded`, `Follow-up Required`, `Converted`, and `Closed`.
* **One-Click Lead Conversion**: Automatically links newly converted leads into patient records and triggers celebration feedback.

### 3. Appointments & Follow-up Task Management
* **Calendar & Chair Logistics**: Operatory allocation, provider assignment, appointment statuses, and historical attendance tracking.
* **Actionable Staff Tasks**: Prioritized queues (`due_today`, `overdue`, `scheduled`) for reception callbacks, consultation reminders, and insurance reviews.

### 4. Practice Analytics & Intelligence Overview
* Real-time metrics aggregated directly from the database: total active patients, enquiry volume, conversion rate, appointment scheduling rate, no-show risk distribution, waitlist volume, and review sentiment metrics.

### 5. 🤖 AI Operations Modules (6 Integrated Modules)

1. **Lead Classification & Specialty Triage (`/api/ai/lead-classification`)**:
   * Classifies inbound text into dental specialties (*Orthodontics*, *Cosmetic Dentistry*, *Endodontics*, *Periodontics*, *Pediatric Dentistry*, *Oral Surgery*, *General Dentistry*, etc.).
   * Detects multi-procedure inquiries, determines patient intent (*High Intent*, *Urgent Review Request*, *Price Inquiring*), generates explainable suggested actions, and calculates confidence scores.
2. **Predictive No-Show Risk Defense (`/api/ai/no-show-prediction`)**:
   * Evaluates historical attendance, lead times, confirmation status, and appointment timing to score no-show risk (0–100) and assign risk tiers (*Low*, *Medium*, *High*).
   * Generates actionable chair defense interventions (two-way SMS, phone triage, standby matching).
3. **Smart Waitlist Fast-Fill Matching (`/api/ai/waitlist-match`)**:
   * Instantly scans the patient waitlist when a slot is cancelled.
   * Matches candidate preferences (provider, proximity, flexible days, procedure urgency) and ranks top candidates with match scores and acceptance probabilities.
4. **Household Appointment Bundling (`/api/ai/household-bundling`)**:
   * Identifies family members under the same household and clusters their appointments into concurrent or back-to-back operatory windows.
   * Calculates community travel reductions while preserving individual patient privacy.
5. **Empathetic Treatment Plan Nudges (`/api/ai/treatment-nudges`)**:
   * Generates a 4-step non-coercive outreach sequence tailored to patient concerns (*Cost concerns / financing*, *Dental anxiety & pain management*, *Busy scheduling*).
   * Verifies communication consent and prepares educational check-in drafts.
6. **Reputation Management & Review Response Generation (`/api/ai/review-response`)**:
   * Generates polite, professional draft responses to patient reviews across Google and Yelp.
   * Strictly enforces HIPAA guidelines: never confirms clinical procedures, patient names, or private medical details in public responses.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React 19 (`react` & `react-dom` 19.2)
* **Language**: TypeScript (~6.0)
* **Build Tool**: Vite 8.3
* **Styling**: Tailwind CSS 3.4
* **UI Components & Icons**: Lucide React, Recharts, Canvas Confetti, clsx, tailwind-merge

### Backend
* **Runtime**: Node.js (v20+ / v24+)
* **Framework**: Express.js (v4.21)
* **Language**: TypeScript (v5.8)
* **ORM**: Prisma ORM (v6.19)
* **Database**: SQLite (`dev.db` - zero external database installations required)
* **Validation**: Zod
* **Development Server**: `tsx` (TypeScript Execution with Hot Reload)
* **CORS & Environment**: CORS, Dotenv

---

## 📁 Repository Structure

```text
APP/
│
├── src/                               # React + TypeScript Frontend
│   ├── assets/                        # Static assets and icons
│   ├── components/                    # Modular UI components
│   │   ├── ai/                        # AI Assistant and classification badges
│   │   ├── common/                    # Badges, buttons, modals, dropdowns
│   │   ├── enquiries/                 # Enquiry cards, details drawer, filters
│   │   ├── followups/                 # Follow-up task cards and modals
│   │   ├── layout/                    # TopHeader, Sidebar, Shell
│   │   ├── operations/                # AI Operations views (No-Show, Waitlist, Households, etc.)
│   │   ├── patients/                  # Patient cards, details drawer, history
│   │   └── workflows/                 # Automation workflow cards and builder
│   ├── context/                       # Global State Management (DentalFlowContext.tsx)
│   ├── data/                          # Initial mock datasets and seed templates
│   ├── pages/                         # Main page views (Dashboard, Enquiries, Analytics, etc.)
│   ├── services/                      # Frontend services & API integration layer
│   │   ├── api/                       # HTTP API client (client.ts & dentalApi.ts)
│   │   └── ...                        # Client-side heuristic calculation services
│   ├── types/                         # TypeScript domain models and interfaces
│   ├── App.tsx                        # Root application layout and route handling
│   └── main.tsx                       # React application entrypoint
│
├── server/                            # Node.js + Express Backend
│   ├── prisma/
│   │   ├── schema.prisma              # Complete database schema (11 relational models)
│   │   └── seed.ts                    # Idempotent database seed script
│   ├── src/
│   │   ├── config/                    # Environment and Prisma Client instances
│   │   ├── controllers/               # Express route controllers
│   │   ├── middleware/                # Error handling and validation middlewares
│   │   ├── routes/                    # API route definitions (/api/*)
│   │   ├── services/                  # Core domain logic and AI rule engines
│   │   │   ├── ai/                    # 6 AI operational service engines
│   │   │   └── ...                    # Patient, Enquiry, Appointment services
│   │   ├── app.ts                     # Express application configuration
│   │   └── server.ts                  # Server initialization and graceful shutdown
│   ├── package.json                   # Server dependencies and scripts
│   ├── tsconfig.json                  # Backend TypeScript configuration
│   └── .env.example                   # Server environment template
│
├── package.json                       # Root scripts orchestrating frontend & backend
├── vite.config.ts                     # Vite bundler configuration
├── tailwind.config.js                 # Tailwind CSS theme configuration
└── README.md                          # Full system documentation
```

---

## ⚙️ Environment Variables

### Frontend (`.env` or `.env.example` in repository root)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (`server/.env` or `server/.env.example`)
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL="file:./dev.db"

# Optional: External LLM API key (e.g., OpenAI, Gemini, Claude)
# If blank, the server automatically uses the built-in deterministic dental heuristic engine
AI_API_KEY=
AI_PROVIDER=rule-based
```

---

## 🚀 Installation & Getting Started

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher (v24 recommended)
* **npm**: v9.0.0 or higher

### 2. Install Dependencies

Install root (frontend) dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd server
npm install
cd ..
```

### 3. Initialize & Seed Database

Generate Prisma client and populate realistic dental practice seed data:
```bash
npm run server:seed
```

*(This creates `server/dev.db` containing initial patients, appointments, enquiries, waitlist candidates, households, and reviews).*

---

## 🖥️ Running the Application

Open two terminal tabs:

### Terminal 1: Backend Server (Port 5000)
```bash
npm run server:dev
```
*Or run the production build:*
```bash
npm run server:build
npm run server:start
```
* Backend API URL: `http://localhost:5000`
* Healthcheck: `http://localhost:5000/api/health`

### Terminal 2: Frontend Client (Port 5173)
```bash
npm run dev
```
* Frontend Application URL: `http://localhost:5173`

> **Automatic Offline Fallback**: If the backend is not running, the frontend automatically falls back to **Local Demo Mode** via localStorage without crashing. An indicator badge in the top navigation bar displays `🟢 Backend Live (:5000)` when connected, or `🟡 Local Demo Mode` when offline.

---

## 📡 API Endpoint Reference

All endpoints are hosted under `/api`.

### Core Practice Endpoints

| Method | Endpoint | Description | Sample Body / Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health & database connectivity check | None |
| `GET` | `/api/patients` | Retrieve patients with search & filter | `?search=Sarah&engagementLevel=Active` |
| `GET` | `/api/patients/:id` | Get patient details with timeline & notes | None |
| `POST` | `/api/patients` | Create patient profile | `{"name":"John Doe","email":"john@demo.com","phone":"+15551234567"}` |
| `PATCH` | `/api/patients/:id` | Update patient record | `{"engagementScore": 95}` |
| `POST` | `/api/patients/:id/notes` | Add administrative/clinical note | `{"author":"Dr. Wilson","text":"Follow-up booked"}` |
| `GET` | `/api/enquiries` | Get enquiries with status & specialty filter | `?specialty=Orthodontics&status=New` |
| `POST` | `/api/enquiries` | Ingest new lead (auto AI classified) | `{"patientName":"Jane","message":"Need clear aligners"}` |
| `PATCH` | `/api/enquiries/:id` | Update status or assigned staff | `{"status":"Converted"}` |
| `POST` | `/api/enquiries/:id/classify`| Trigger AI re-classification | None |
| `GET` | `/api/appointments` | Get appointments | `?date=2026-09-24` |
| `POST` | `/api/appointments` | Book appointment (auto no-show scored) | `{"patientName":"Dan","date":"2026-09-25","time":"10:00 AM"}` |
| `POST` | `/api/appointments/:id/simulate-cancel` | Cancel slot and trigger waitlist fill | None |
| `GET` | `/api/follow-ups` | List follow-up tasks | `?status=due_today` |
| `POST` | `/api/follow-ups` | Schedule staff follow-up task | `{"title":"Call Sarah","patientName":"Sarah"}` |
| `POST` | `/api/follow-ups/:id/complete` | Complete follow-up task | None |
| `GET` | `/api/analytics/overview` | Practice performance metrics & trends | None |

### AI Operations Endpoints

| Method | Endpoint | Description | Sample Request | Sample Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/lead-classification` | Specialty & procedure detection with intent scoring | `{"message": "Cracked molar eating dinner, very sharp"}` | `{"classification": "emergency-related", "specialty": "General Dentistry", "priority": "Urgent Review", "confidence": 94}` |
| `POST` | `/api/ai/no-show-prediction` | Multi-factor appointment no-show probability estimation | `{"patientName": "Dan", "confirmationStatus": "unconfirmed", "leadTimeDays": 10}` | `{"riskLevel": "High", "riskScore": 68, "factors": ["Unconfirmed 48h prior"], "recommendedActions": ["Phone triage"]}` |
| `POST` | `/api/ai/waitlist-match` | Matches open slot against waitlisted patients | `{"date": "2026-09-20", "time": "2:00 PM", "provider": "Dr. Chen"}` | `{"matchedCount": 2, "topCandidate": {"patientName": "Amara Patel", "matchScore": 94, "acceptanceProbability": 0.92}}` |
| `POST` | `/api/ai/household-bundling` | Bundles family appointments into single visit | `{"householdId": "H1", "familyName": "Kumar", "members": [...]}` | `{"efficiencyGain": "Saves 2 separate family round trips", "recommendedTimeWindow": "10:00 AM - 12:00 PM"}` |
| `POST` | `/api/ai/treatment-nudges` | Generates 4-step empathetic treatment plan outreach | `{"patientName": "Elena", "procedure": "Implants", "objectionCategory": "Cost concern"}` | `{"steps": [{"stepNumber": 1, "channel": "email", "subject": "Reviewing treatment financing options", ...}]}` |
| `POST` | `/api/ai/review-response` | HIPAA-compliant public review response generation | `{"reviewerName": "Rebecca", "rating": 5, "reviewText": "Great team!"}` | `{"response": "Dear Rebecca, thank you for your kind words...", "requiresHumanReview": true, "hipaaSafe": true}` |

---

## ⚖️ Demo Disclaimers & Safety Guardrails

1. **Hackathon Prototype & Demo Environment**:
   * DentalFlow AI is designed as an operational support prototype for dental practice staff and administrators.
   * All patient names, phone numbers, and emails provided in seed data are strictly fictional demonstration records.
2. **Explainable Rule-Based Fallbacks**:
   * AI classification and no-show prediction algorithms use deterministic, transparent domain heuristics when external LLM API keys are not provided.
   * Outputs are clearly labelled with `isDemo: true` in API responses.
3. **Clinical Non-Interference**:
   * AI recommendations support administrative scheduling and patient follow-up logistics.
   * The platform does **not** provide medical advice, diagnosis, or clinical treatment plans.
4. **Staff Review & Approval Safeguards**:
   * All AI-generated communication drafts and review responses require explicit human staff review before simulated delivery.
   * External messaging providers (Twilio SMS, SendGrid Email) are not triggered automatically in demonstration mode.

---

## 📜 License

This project is created for demonstration and hackathon evaluation purposes. All rights reserved.
