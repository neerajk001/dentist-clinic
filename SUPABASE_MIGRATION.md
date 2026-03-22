# Supabase Migration Guide

This project has been migrated from MongoDB to Supabase (PostgreSQL). Follow these steps to set up your database:

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the database to be provisioned

## Step 2: Run the SQL Schema

1. In your Supabase project dashboard, go to the **SQL Editor**
2. Copy all contents from `supabase-schema.sql`
3. Paste into the SQL Editor
4. Click **Run** to create all tables and indexes

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. In your Supabase project dashboard, go to **Settings > API**

3. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

4. Generate a secure NextAuth secret:
   ```bash
   npx auth secret
   ```
   
   Or generate one manually and add to `.env.local`:
   ```env
   AUTH_SECRET=your-generated-secret
   NEXTAUTH_SECRET=your-generated-secret
   ```

## Step 4: Create Initial Users

You need to create at least one doctor and one receptionist account. Run this SQL in your Supabase SQL Editor:

```sql
-- Create a doctor (password: 'password123' - change this!)
INSERT INTO users (name, email, password, role) VALUES
('Dr. John Smith', 'doctor@clinic.com', '$2a$10$XQ8J3Z5qJZ5XQ8J3Z5qJZ.Y9Q8J3Z5qJZ5XQ8J3Z5qJZ5XQ8J3Z5qJ', 'doctor');

-- Create a receptionist (password: 'password123' - change this!)
INSERT INTO users (name, email, password, role) VALUES
('Jane Doe', 'receptionist@clinic.com', '$2a$10$XQ8J3Z5qJZ5XQ8J3Z5qJZ.Y9Q8J3Z5qJZ5XQ8J3Z5qJZ5XQ8J3Z5qJ', 'receptionist');
```

**Important**: To generate proper bcrypt password hashes, use this Node.js script:

```javascript
const bcrypt = require('bcryptjs');
const password = 'yourPassword';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

Or use an online bcrypt generator with cost factor 10.

## Step 5: Optional - Add Sample Treatments

```sql
INSERT INTO treatments (name, description, price, duration) VALUES
('Dental Cleaning', 'Regular dental cleaning and checkup', 100.00, 30),
('Tooth Extraction', 'Simple tooth extraction procedure', 200.00, 45),
('Root Canal', 'Root canal treatment', 500.00, 90),
('Teeth Whitening', 'Professional teeth whitening', 300.00, 60);
```

## Step 6: Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and login with your created credentials.

## Key Changes from MongoDB

### Database Structure
- **IDs**: Changed from MongoDB ObjectIds to UUIDs
- **Field Names**: Snake_case (PostgreSQL convention) vs camelCase
  - `patient_id` instead of `patient`
  - `created_at` instead of `createdAt`
  - `time_slot` instead of `timeSlot`

### Data Types
- **Enums**: PostgreSQL native ENUMs for roles and statuses
- **Timestamps**: TIMESTAMPTZ for proper timezone handling
- **Foreign Keys**: Explicit foreign key constraints with cascade options

### Queries
- No more Mongoose models - direct Supabase queries
- Relationships loaded via `.select()` with joins
- Filters use PostgreSQL operators

## Troubleshooting

### Connection Issues
- Verify your Supabase URL and anon key are correct
- Check if your IP is allowed in Supabase project settings (if using IP restrictions)

### Authentication Not Working
- Ensure password hashes are properly bcrypted with cost factor 10
- Verify AUTH_SECRET is set in environment variables

### Table Not Found Errors
- Confirm all SQL from `supabase-schema.sql` ran successfully
- Check for any error messages in the SQL Editor

## Optional: Row Level Security (RLS)

The schema includes commented RLS policies. To enable them, uncomment the RLS section in `supabase-schema.sql` and add appropriate policies based on your security requirements.

## Remove MongoDB Dependencies (Optional)

You can now safely remove MongoDB-related packages:

```bash
npm uninstall mongoose @auth/mongodb-adapter
```

Remove unused model files:
```bash
rm -rf src/models
```
