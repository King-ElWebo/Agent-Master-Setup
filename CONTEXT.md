# 🌐 Ultimate Next.js Master Setup - Architectural Navigation & Workflow Manual

This document serves as the high-level operational manual, tactical playbook, and architectural context anchor for both human developers and incoming AI agents. It establishes the domain boundaries, defines folder responsibilities, and enforces a non-negotiable step-by-step pipeline for feature implementation.

---

## 🏛️ 1. Project Strategy & Domain Separation

This repository is engineered to be the **Ultimate Universal Master-Template**—a product-agnostic, commercial-grade system designed to be duplicated and customized for new projects in minutes. To support diverse clients, the codebase enforces a strict separation of concerns between its two main entry points:

### 🔒 A. The Admin Cockpit (`src/app/(admin)`)
* **Purpose:** A unified, secure administrative panel for content management, configuration updates, and operational overview.
* **Architecture:** Follows a structured layout system with highly reusable dashboard modules, unified form structures, and standardized feedback overlays.
* **Integrity:** Strictly locked down by the edge middleware guard and server authentication gateways.

### 🎨 B. The Public Frontend (`src/app/(public)`)
* **Purpose:** The customer-facing web experience.
* **Architecture:** **100% individual, unconstrained, and free.** 
* **Design Freedom:** The public views are completely decoupled visually and structurally from the admin panel's aesthetic. They must adapt entirely to the client's custom brand identity, typography, layout structures, and unique UI/UX demands without any system-level constraints.

---

## 🏗️ 2. Core Project Architecture & Navigation

A breakdown of the directory responsibilities and boundaries:

```
├── .ai-agents/               # Specialized rule sheets for AI coding assistants
│   ├── ui-ux-pro-max-skill/  # Reference guidelines and component structures
│   ├── app-architecture.md   # App router, routing guards, and middleware rules
│   ├── backend-rules.md      # Database schemas, repositories, and API standards
│   └── design-to-code.md     # Guidelines for translating mockups into active code
├── prisma/                   # Database configuration and migrations
│   ├── schema.prisma         # The 4-Pillar Relational Schema
│   └── migrations/           # Version-controlled database migration history
├── public/                   # Static assets and media uploads
│   └── uploads/              # Local media storage directory
├── src/
│   ├── app/                  # Next.js App Router root
│   │   ├── (admin)/          # Secure administrative pages
│   │   ├── (public)/         # SEO-optimized public-facing pages
│   │   ├── api/              # Secure Next.js Route Handlers
│   │   │   └── admin/        # 401-Guarded Admin CRUD endpoints
│   │   ├── login/            # Admin authentication boundary
│   │   ├── globals.css       # Core styling entries and CSS variables
│   │   └── layout.tsx        # Base document frame and runtime contexts
│   ├── components/           # Presentation UI components
│   ├── context/              # Client-side state managers and i18n context
│   ├── dictionaries/         # Translation dictionaries (e.g., en.json, de.json)
│   ├── hooks/                # Custom React hooks (e.g., useTranslation)
│   ├── lib/                  # Server-side utility layers
│   │   ├── prisma.ts         # Singleton database connection client
│   │   ├── repositories/     # Data Access Abstraction Layer (Repository Pattern)
│   │   └── storage/          # Local binary file storage handlers
│   └── middleware.ts         # Edge-level security route guards
├── .ai-instructions.md       # Primary ground truth for all AI agents
└── DESIGN.md                 # Premium Motion & UX Philosophy Manual
```

---

## 🛠️ 3. The 4-Phase Multi-Agent Workflow

To maintain absolute code sanity and prevent visual or structural regression, every new feature, page, or refactoring MUST pass through this exact 4-phase assembly line. No phase may be skipped.

### 🎨 [PHASE 1] UI PROTOTYPING & OPEN DESIGN
* **Agent Role:** Open Design Specialist
* **Model Engine:** `gemini-3.1-pro-preview` (optimized for deep visual prompt translation, structural Next.js folder injections, and strict compliance with `.ai-agents/design-to-code.md`)
* **Reference Rule-Sheets:** `.ai-agents/design-to-code.md` and the structural patterns in `.ai-agents/ui-ux-pro-max-skill/`
* **Focus:** Visual layout, responsive grid structures, and interactive states.
* **Orchestration:** Driven by **`gemini-3.1-pro-preview`** (via Open Design). Optimized for deep visual prompt translation, structural Next.js folder injections, and strict compliance with `.ai-agents/design-to-code.md`.
  - Build frontend pages and component skeletons inside `src/app/(public)` (free/custom brand design) or `src/app/(admin)` (structured admin components).
  - **Mock Data Isolation:** Feed all components strictly with static fixtures from `src/lib/repositories/fixtures.ts`.
  - **Decoupling:** The visual skin must be completely decoupled from active database clients, server actions, Route Handlers, or remote APIs.
  - Buttons and forms must simulate interactions locally without triggering network requests.

