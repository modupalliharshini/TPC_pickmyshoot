import pg from 'pg';

const connectionString = "postgresql://postgres:Hpickmyshoot@230788@db.xvvxdkrgazqqawuhttzw.supabase.co:5432/postgres";

async function addProfilesSchema() {
    const client = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected to Supabase Postgres.");

        console.log("Creating profiles table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS profiles (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('user', 'photographer')),
                name TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log("✅ Profiles table created.");

        console.log("Enabling Row Level Security (RLS) on profiles...");
        await client.query(`
            ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
            
            DROP POLICY IF EXISTS "Allow public select profiles" ON profiles;
            CREATE POLICY "Allow public select profiles" ON profiles FOR SELECT USING (true);
            
            DROP POLICY IF EXISTS "Allow public insert profiles" ON profiles;
            CREATE POLICY "Allow public insert profiles" ON profiles FOR INSERT WITH CHECK (true);
            
            DROP POLICY IF EXISTS "Allow public update profiles" ON profiles;
            CREATE POLICY "Allow public update profiles" ON profiles FOR UPDATE USING (true);
        `);
        console.log("✅ RLS policies applied to profiles table.");

        console.log("Seeding default user accounts...");
        
        // Seed default Customer
        await client.query(`
            INSERT INTO profiles (email, password, role, name)
            VALUES ('customer@pickmyshoot.com', 'password123', 'user', 'Customer User')
            ON CONFLICT (email) DO NOTHING;
        `);
        
        // Seed default Photographer
        await client.query(`
            INSERT INTO profiles (email, password, role, name)
            VALUES ('photographer@pickmyshoot.com', 'password123', 'photographer', 'The Wedding Story')
            ON CONFLICT (email) DO NOTHING;
        `);
        
        console.log("✅ Seed accounts created successfully!");
    } catch (err) {
        console.error("❌ Failed to set up profiles schema:", err);
    } finally {
        await client.end();
    }
}

addProfilesSchema();
