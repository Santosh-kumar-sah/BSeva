# Bihar Sahayak (BSeva) 🇮🇳
### **AI-Powered Government Scheme & Career Intelligence Platform for Bihar**
> **Discover. Understand. Decide. Connect.**  
> *बिहार के नागरिकों, विद्यार्थियों, किसानों एवं युवाओं के लिए सरकारी योजनाओं एवं करियर अवसरों का डिजिटल मार्गदर्शक।*

---

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript: 5.7](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Database: Supabase PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![ORM: Prisma](https://img.shields.io/badge/ORM-Prisma%205.22-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![Backend: Node.js / Express](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Frontend: React 18 / TypeScript](https://img.shields.io/badge/Frontend-React%2018%20%2F%20TypeScript-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![Build Tool: Vite](https://img.shields.io/badge/Build-Vite%205.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%203.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

---

## 📌 Table of Contents
- [Executive Overview](#-executive-overview)
- [System Architecture](#-system-architecture)
- [End-to-End User Journey](#-end-to-end-user-journey)
- [Deterministic Eligibility Rule Engine](#-deterministic-eligibility-rule-engine)
- [Career & Skill Intelligence Engine](#-career--skill-intelligence-engine)
- [Core Features & Modules](#-core-features--modules)
- [Project Folder Structure](#-project-folder-structure)
- [Quick Start Guide](#-quick-start-guide)
- [Official Disclaimer](#-official-disclaimer)

---

## 🚀 Executive Overview

**Bihar Sahayak (BSeva)** is a modern GovTech discovery and intelligence layer designed to eliminate information asymmetry across Bihar's government ecosystem.

Rather than replacing official government websites, Bihar Sahayak serves as a **smart navigation and eligibility layer** that guides citizens directly to the right official departments, document checklists, and application portals.

```
┌─────────────────┐       ┌────────────────────────┐       ┌──────────────────────┐
│  Citizen Input  │  ──►  │   BSeva Intelligence   │  ──►  │ Official Govt Portal │
│ (Profile/Need)  │       │ (Eligibility + Skills) │       │ (ServicePlus / DBT)  │
└─────────────────┘       └────────────────────────┘       └──────────────────────┘
```

### Core Design Principles:
1. **Hindi-First & Simple UX:** Easy language with a 1-click `हिंदी / English` toggle for rural and semi-urban accessibility.
2. **Deterministic Rule Engine First:** Eligibility is computed via strict logical rules, eliminating AI hallucinations.
3. **100% Type-Safe Architecture:** Frontend written in **TypeScript 5.7 (`.tsx` / `.ts`)** with strict interfaces matching backend Prisma data contracts.
4. **Grounded Information:** Every scheme links directly to verified departmental portals (*ServicePlus, DBT Agriculture, MedhaSoft, BSDM*).
5. **Privacy-by-Design:** No collection of Aadhaar numbers or banking credentials during scheme discovery.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph ClientLayer ["Client Layer (TypeScript & React 18)"]
        UI["React 18 + TypeScript + Tailwind CSS (Bilingual Hindi/English)"]
        Types["Strict Type Definitions (types/index.ts)"]
        Router["React Router v6"]
        AuthCtx["Auth & Profile State (JWT)"]
    end

    subgraph APILayer ["Backend API Service (Node.js & Express)"]
        GW["Security Gateway (Helmet / CORS / Cookie-Parser)"]
        AuthMod["Auth & RBAC (Citizen / Admin)"]
        ProfMod["Citizen Profile Manager"]
        SchemeMod["Scheme Intelligence Catalog"]
        RuleMod["Deterministic Eligibility Engine"]
        CareerMod["Career & Skill Recommender"]
        AdminMod["Admin Verifier & Audit Logs"]
    end

    subgraph DataLayer ["Cloud Database Layer (Supabase PostgreSQL)"]
        PrismaClient["Prisma ORM 5.22"]
        PG[(Supabase PostgreSQL 15+ Cluster)]
        Tables["Users • Profiles • Schemes • Rules • Careers • AuditLogs"]
    end

    subgraph GovtLayer ["Official Bihar Govt Ecosystem"]
        SPlus["ServicePlus / RTPS Bihar"]
        AgriDBT["DBT Agriculture Bihar"]
        Medha["MedhaSoft Education"]
        BSDM["Bihar Skill Mission"]
    end

    UI --> Types
    UI --> Router
    Router --> AuthCtx
    AuthCtx -->|Typed REST API Requests| GW
    GW --> AuthMod & ProfMod & SchemeMod & RuleMod & CareerMod & AdminMod
    AuthMod & ProfMod & SchemeMod & RuleMod & CareerMod & AdminMod --> PrismaClient
    PrismaClient --> PG
    PG --- Tables
    SchemeMod -->|Direct Redirection| SPlus & AgriDBT & Medha & BSDM
```

---

## 🔄 End-to-End User Journey

```mermaid
sequenceDiagram
    autonumber
    actor User as Citizen / Student / Farmer
    participant UI as BSeva Web Portal (TypeScript)
    participant API as Backend REST API
    participant Engine as Deterministic Rule Engine
    participant DB as Supabase PostgreSQL
    participant Govt as Official Govt Portal (e.g. ServicePlus)

    User->>UI: Enters basic profile (Age, District, Education, Income, Category)
    UI->>API: POST /api/v1/eligibility/check (Typed Request)
    API->>DB: Fetch active scheme criteria
    DB-->>API: Return rulesets for 25+ verified schemes
    API->>Engine: Evaluate profile against rule groups (AND/OR AST)
    Engine-->>API: Match results with explainability matrix (Passed/Failed rules)
    API-->>UI: Return categorized results (Potentially Eligible / Needs Verification)
    User->>UI: Selects scheme & views interactive Document Checklist
    UI->>User: Displays required documents (Marksheets, Resident/Caste Certificates)
    User->>UI: Clicks "Apply on Official Portal"
    UI->>Govt: Safely redirects user to official government application page
```

---

## ⚙️ Deterministic Eligibility Rule Engine

Eligibility does not rely on guesswork. Every scheme's criteria is modeled as an Abstract Syntax Tree (AST) supporting relational operators and boolean groups:

```mermaid
flowchart TD
    Start([Citizen Profile Input]) --> FetchRules[Fetch Scheme Rules from Supabase]
    FetchRules --> GroupSplit{Group by rule_group}
    
    subgraph Group1 ["Rule Group 1 (AND Logic)"]
        C1["Condition 1: is_bihar_resident == true"] --> R1{Pass?}
        C2["Condition 2: age <= 25"] --> R2{Pass?}
        C3["Condition 3: education IN [12TH_PASS, GRADUATE]"] --> R3{Pass?}
        R1 & R2 & R3 -->|All Pass| G1Pass[Group 1 PASSED]
        R1 & R2 & R3 -.->|Any Fail| G1Fail[Group 1 FAILED]
    end

    GroupSplit --> Group1
    G1Pass --> EvalFinal{Any Group Passed?}
    G1Fail --> EvalFinal

    EvalFinal -->|Yes| PotEligible["POTENTIALLY_ELIGIBLE (100% Match)"]
    EvalFinal -->|Missing Fields Only| NeedsVerif["NEEDS_VERIFICATION (60% Match)"]
    EvalFinal -->|Criteria Failed| NotEligible["LIKELY_NOT_ELIGIBLE (0% Match)"]
```

---

## 🎓 Career & Skill Intelligence Engine

The career engine bridges educational credentials and market opportunities using a hybrid scoring algorithm:

$$\text{Match Score} = (0.35 \times \text{Education Fit}) + (0.45 \times \text{Skill Overlap}) + (0.20 \times \text{Interest Alignment})$$

```mermaid
flowchart LR
    A[Citizen Profile] --> B[Skill & Education Parser]
    B --> C[Career Pathways Catalog]
    C --> D[Hybrid Score Evaluator]
    D --> E[Top Career Recommendations]
    E --> F[Skill Gap Delta]
    F --> G[Direct BSDM Course Links]
```

---

## 🗂️ Core Features & Modules

| Module | Features & Capabilities |
|---|---|
| **Scheme Intelligence** | • 25+ verified Bihar schemes across 5 key departments.<br>• Full-text bilingual search (Hindi & English).<br>• Filter by Category (*Education, Agriculture, Employment, Women, Welfare, MSME*). |
| **Eligibility Wizard** | • Real-time evaluation across all 38 Bihar districts.<br>• Detailed criteria breakdown showing passed and failed conditions.<br>• Document checklist generator with interactive tick boxes. |
| **Career Explorer** | • 8+ high-demand career pathways (*Full Stack Dev, Solar Technician, AgriTech, GDA Nursing*).<br>• Salary benchmarks and minimum education prerequisites.<br>• Skill gap readiness calculator mapped to BSDM programs. |
| **Citizen Hub** | • Saved profiles and auto-calculated recommendations.<br>• Persistent cloud profile stored in Supabase PostgreSQL.<br>• Secure JWT authentication via HttpOnly cookies. |
| **Admin & Governance** | • Real-time metrics and category distribution analytics.<br>• Scheme verification status updater.<br>• Immutable security audit logging (`audit_logs`). |

---

## 📦 Project Folder Structure

```text
BiharAi/
├── backend/                  # Node.js & Express REST API
│   ├── prisma/
│   │   ├── schema.prisma     # Supabase PostgreSQL relational schema
│   │   └── seed.js           # Database seeder (25 schemes, rules, careers)
│   ├── src/
│   │   ├── config/           # Environment & JWT configs
│   │   ├── database/         # Prisma client & database connector
│   │   ├── middleware/       # JWT Auth & centralized error handling
│   │   ├── modules/
│   │   │   ├── admin/        # Admin analytics & scheme verification
│   │   │   ├── auth/         # Citizen registration & login
│   │   │   ├── careers/      # Career recommender & skill gap engine
│   │   │   ├── eligibility/  # Deterministic rule engine & condition evaluator
│   │   │   ├── profile/      # Citizen demographic profile CRUD
│   │   │   └── schemes/      # Scheme search, filter & detail endpoints
│   │   ├── routes.js         # Master API router (/api/v1)
│   │   └── server.js         # HTTP server entry point
│   └── tests/                # Jest & Supertest automated test suites
│
├── frontend/                 # React 18 + TypeScript + Vite Web App
│   ├── src/
│   │   ├── types/            # Strict TypeScript interfaces (User, Scheme, etc.)
│   │   │   └── index.ts
│   │   ├── components/       # Navbar.tsx, Footer.tsx, SchemeCard.tsx, EligibilityBadge.tsx
│   │   │   └── common/
│   │   ├── context/          # Typed AuthContext.tsx & language state
│   │   ├── pages/            # 11 Typed pages (Home, Schemes, Details, Eligibility, Careers, etc.)
│   │   ├── services/         # Typed Axios API client (api.ts)
│   │   ├── App.tsx           # Typed React Router v6 route configuration
│   │   └── main.tsx          # Vite React entry point
│   ├── tsconfig.json         # TypeScript compiler configuration
│   ├── tsconfig.node.json    # TypeScript Node configuration
│   ├── tailwind.config.js    # Tailwind CSS styling configuration
│   └── vite.config.js        # Vite dev server & proxy settings
│
├── data/
│   └── seed/                 # Verified seed datasets
│       ├── categories.json   # 6 Scheme taxonomy categories
│       ├── departments.json  # 5 Bihar government departments
│       ├── schemes.json      # 25 Verified Bihar government schemes
│       ├── rules.json        # Deterministic AST rule definitions
│       └── careers.json      # 8 Career pathways with skill mappings
│
├── docs/
│   ├── hld/                  # High-Level Architecture Design (HLD.md)
│   └── lld/                  # Low-Level Design & API Specifications (LLD.md)
│
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org) (v18+ recommended)
- [Git](https://git-scm.com)
- Free [Supabase](https://supabase.com) Account

---

### 1. Clone Repository
```bash
git clone https://github.com/Santosh-kumar-sah/BSeva.git
cd BSeva
```

---

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables in backend/.env
# PORT=5000
# DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
# DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
# JWT_SECRET="your-super-secret-jwt-key"

# Push schema to Supabase PostgreSQL & Seed data
npx prisma db push
node prisma/seed.js

# Run Automated Test Suite
npm test

# Start Backend Server
npm run dev
```

---

### 3. Frontend Setup (TypeScript)
```bash
cd ../frontend
npm install

# Type-check and Build
npm run build

# Start Vite Development Server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🔒 Security & Privacy Standards

- **Zero Sensitive Data Storage:** No collection of Aadhaar numbers, biometric data, or banking credentials during scheme discovery.
- **Role-Based Access Control (RBAC):** Strict authorization guards for `CITIZEN`, `DATA_VERIFIER`, `ADMIN`, and `SUPER_ADMIN`.
- **Immutable Audit Trails:** Every administrative status change is recorded in PostgreSQL with timestamp and actor ID.
- **AI Safety:** Prompts and engines are strictly grounded in official sources with mandatory citations.

---

## ⚠️ Official Disclaimer

> **Independent Prototype Notice:**  
> Bihar Sahayak (BSeva) is an independent technology platform designed to facilitate discovery and understanding of public opportunities. It is **not** an official agency of the Government of Bihar and does not grant final scheme approvals. Final eligibility, benefit disbursement, and decisions remain under the sole jurisdiction of the respective Bihar Government departments. Users should verify details on official portals before taking consequential action.

---

## 👨‍💻 Author & Maintainer

- **Developer:** Santosh Kumar Sah
- **GitHub:** [@Santosh-kumar-sah](https://github.com/Santosh-kumar-sah)
- **Repository:** [https://github.com/Santosh-kumar-sah/BSeva](https://github.com/Santosh-kumar-sah/BSeva)

*Built with ❤️ for the citizens of Bihar 🇮🇳*
