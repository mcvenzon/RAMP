# Data Model: MRF Inventory & Marketplace

**Feature**: `001-mrf-inventory-marketplace`
**Status**: Draft
**Created**: 2026-07-09

## Overview

This document defines the logical data model for the MRF Inventory & Marketplace feature. It focuses on the relationships and attributes required to support inventory tracking, marketplace transactions, and predictive analytics.

## Entities & Attributes

### 1. User
*Managed via Supabase Auth, with additional application-specific metadata.*

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| `id` | UUID | Primary Key (matches Supabase Auth UID) | PK, Unique |
| `email` | String | User email address | Unique, Not Null |
| `full_name` | String | User's full name | Not Null |
| `role` | Enum | `COLLECTOR`, `MANAGER`, `BUYER` | Not Null |
| `facility_id` | UUID | Reference to the MRF facility (if Collector/Manager) | FK (MRF.id) |
| `created_at` | Timestamp | When the user was created | Default: Now() |

---

### 2. MRF (Facility)

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| `id` | UUID | Primary Key | PK, Unique |
| `name` | String | Name of the facility | Not Null |
| `location` | Geometry/Point | Geographic location of the facility | |
| `address` | Text | Physical address | |
| `contact_phone` | String | Contact number | |
| `created_at` | Timestamp | When the facility was registered | Default: Now() |

---

### 3. Material

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| `id` | UUID | Primary Key | PK, Unique |
| `name` | String | Name of material (e.g., Aluminum, PET) | Not Null |
| `category` | String | Broad category (e.g., Metal, Plastic) | |
| `current_stock_weight` | Decimal | Current available weight in facility | Not Null, >= 0 |
| `unit` | String | Unit of measure (e.g., kg, ton) | Default: 'kg' |
| `updated_at` | Timestamp | Last update timestamp | |

---

### 4. Inventory Log (Transaction/Movement)
*Records every change to material stock levels (Incoming from collectors or Outgoing for sales).*

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| `id` | UUID | Primary Key | PK, Unique |
| `material_id` | UUID | Reference to the material | FK (Material.id) |
| `facility_id` | UUID | Facility where the change occurred | FK (MRF.id) |
| `user_id` | UUID | User who performed the action | FK (User.id) |
| `change_amount` | Decimal | The amount added or subtracted | Not Null |
| `transaction_type` | Enum | `INCOMING`, `OUTGOING`, `ADJUSTMENT` | Not Null |
| `timestamp` | Timestamp | When the event occurred | Not Null |

---

### 5. Marketplace Listing

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| `id` | UUID | Primary Key | PK, Unique |
| `seller_facility_id` | UUID | Facility selling the material | FK (MRF.id) |
| `material_id` | UUID | The material being sold | FK (Material.id) |
| `quantity` | Decimal | Quantity available for sale | Not Null, > 0 |
| `asking_price` | Decimal | Price per unit | Not Null, > 0 |
| `status` | Enum | `ACTIVE`, `PENDING`, `SOLD`, `EXPIRED` | Default: 'ACTIVE' |
| `created_at` | Timestamp | When listing was created | Default: Now() |

---

### 6. Bid

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| `id` | UUID | Primary Key | PK, Unique |
| `listing_id` | UUID | The listing being bid on | FK (Listing.id) |
| `buyer_id` | UUID | User making the bid | FK (User.id) |
| `bid_amount` | Decimal | The price offered | Not Null, > 0 |
| `status` | Enum | `ACTIVE`, `ACCEPTED`, `REJECTED` | Default: 'ACTIVE' |
| `created_at` | Timestamp | When bid was placed | Default: Now() |

---

### 7. Market Trend (For Analytics)

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| `id` | UUID | Primary Key | PK, Unique |
| `material_id` | UUID | The material being tracked | FK (Material.id) |
| `avg_price` | Decimal | Average market price at this time | Not Null |
| `demand_index` | Decimal | Scaled index of demand (0.0 - 1.0) | |
| `timestamp` | Timestamp | Time period for this data point | Not Null |

## Entity Relationship Diagram (Summary)

- **User** (1) $\leftrightarrow$ (N) **Inventory Log**
- **User** (1) $\leftrightarrow$ (N) **Bid**
- **MRF** (1) $\leftrightarrow$ (N) **User** (Staff/Collectors)
- **MRF** (1) $\leftrightarrow$ (N) **Inventory Log**
- **MRF** (1) $\leftrightarrow$ (N) **Marketplace Listing**
- **Material** (1) $\leftrightarrow$ (N) **Inventory Log**
- **Material** (1) $\leftrightarrow$ (N) **Marketplace Listing**
- **Material** (1) $\leftrightarrow$ (N) **Market Trend**
- **Marketplace Listing** (1) $\leftrightarrow$ (N) **Bid**
