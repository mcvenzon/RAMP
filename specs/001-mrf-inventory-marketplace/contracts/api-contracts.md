# API Contracts: MRF Inventory & Marketplace

**Feature**: `001-mrf-inventory-marketplace`
**Status**: Draft
**Created**: 2026-07-09

## 1. Inventory API (Collector/Manager)

**Base URL**: `/api/v1/inventory`

### POST /log-material
Logs a new material entry (Incoming/Outgoing/Adjustment).

**Request Body**:
```json
{
  "material_id": "uuid",
  "change_amount": 50.5,
  "transaction_type": "INCOMING",
  "facility_id": "uuid"
}
```

**Response (201 Created)**:
```json
{
  "id": "uuid",
  "timestamp": "2026-07-09T10:00:00Z",
  "current_facility_balance": 150.5
}
```

### GET /balance/:material_id
Retrieves current stock for a specific material at the facility.

**Response (200 OK)**:
```json
{
  "material_id": "uuid",
  "current_stock_weight": 150.5,
  "unit": "kg"
}
```

---

## 2. Marketplace API (Manager/Buyer)

**Base URL**: `/api/v1/marketplace`

### GET /listings
Retrieves all active marketplace listings. Supports filtering by material.

**Query Params**:
- `material_id` (optional)
- `status` (optional, default: `ACTIVE`)

**Response (200 OK)**:
```json
[
  {
    "id": "uuid",
    "material_name": "Aluminum",
    "quantity": 100,
    "unit": "kg",
    "asking_price": 15.50,
    "seller_facility": "City MRF",
    "status": "ACTIVE"
  }
]
```

### POST /listings
Creates a new marketplace listing.

**Request Body**:
```json
{
  "material_id": "uuid",
  "quantity": 100,
  "asking_price": 15.50
}
```

### POST /listings/{id}/bids
Places a bid on a listing.

**Request Body**:
```json
{
  "bid_amount": 16.00
}
```

**Response (201 Created)**:
```json
{
  "bid_id": "uuid",
  "status": "ACTIVE"
}
```

---

## 3. Analytics API (Owner)

**Base URL**: `/api/v1/analytics`

### GET /predict/{material_id}
Retrieves predicted price and demand trends for the next 30 days.

**Response (200 OK)**:
```json
{
  "material_id": "uuid",
  "predictions": [
    { "date": "2026-07-10", "predicted_price": 16.20, "demand_index": 0.65 },
    { "date": "2026-07-11", "predicted_price": 16.45, "demand_index": 0.68 }
  ]
}
```
