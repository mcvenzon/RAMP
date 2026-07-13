# Implementation Plan: MRF Inventory & Marketplace

**Branch**: `001-mrf-inventory-marketplace` | **Date**: 2026-07-09 | **Spec**: `specs/001-mrf-inventory-marketplace/spec.md`

**Input**: Feature specification from `specs/001-mrf-inventory-marketplace/spec.md`

## Summary

Build a web application for a Material Recovery Facility (MRF) to manage inventory, include a marketplace for selling recyclables, provide mobile support for garbage collectors, and utilize machine learning for predictive market analytics. The system uses a PERN stack with Supabase for authentication, real-time database capabilities, and a Python/FastAPI microservice for ML tasks.

## Technical Context

**Language/Version**: Node.js (v18+), Python 3.10+

**Primary Dependencies**: Express, React, Supabase (PostgreSQL, Auth, Realtime), FastAPI, Tailwind CSS

**Storage**: Supabase (PostgreSQL)

**Testing**: Jest (Backend), Vitest (Frontend), Pytest (ML Service)

**Target Platform**: Web (Mobile-first design)

**Project Type**: Full-stack Web Application

**Performance Goals**: 
- Mobile sync latency < 2s.
- Marketplace search < 500ms.

**Constraints**: 
- WCAG 2.1 AA accessibility.
- Real-time inventory updates via CDC.

**Scale/Scope**: Support for multiple MRF facilities and high-volume marketplace transactions.

## Constitution Check

**Checklist for Compliance:**

- [x] **KISS**: Simple decoupled architecture (Frontend/Backend/ML).
- [x] **DRY**: Centralized data model and API contracts.
- [x] **YAGNI**: Focused on core requirements (Inventory, Marketplace, Analytics).
- [x] **SOLID**: Decoupled services (Express for business logic, FastAPI for ML).
- [x] **UX Guardrail**: Mobile-first design system and high-contrast UI.
- [x] **Performance Guardrail**: Specific latency requirements defined.

## Project Structure

### Documentation (this feature)

```text
specs/001-mrf-inventory-marketplace/
├── plan.md              # Implementation Plan
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

ml-service/
├── main.py
├── models/
└── requirements.txt
```

**Structure Decision**: Decoupled Monorepo-style structure to support independent deployment of the ML microservice.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Python Microservice | ML ecosystem compatibility | Express/Node.js lacks mature ML libraries |
