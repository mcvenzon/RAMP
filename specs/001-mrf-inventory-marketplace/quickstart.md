# Supabase Configuration Guide

This file describes the manual steps required to set up the Supabase project for the MRF Inventory & Marketplace feature.

## 1. Project Setup

1.  **Create a New Project**: Go to the [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2.  **Note Credentials**: Copy your `Project URL` and `API Key` (service_role key is recommended for backend/migration scripts).

## 2. Local Environment Configuration

Create a `.env` file in the `backend/` directory with the following:

```env
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 3. Database Schema Migration

Run the following command to apply the initial schema to your Supabase project:

```bash
# Using Supabase CLI (if installed)
supabase migration up --local
```

Alternatively, you can copy the contents of `supabase/migrations/20260709_initial_schema.sql` and execute it in the **SQL Editor** on the Supabase Dashboard.

## 4. Authentication & User Roles

1.  **Enable Auth**: Supabase Auth is enabled by default.
2.  **User Metadata**: The `profiles` table is linked to `auth.users`. When a user signs up, you may need a trigger to automatically create a `profile` entry.
3.  **Roles**: The `role` column in the `profiles` table uses the following values: `COLLECTOR`, `MANAGER`, `BUYER`.

## 5. Realtime Configuration

1.  Go to **Database** $\rightarrow$ **Replication**.
2.  Enable **Realtime** for the following tables:
    - `inventory_logs`
    - `bids`

## 6. Storage (Optional)

If images are required for marketplace listings, create a bucket named `marketplace-images`.
