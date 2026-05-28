import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const supabaseUrl = "https://xvvxdkrgazqqawuhttzw.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dnhka3JnYXpxcWF3dWh0dHp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTkzNzQ3NywiZXhwIjoyMDk1NTEzNDc3fQ.6ediXP_YugHY4CXezUFprnDcQeU_oZkxpR0iSlzy7lo";
const connectionString = "postgresql://postgres:Hpickmyshoot@230788@db.xvvxdkrgazqqawuhttzw.supabase.co:5432/postgres";

async function seedSupabaseAuth() {
  console.log("🚀 Starting Supabase Auth Seeding Script...");

  // 1. Remove password column from profiles table for maximum security
  const pgClient = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await pgClient.connect();
    console.log("✅ Connected to Postgres database. Altering profiles schema...");
    await pgClient.query(`
      ALTER TABLE profiles DROP COLUMN IF EXISTS password;
      DELETE FROM profiles WHERE email IN ('customer@pickmyshoot.com', 'photographer@pickmyshoot.com');
    `);
    console.log("✅ Schema altered and seed conflicts cleared successfully.");
  } catch (err) {
    console.error("⚠️ Failed to drop password column (it might already be removed):", err.message);
  } finally {
    await pgClient.end();
  }

  // 2. Initialize Supabase Admin Client
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const seedUsers = [
    {
      email: 'customer@pickmyshoot.com',
      password: 'password123',
      name: 'Customer User',
      role: 'user'
    },
    {
      email: 'photographer@pickmyshoot.com',
      password: 'password123',
      name: 'The Wedding Story',
      role: 'photographer'
    }
  ];

  try {
    // List existing users to avoid conflicts
    console.log("🔍 Fetching existing Auth users...");
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    for (const u of seedUsers) {
      const existingUser = users.find(user => user.email === u.email);
      let userId = '';

      if (existingUser) {
        console.log(`👤 User ${u.email} already exists in Supabase Auth. Updating credentials...`);
        const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          {
            password: u.password,
            user_metadata: { name: u.name, role: u.role },
            email_confirm: true
          }
        );
        if (updateError) throw updateError;
        userId = data.user.id;
        console.log(`   - Updated ${u.email}`);
      } else {
        console.log(`🌱 Creating new pre-confirmed user: ${u.email}...`);
        const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: { name: u.name, role: u.role }
        });
        if (createError) throw createError;
        userId = data.user.id;
        console.log(`   - Created ${u.email}`);
      }

      // 3. Sync profile to public database profiles table
      console.log(`🔗 Syncing public profile row for ${u.email} (ID: ${userId})...`);
      const { error: syncError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          email: u.email,
          role: u.role,
          name: u.name
        });

      if (syncError) throw syncError;
      console.log(`   - Synced successfully.`);
    }

    console.log("🎉 Supabase Auth seeding and synchronization finished successfully!");
  } catch (err) {
    console.error("❌ Seeding failed with error:", err);
  }
}

seedSupabaseAuth();
