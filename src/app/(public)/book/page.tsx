import { BookingForm } from './booking-form';
import { getScheduleSettings } from '@/actions/schedule_settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BookingPage() {
  const settings = await getScheduleSettings();
  
  return (
    <div className="min-h-screen bg-[#f8fdff] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#00d4ff] font-bold text-xs uppercase tracking-[0.2em] mb-3">Make an Appointment</p>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-indigo-900 mb-4 tracking-tight">Book Your Visit</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Schedule a consultation or treatment easily online. We look forward to giving you a confident smile.
          </p>
        </div>

        <BookingForm 
          minDateStr={settings.global.startDate} 
          maxDateStr={settings.global.endDate} 
          services={settings.availableServices}
        />
      </div>
    </div>
  );
}
