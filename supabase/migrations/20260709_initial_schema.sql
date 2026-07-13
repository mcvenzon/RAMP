-- 1. Create MRF Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Materials Table
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    current_stock_weight DECIMAL(12, 2) NOT NULL DEFAULT 0,
    unit TEXT DEFAULT 'kg',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Users Table (Metadata)
-- Assuming Supabase Auth is already handling the 'auth.users' table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('COLLECTOR', 'MANAGER', 'BUYER')) NOT NULL,
    facility_id UUID REFERENCES facilities(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Inventory Logs Table
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES materials(id),
    facility_id UUID NOT NULL REFERENCES facilities(id),
    user_id UUID NOT NULL REFERENCES profiles(id),
    change_amount DECIMAL(12, 2) NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('INCOMING', 'OUTGOING', 'ADJUSTMENT')) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Marketplace Listings Table
CREATE TABLE IF NOT EXISTS marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_facility_id UUID NOT NULL REFERENCES facilities(id),
    material_id UUID NOT NULL REFERENCES materials(id),
    quantity DECIMAL(12, 2) NOT NULL CHECK (quantity > 0),
    asking_price DECIMAL(12, 2) NOT NULL CHECK (asking_price > 0),
    status TEXT CHECK (status IN ('ACTIVE', 'PENDING', 'SOLD', 'EXPIRED')) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create Bids Table
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id),
    buyer_id UUID NOT NULL REFERENCES profiles(id),
    bid_amount DECIMAL(12, 2) NOT NULL CHECK (bid_amount > 0),
    status TEXT CHECK (status IN ('ACTIVE', 'ACCEPTED', 'REJECTED')) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create Market Trend Table
CREATE TABLE IF NOT EXISTS market_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES materials(id),
    avg_price DECIMAL(12, 2) NOT NULL,
    demand_index DECIMAL(5, 2) CHECK (demand_index >= 0 AND demand_index <= 1.0),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 8. Triggers for Material Stock Updates
CREATE OR REPLACE FUNCTION update_material_stock_on_log()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.transaction_type = 'INCOMING') THEN
            UPDATE materials 
            SET current_stock_weight = current_stock_weight + NEW.change_amount,
                updated_at = NOW()
            WHERE id = NEW.material_id;
        ELSIF (NEW.transaction_type = 'OUTGOING') THEN
            UPDATE materials 
            SET current_stock_weight = current_stock_weight - NEW.change_amount,
                updated_at = NOW()
            WHERE id = NEW.material_id;
        ELSIF (NEW.transaction_type = 'ADJUSTMENT') THEN
            UPDATE materials 
            SET current_stock_weight = NEW.change_amount,
                updated_at = NOW()
            WHERE id = NEW.material_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_material_stock
AFTER INSERT ON inventory_logs
FOR EACH ROW
EXECUTE FUNCTION update_material_stock_on_log();

-- 9. RLS Policies (Basic)
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_trends ENABLE ROW LEVEL SECURITY;

-- Simple policy: Allow authenticated users to read everything for now
CREATE POLICY "Allow authenticated read all" ON facilities FOR SELECT USING (auth.role() IS NOT NULL);
CREATE POLICY "Allow authenticated read all" ON materials FOR SELECT USING (auth.role() IS NOT NULL);
CREATE POLICY "Allow authenticated read all" ON profiles FOR SELECT USING (auth.role() IS NOT NULL);
CREATE POLICY "Allow authenticated read all" ON inventory_logs FOR SELECT USING (auth.role() IS NOT NULL);
CREATE POLICY "Allow authenticated read all" ON marketplace_listings FOR SELECT USING (auth.role() IS NOT NULL);
CREATE POLICY "Allow authenticated read all" ON bids FOR SELECT USING (auth.role() IS NOT NULL);
CREATE POLICY "Allow authenticated read all" ON market_trends FOR SELECT USING (auth.role() IS NOT NULL);
