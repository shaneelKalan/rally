const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Checking configuration...');
console.log(`URL configured: ${!!supabaseUrl}`);
console.log(`Key configured: ${!!supabaseKey}`);

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-url')) {
    console.error('\n❌ Configuration missing or using placeholders.');
    console.error('Please update .env.local with your actual Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('\nTesting connection to Supabase...');

    try {
        // Try to select from the events table - straightforward check
        // We expect this to either return data, an empty array, or a permission error
        // Any network error means the connection failed
        const { data, error } = await supabase.from('events').select('count', { count: 'exact', head: true });

        if (error) {
            // If we get a permission denied error, that actually means we CONNECTED successfully
            // but RLS is working. If we get a network error, that's a connection failure.
            if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
                console.error('❌ Connection successful, but Auth failed (expired or invalid key).');
                console.error('Error details:', error.message);
            } else if (error.code) {
                console.log('✅ Connection Successful!');
                console.log('Note: Received a database error, which means we reached the server:');
                console.log(`Code: ${error.code} - ${error.message}`);
            } else {
                throw error;
            }
        } else {
            console.log('✅ Connection Successful!');
            console.log('Successfully queried the "events" table.');
        }

    } catch (err) {
        console.error('\n❌ Connection Failed.');
        console.error('Could not reach Supabase. Please check your URL and Key.');
        console.error('Error details:', err.message || err);
        if (err.cause) console.error('Cause:', err.cause);
    }
}

testConnection();
