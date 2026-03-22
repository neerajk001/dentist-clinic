import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-zinc-900 mb-6">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-8">Last updated: March 2025</p>
        <div className="prose prose-zinc max-w-none space-y-4 text-zinc-600">
          <p>
            DentalCare (&quot;we&quot;, &quot;our&quot;) is committed to protecting your privacy. This policy describes how we collect, use, and safeguard your personal and health information when you use our website and services.
          </p>
          <h2 className="text-xl font-semibold text-zinc-900 mt-8">Information We Collect</h2>
          <p>
            We collect information you provide when booking appointments (name, phone, email) and information that your healthcare providers record during visits (treatment notes, diagnoses). We do not sell your information to third parties.
          </p>
          <h2 className="text-xl font-semibold text-zinc-900 mt-8">How We Use Your Information</h2>
          <p>
            Your information is used to schedule and manage appointments, maintain treatment records, and communicate with you about your care. We use industry-standard security measures to protect your data.
          </p>
          <h2 className="text-xl font-semibold text-zinc-900 mt-8">Contact</h2>
          <p>
            For privacy-related questions, please contact us at the address or phone number listed on our website.
          </p>
        </div>
        <div className="mt-12">
          <Link href="/" className="text-orange-600 font-medium hover:underline">← Back to Home</Link>
        </div>
      </main>
    </div>
  );
}
