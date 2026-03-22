# MongoDB to Supabase Migration - Changes Summary

## Files Created

### 1. `supabase-schema.sql`
Complete PostgreSQL schema including:
- Table definitions for users, patients, appointments, treatments, treatment_records
- ENUMs for user roles and appointment statuses
- Indexes for query optimization
- Foreign key constraints
- Automatic updated_at triggers
- Optional RLS policies (commented)

### 2. `SUPABASE_MIGRATION.md`
Comprehensive migration guide with:
- Step-by-step setup instructions
- Environment variable configuration
- Sample data insertion queries
- Troubleshooting tips
- Key differences from MongoDB

### 3. `scripts/generate-password-hash.js`
Utility script to generate bcrypt password hashes for creating user accounts

## Files Modified

### 1. `src/lib/db.ts`
- ❌ Removed: Mongoose connection logic
- ✅ Added: Supabase client initialization
- Kept `connectDB()` function for backward compatibility (now a no-op)

### 2. `src/lib/auth.ts`
- ❌ Removed: MongoDB User model import
- ✅ Added: Supabase queries for user authentication
- Updated user lookup to use Supabase `.from('users').select()`
- Changed `user._id.toString()` to `user.id` (UUID)

### 3. `src/actions/receptionist.ts`
Complete rewrite with Supabase:
- ✅ `getAppointmentsByDate()` - Uses Supabase joins with `.select('*, patient:patients(*), doctor:users(*)')`
- ✅ `searchPatients()` - Uses `.or()` with `.ilike` for case-insensitive search
- ✅ `updateAppointmentStatus()` - Direct update with `.update().eq()`
- ✅ `rescheduleAppointment()` - Checks availability and updates
- ✅ `cancelAppointment()` - Sets status to cancelled
- ✅ `createAppointmentManual()` - Upserts patient and creates appointment
- ✅ `getAvailableSlots()` - Filters by time slot availability

**Key Changes:**
- `_id` → `id` (UUIDs)
- `timeSlot` → `time_slot`
- `createdAt` → `created_at`
- Mongoose `.populate()` → Supabase joins
- `$gte`, `$lte` → `.gte()`, `.lte()`
- `findByIdAndUpdate` → `.update().eq('id', ...)`

### 4. `src/actions/doctor.ts`
Complete rewrite with Supabase:
- ✅ `getTodaysAppointments()` - Fetches with joins and filters
- ✅ `getPatientHistory()` - Retrieves treatment records with related data
- ✅ `saveTreatmentNote()` - Upserts treatment records
- ✅ `getTreatmentRecord()` - Gets single treatment record

**Key Changes:**
- Same field name conversions as receptionist.ts
- `.not('status', 'in', '(cancelled,no_show)')` instead of `$nin`
- `follow_up_notes` instead of `followUpNotes`
- Direct foreign key references (patient_id, doctor_id, appointment_id)

### 5. `src/actions/bookings.ts`
Complete rewrite with Supabase:
- ✅ `getAvailableSlots()` - Dynamic 5-minute slot generation with overlap checking
- ✅ `bookAppointment()` - Creates patient and appointment with transaction safety

**Key Changes:**
- Overlap detection using `.lt()` and `.gt()` for time ranges
- Upsert pattern for patient creation/update
- Explicit `end_time` calculation and storage
- Service duration handling

### 6. `.env.example`
- ❌ Removed: `MONGODB_URI`
- ✅ Added: `NEXT_PUBLIC_SUPABASE_URL`
- ✅ Added: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Kept: NextAuth configuration variables

### 7. `README.md`
- ✅ Added: Project description and features
- ✅ Added: Tech stack details
- ✅ Added: Quick start guide
- ✅ Added: Database schema reference
- ✅ Added: User roles documentation

## Database Schema Mapping

| MongoDB Collection | Supabase Table | ID Type | Notes |
|-------------------|----------------|---------|-------|
| users | users | UUID | Added role enum |
| patients | patients | UUID | Same structure |
| appointments | appointments | UUID | Added end_time, snake_case fields |
| treatments | treatments | UUID | Same structure |
| treatmentrecords | treatment_records | UUID | Snake_case fields |

## Field Name Conversions

| MongoDB (camelCase) | Supabase (snake_case) |
|---------------------|----------------------|
| `_id` | `id` |
| `createdAt` | `created_at` |
| `updatedAt` | `updated_at` |
| `timeSlot` | `time_slot` |
| `serviceType` | `service_type` |
| `endTime` | `end_time` |
| `treatmentRecord` | `treatment_record_id` |
| `followUpNotes` | `follow_up_notes` |

## Query Pattern Changes

### MongoDB (Mongoose)
```javascript
await Appointment.find({ date: { $gte: start, $lte: end } })
  .populate('patient')
  .populate('doctor')
  .sort({ date: 1 });
```

### Supabase
```javascript
await supabase
  .from('appointments')
  .select('*, patient:patients(*), doctor:users(*)')
  .gte('date', start.toISOString())
  .lte('date', end.toISOString())
  .order('date', { ascending: true });
```

## Environment Setup Required

1. Create Supabase project at https://supabase.com
2. Run `supabase-schema.sql` in SQL Editor
3. Copy `.env.example` to `.env.local`
4. Add Supabase URL and anon key
5. Generate AUTH_SECRET with `npx auth secret`
6. Create initial users using password hash script
7. Run `npm run dev`

## Testing Checklist

- [ ] User authentication (login/logout)
- [ ] Public booking form
- [ ] Receptionist dashboard
  - [ ] View appointments by date
  - [ ] Search patients
  - [ ] Create manual appointments
  - [ ] Update appointment status
  - [ ] Reschedule appointments
  - [ ] Cancel appointments
- [ ] Doctor dashboard
  - [ ] View today's appointments
  - [ ] View patient history
  - [ ] Create treatment records
  - [ ] Update treatment records

## Optional Cleanup

Completed:

- MongoDB packages removed (`mongoose`, `@auth/mongodb-adapter`)
- Old model files removed (`src/models/`)
- `npm run test` runs `next build` to verify the project builds

## Optional: Enable RLS

To enable Row Level Security in Supabase, run `supabase-rls.sql` in the SQL Editor after the main schema. See that file for permissive policies; tighten them for production.

## Support

For issues or questions:
- Check `SUPABASE_MIGRATION.md` for detailed setup instructions
- Review Supabase logs in the project dashboard
- Verify environment variables are set correctly
- Check browser console for client-side errors
