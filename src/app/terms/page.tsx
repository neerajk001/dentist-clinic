import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      <nav className="border-b border-zinc-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-zinc-900">
            Dental<span className="text-orange-600">Care</span>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-full">Back to Home</Button>
          </Link>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-6">Terms of Service</h1>
        <p className="text-zinc-500 text-sm mb-8">Last updated: March 2025</p>
        <div className="prose prose-zinc max-w-none space-y-4 text-zinc-600">
          <p>
            By using the DentalCare website and booking services, you agree to these terms. Please read them carefully.
          </p>
          <h2 className="text-xl font-semibold text-zinc-900 mt-8">Use of Service</h2>
          <p>
            Our website allows you to book dental appointments and view information about our services. You agree to provide accurate information when booking and to arrive on time for scheduled appointments. Cancellations should be made with reasonable notice as per our clinic policy.
          </p>
          <h2 className="text-xl font-semibold text-zinc-900 mt-8">Medical Disclaimer</h2>
          <p>
            Content on this site is for general information only and does not replace professional medical advice. Always consult a qualified dentist or doctor for diagnosis and treatment.
          </p>
          <h2 className="text-xl font-semibold text-zinc-900 mt-8">Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms.
          </p>
          <h2 className="text-xl font-semibold text-zinc-900 mt-8">Contact</h2>
          <p>
            For questions about these terms, please contact us using the details on our website.
          </p>
        </div>
        <div className="mt-12">
          <Link href="/" className="text-orange-600 font-medium hover:underline">← Back to Home</Link>
        </div>
      </main>
    </div>
  );
}
