import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getTreatments } from '@/actions/treatments';
import { ShieldCheck, Clock, IndianRupee, ArrowRight } from 'lucide-react';

export default async function ServicesPage() {
  const treatments = await getTreatments();

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {/* Navigation */}
      <nav className="border-b border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                D
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                Dental<span className="text-orange-600">Care</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/#services" className="text-sm font-medium text-zinc-500 hover:text-orange-600 transition-colors">
                Home
              </Link>
              <Link href="/book">
                <Button className="bg-orange-600 text-white hover:bg-orange-700 rounded-full px-6">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-3 block">What We Offer</span>
          <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6">
            Our <span className="text-orange-600">Services</span>
          </h1>
          <p className="text-zinc-500 text-lg leading-relaxed">
            From routine check-ups to specialized procedures, we provide a full range of dental treatments tailored to your needs.
          </p>
        </div>

        {treatments.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'General Dentistry', description: 'Regular check-ups, cleanings, and preventive care to keep your smile healthy.', duration: 30, price: 0 },
              { name: 'Cosmetic Procedures', description: 'Whitening, veneers, and bonding to give you the smile you deserve.', duration: 60, price: 0 },
              { name: 'Orthodontics', description: 'Straighten your teeth with modern aligners and traditional braces.', duration: 90, price: 0 },
            ].map((service, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 mb-3">{service.name}</h2>
                <p className="text-zinc-500 leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {service.duration} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {treatments.map((t) => (
              <div
                key={t.id}
                className="p-8 rounded-3xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 mb-3">{t.name}</h2>
                <p className="text-zinc-500 leading-relaxed mb-4">{t.description || 'Professional dental care.'}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-zinc-500">
                    <Clock className="w-4 h-4" /> {t.duration} min
                  </span>
                  {t.price > 0 && (
                    <span className="flex items-center gap-1 font-semibold text-zinc-900">
                      <IndianRupee className="w-4 h-4" /> {t.price.toFixed(0)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/book">
            <Button className="bg-orange-600 text-white hover:bg-orange-700 rounded-full px-8 inline-flex items-center gap-2">
              Book an Appointment <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer strip */}
      <footer className="border-t border-zinc-100 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-zinc-500 text-sm">
          <Link href="/" className="hover:text-orange-600 transition-colors">Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
