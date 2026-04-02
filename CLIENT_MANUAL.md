# Dental Clinic Management System - User Guide

Welcome to your new Dental Clinic Management System! This platform is designed to streamline your clinic's daily workflow, from patients booking their initial consults online, to receptionists managing the front desk, all the way to doctors filling out treatment records.

This simple guide will walk you through the core features of your software.

---

## 1. The Patient Experience (Public Website)
Your main website is designed to seamlessly convert visitors into booked patients with minimal friction.

### The "Consultation-First" Approach
We removed complex service-selection screens so patients don't have to self-diagnose what treatment they need (which often leads to confusion or wrong bookings). 
Instead, **all online bookings are scheduled as 30-minute "Consultation" blocks.** 
The doctor will perform the diagnosis during the appointment and decide the exact treatment needed.

### Booking Methods
*   **Book Appointment Button:** Patients can select a date, pick an available 30-minute time slot from the calendar, and fill out their basic contact details. The system strictly checks availability to ensure double-bookings are impossible.
*   **Call to Book:** Mobile visitors can tap the "Call to Book" button at the top of the screen to route a phone call directly to your clinic's front desk.

---

## 2. The Receptionist Dashboard
The Receptionist acts as the administrative heartbeat of the system. 

### Roles & Credentials
*   **Access:** Log in using your designated receptionist credentials.
*   **Navigation:** You'll spend most of your time in the **Appointments** and **Schedule Settings** tabs.

### Core Features
*   **Schedule Settings:** This is where you configure the clinic's operating hours. 
    *   Set working shifts (e.g., Morning Shift: 09:00 - 13:00). 
    *   The system automatically slices these shifts into clean **30-minute booking grids** for the public website based on your configurations here.
    *   You can set specific blocked dates (like holidays) or block specific time slots if a doctor is briefly unavailable.
*   **Manual Walk-in Bookings:** If a patient calls or walks in, the receptionist can manually book an appointment straight onto the calendar without requiring an email address.
*   **Changing Statuses:** Receptionists can view incoming appointments and mark them as `confirmed`, `completed`, or `cancelled` as patients arrive and leave.

---

## 3. The Doctor Dashboard
The Doctor interface is minimalist and focused entirely on patient care rather than administrative noise.

### Roles & Credentials
*   **Access:** Log in using the doctor's credentials (e.g., your admin fallback for testing is `doctor@example.com`).

### Core Features
*   **Daily Appointment View:** 
    *   Doctors have a clean, focused view of the day's schedule. 
    *   They can select an appointment from their queue on the left to see the patient’s details constraint, phone number, and reported complaints.
*   **Treatment Records:** 
    *   Once a consultation begins, the doctor conducts the diagnosis. 
    *   Inside the appointment view, the doctor can add private medical notes, prescriptions, and officially log what treatment was performed (e.g., switching the basic *Consultation* into an *Extraction* or *Root Canal* within the medical record).
    *   *Note: These records are securely tied to the appointment ID for future patient history tracking.*

---

## How Long Are Appointments?
*   **Universally 30 Minutes:** To keep the calendar perfectly aligned and avoid awkward "10-minute gaps", all appointments (whether booked by the public or the receptionist) are locked into 30-minute blocks.

---

## Need Help?
If you need any modifications to working hours, holiday blackouts, or if you encounter any issues, simply refer to your **Schedule Settings** in the dashboard to modify your clinic's rules on the fly!
