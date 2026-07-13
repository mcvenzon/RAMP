# Research Report: MRF Inventory & Marketplace

**Feature**: `001-mrf-inventory-marketplace`
**Status**: In Progress
**Created**: 2026-07-09

## Research Objectives

The goal of this research is to resolve technical uncertainties identified in the Implementation Plan to provide a solid foundation for the Design and Implementation phases.

### 1. Authentication Strategy
**Topic**: Supabase Auth vs. Custom JWT Implementation for MRF user roles (Collector, Manager, Buyer).

**Research Status**: [PENDING]

**Potential Questions**:
- How does Supabase Auth handle role-based access control (RBAC)?
- How easy is it to sync Supabase user metadata with the `User` entity in the database?
- What is the complexity of implementing custom roles in a standard PERN stack using Supabase?

---

### 2. Real-time Synchronization
**Topic**: Supabase Realtime vs. Socket.io for updating inventory and marketplace bids.

**Research Status**: [PENDING]

**Potential Questions**:
- Does Supabase Realtime support all the required triggers for inventory changes and bidding?
- What is the cost/complexity trade-off between using Supabase Realtime and setting up a dedicated Socket.io server?
- How does Supabase Realtime perform on mobile devices with intermittent connectivity?

---

### 3. Machine Learning (ML) Model Integration
**Topic**: Deployment of predictive models for material price/demand trends.

**Research Status**: [PENDING]

**Potential Questions**:
- What is the best way to invoke a Python-based ML model from a Node.js/Express backend?
- Can Supabase Edge Functions (Deno) be used for lightweight ML inference?
- Should we use a dedicated microservice for ML to ensure scalability and separation of concerns?

---

### 4. Deployment Architecture
**Topic**: Hosting strategy for React frontend, Express backend, and Supabase.

**Research Status**: [PENDING]

**Potential Questions**:
- What is the best way to connect a hosted Express backend to Supabase (Vercel/Railway/Render)?
- How do we manage environment variables across different hosting environments?
- What is the recommended CI/CD pipeline for this stack?

## Decision Log

*To be filled during the consolidation phase.*

| Decision | Rationale | Alternatives Considered | Status |
|----------|-----------|-----------------------|--------|
| | | | |

## Summary of Findings

*To be filled once research is complete.*
