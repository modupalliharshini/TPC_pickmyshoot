-- Schema for PickMyShoot Supabase Database

-- Drop existing tables if they exist to allow clean migrations
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS photographers;

-- Create Photographers Table
CREATE TABLE photographers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    experience INTEGER DEFAULT 0,
    price INTEGER DEFAULT 0,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    categories TEXT[] NOT NULL,
    image TEXT,
    gallery TEXT[] NOT NULL,
    avatar_color TEXT DEFAULT '#000000',
    avatar_text TEXT,
    verified BOOLEAN DEFAULT FALSE,
    best_seller BOOLEAN DEFAULT FALSE,
    is_studio BOOLEAN DEFAULT FALSE,
    booked_dates DATE[] DEFAULT '{}',
    about TEXT,
    bullets TEXT[] DEFAULT '{}',
    packages JSONB NOT NULL,
    languages TEXT[] DEFAULT '{}',
    travel_outside_city BOOLEAN DEFAULT FALSE,
    age INTEGER,
    charge_per_hour INTEGER
);

-- Create Leads Table (Customer inquiries)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photographer_id TEXT REFERENCES photographers(id) ON DELETE CASCADE,
    photographer_name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_type TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Set up RLS Policies for Photographers (Public Read)
CREATE POLICY "Allow public read access to photographers" 
ON photographers FOR SELECT 
USING (true);

-- Set up RLS Policies for Leads (Public Read, Write, Delete for Simulation)
CREATE POLICY "Allow public select access to leads" 
ON leads FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to leads" 
ON leads FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public delete access to leads" 
ON leads FOR DELETE 
USING (true);
