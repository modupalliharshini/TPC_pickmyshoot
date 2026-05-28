import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PHOTOGRAPHERS } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Direct Connection String
const connectionString = "postgresql://postgres:Hpickmyshoot@230788@db.xvvxdkrgazqqawuhttzw.supabase.co:5432/postgres";

async function runMigration() {
    console.log("🚀 Starting Supabase Postgres Seeding Migration...");
    
    const client = new pg.Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false // Required for Supabase SSL connections
        }
    });

    try {
        await client.connect();
        console.log("✅ Successfully connected to Supabase Postgres.");

        // Read schema file
        const schemaPath = path.join(__dirname, '../../supabase_schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log("⚙️  Running schema initialization...");
        await client.query(schemaSql);
        console.log("✅ Tables and RLS policies created successfully.");

        console.log(`🌱 Seeding ${PHOTOGRAPHERS.length} photographers...`);
        for (const p of PHOTOGRAPHERS) {
            const query = `
                INSERT INTO photographers (
                    id, name, rating, reviews, experience, price, location, city, 
                    categories, image, gallery, avatar_color, avatar_text, verified, 
                    best_seller, is_studio, booked_dates, about, bullets, packages, 
                    languages, travel_outside_city, age, charge_per_hour
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24);
            `;

            const values = [
                p.id,
                p.name,
                p.rating,
                p.reviews,
                p.experience,
                p.price,
                p.location,
                p.city,
                p.categories || [],
                p.image || null,
                p.gallery || [],
                p.avatarColor || '#000000',
                p.avatarText || null,
                p.verified || false,
                p.bestSeller || false,
                p.isStudio || false,
                p.bookedDates || [],
                p.about || '',
                p.bullets || [],
                JSON.stringify(p.packages || {}),
                p.languages || [],
                p.travelOutsideCity || false,
                p.age || null,
                p.chargePerHour || null
            ];

            await client.query(query, values);
            console.log(`   - Seeded photographer: ${p.name}`);
        }

        console.log("🎉 Database seeding migration finished successfully!");
    } catch (err) {
        console.error("❌ Migration failed with error:", err);
    } finally {
        await client.end();
    }
}

runMigration();
