-- ==============================================
-- Dentist Clinic Management System - Database Schema
-- Database: PostgreSQL (Supabase)
-- ==============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- ENUMS
-- ==============================================

-- User role enum
CREATE TYPE user_role AS ENUM ('doctor', 'receptionist');

-- Appointment status enum
CREATE TYPE appointment_status AS ENUM (
  'scheduled',
  'confirmed',
  'waiting',
  'in_treatment',
  'completed',
  'no_show',
  'cancelled'
);

-- ==============================================
-- TABLES
-- ==============================================

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patients Table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Treatments Table
CREATE TABLE treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  duration INTEGER NOT NULL CHECK (duration >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  end_time TIMESTAMPTZ NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  complaint TEXT DEFAULT '',
  status appointment_status NOT NULL DEFAULT 'scheduled',
  notes TEXT DEFAULT '',
  treatment_record_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Treatment Records Table
CREATE TABLE treatment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  diagnosis TEXT NOT NULL,
  prescription TEXT DEFAULT '',
  follow_up_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key for treatment_record_id in appointments
ALTER TABLE appointments
ADD CONSTRAINT fk_appointments_treatment_record
FOREIGN KEY (treatment_record_id) REFERENCES treatment_records(id) ON DELETE SET NULL;

-- ==============================================
-- INDEXES
-- ==============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Patients indexes
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_phone ON patients(phone);

-- Appointments indexes
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_end_time ON appointments(end_time);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date_doctor ON appointments(date, doctor_id);

-- Treatment Records indexes
CREATE INDEX idx_treatment_records_patient_created ON treatment_records(patient_id, created_at DESC);
CREATE INDEX idx_treatment_records_appointment ON treatment_records(appointment_id);
CREATE INDEX idx_treatment_records_doctor ON treatment_records(doctor_id);

-- ==============================================
-- TRIGGERS FOR UPDATED_AT
-- ==============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatments_updated_at
  BEFORE UPDATE ON treatments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_records_updated_at
  BEFORE UPDATE ON treatment_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- ==============================================
-- Uncomment these if you want to enable RLS for Supabase
-- You'll need to configure policies based on your auth setup

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE treatment_records ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- SAMPLE DATA (Optional - for testing)
-- ==============================================

-- Insert sample doctor
-- INSERT INTO users (name, email, password, role) VALUES
-- ('Dr. John Smith', 'doctor@clinic.com', '$2a$10$...hashedpassword...', 'doctor');

-- Insert sample receptionist
-- INSERT INTO users (name, email, password, role) VALUES
-- ('Jane Doe', 'receptionist@clinic.com', '$2a$10$...hashedpassword...', 'receptionist');

-- Insert sample treatments
-- INSERT INTO treatments (name, description, price, duration) VALUES
-- ('Dental Cleaning', 'Regular dental cleaning and checkup', 100.00, 30),
-- ('Tooth Extraction', 'Simple tooth extraction procedure', 200.00, 45),
-- ('Root Canal', 'Root canal treatment', 500.00, 90),
-- ('Teeth Whitening', 'Professional teeth whitening', 300.00, 60);
