import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vzlfvgwgsyhqyqkllvmd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6bGZ2Z3dnc3locXlxa2xsdm1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNTI2NzYsImV4cCI6MjA4NjgyODY3Nn0.G55APT5H27P8czw4EdgeXRrrMP7yX1R1BrHaajeJrVU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
    // Check existing doctors
    const { data: existingDoctors, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'doctor');

    console.log('Existing doctors:', existingDoctors, checkError);

    if (existingDoctors && existingDoctors.length > 0) {
        console.log('✅ Doctor(s) already exist. No seed needed.');
        return;
    }

    // Insert a doctor (password is a bcrypt hash of "Doctor@123")
    const { data, error } = await supabase
        .from('users')
        .insert({
            name: 'Dr. Mordant',
            email: 'doctor@mordantdental.com',
            password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lFDW', // Doctor@123
            role: 'doctor',
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Failed to create doctor:', error.message);
        console.log('\nThis might be a permissions issue. Please run this SQL in your Supabase SQL Editor:');
        console.log(`
INSERT INTO users (name, email, password, role)
VALUES (
  'Dr. Mordant',
  'doctor@mordantdental.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lFDW',
  'doctor'
);
    `);
    } else {
        console.log('✅ Doctor created successfully:', data);
    }
}

main();