### ⚡ [PHASE 2] BACKEND INTEGRATION (ANTIGRAVITY ENGINE)
* **Agent Role:** Enterprise Backend Architect / Antigravity Engine
* **Model Engine:** `gemini-3-pro-preview` (optimized for PostgreSQL schema mutations, type-safe repositories, and strict API Zod validation layer)
* **Reference Rule-Sheets:** `.ai-agents/backend-rules.md` and `.ai-instructions.md`
* **Focus:** Data schema modification, secure API routing, and repository binding.
* **Orchestration:** Driven by **`gemini-3-pro-preview` (Antigravity Engine)**. Optimized for PostgreSQL schema mutations, type-safe repositories, and strict API Zod validation layer.
  - Update `prisma/schema.prisma` if schema changes are required.
  - Implement data access logic exclusively within the Repository Layer (`src/lib/repositories/[model].ts`).
  - Create secure Next.js Route Handlers (`src/app/api/admin/[model]/route.ts`) to handle mutation requests.
  - Replace Phase 1 static fixtures with async repository triggers and database-bound state.
  - Apply robust payload validation (e.g., parsing, data cleansing, and strict sanitization rules) at the route ingestion gateway.

### ✨ [PHASE 3] VISUAL & MICRO-MOTION POLISH
* **Agent Role:** Micro-Interaction Polish Agent
* **Model Engine:** `chatgpt-pro` (optimized for scanning existing components, executing micro-interaction polishing via `DESIGN.md`, removing broad transitions, and securing WCAG contrast levels)
* **Reference Rule-Sheets:** `DESIGN.md` (Emil Kowalski Motion Framework)
* **Focus:** Transition tuning, micro-interactions, and premium tactile feel.
* **Orchestration:** Driven by **`chatgpt-pro` (Codex)**. Optimized for scanning existing components, executing micro-interaction polishing via `DESIGN.md`, removing broad transitions, and securing WCAG contrast levels.
  - Audit all styling properties against the guidelines in `DESIGN.md`.
  - Enforce explicit CSS transitions on interactive elements instead of broad, generic transition shortcuts.
  - Verify tactile interaction responses (such as immediate downscaling on click) and smooth, non-jarring enter/exit animations.
  - Adjust animation curves, durations, and state transitions to establish speed, responsiveness, and premium perceived performance.
  - Validate accessibility guidelines and visual contrast thresholds for both light and dark themes.

### 🏁 [PHASE 4] SANITY AUDIT & VERIFICATION
* **Agent Role:** Human Operator (acting as the ultimate gatekeeper)
* **Model Engine:** None (executed strictly by the developer via the local terminal)
* **Focus:** Compilation integrity, static type checking, and production readiness.
* **Orchestration:**
  - Execute static type analysis to ensure absolute safety:
    ```bash
    npx tsc --noEmit
    ```
  - Run the production build process locally to confirm compiler success and optimize assets:
    ```bash
    npx next build
    ```
  - Verify that edge-level middleware guards successfully capture and protect new route directories.
  - Ensure zero runtime warnings or compilation errors are present.

---

## 🔑 4. Core Integration & Abstraction Directives

To keep this template robust, modular, and highly customizable for any target business, all developments must respect these foundational directives:

1. **Strict Repository Abstraction:** 
   No UI page, layout, or component may execute direct database queries or import ORM clients. Data fetching and persistence are restricted to the `src/lib/repositories/` abstraction layer. This isolates business logic and makes switching data strategies (e.g., between local Prisma PostgreSQL and a Headless CMS) trivial.
2. **Defensive API Gateways:** 
   Route Handlers must treat all incoming client inputs as untrusted. Every payload must be rigorously validated and parsed before entering the database.
3. **Decoupled i18n Strategy:** 
   Multilingual strings must read dynamically through translation dictionaries (`src/dictionaries/`), utilizing structural safety fallbacks to prevent broken layouts.
4. **Local Binary Pipelines:** 
   Media engines must write directly to physical disk paths using unique hashed identities to prevent file encoding and naming collisions.