const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

// Only load .env file if we are not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, '.env') });
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL ERROR: Supabase URL or Key is missing in environment variables.');
    console.error('Please ensure environment contains SUPABASE_URL and SUPABASE_ANON_KEY');
} else {
    console.log('Supabase client initialized.');
    console.log('URL:', supabaseUrl.substring(0, 15) + '...');
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
