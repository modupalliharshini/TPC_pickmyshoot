import pg from 'pg';

const connectionString = "postgresql://postgres:Hpickmyshoot@230788@db.xvvxdkrgazqqawuhttzw.supabase.co:5432/postgres";

async function addPolicy() {
    const client = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected to Supabase Postgres.");

        console.log("Adding UPDATE and DELETE RLS policies for photographers...");
        await client.query(`
            DROP POLICY IF EXISTS "Allow public update access to photographers" ON photographers;
            CREATE POLICY "Allow public update access to photographers" 
            ON photographers FOR UPDATE 
            USING (true);
        `);
        console.log("✅ Successfully created UPDATE RLS policy for photographers table!");
    } catch (err) {
        console.error("❌ Failed to add policy:", err);
    } finally {
        await client.end();
    }
}

addPolicy();
