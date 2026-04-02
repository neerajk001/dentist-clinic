'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Menu,
  X,
  MapPin,
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  Phone
} from 'lucide-react';
import Image from 'next/image';

const PRIMARY_COLOR = 'bg-[#18181b]';
const TEXT_ACCENT = 'text-[#2bb2cc]';

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState('Dental Fillings');

  const servicesList = [
    { title: 'Dental Fillings', description: 'Restore your smile and protect your teeth with our expert dental filling services. With over 15 years of experience, our clinic is dedicated to providing top-notch dental care in a comfortable and stress-free environment. Trust us to make your dental health a priority while ensuring every visit leaves you smiling with confidence.' },
    { title: 'Oral Surgery', description: 'Expert oral surgical procedures performed with care.' },
    { title: 'Dental implants', description: 'Permanent solutions for missing teeth to restore your confidence.' },
    { title: 'Teeth whitening', description: 'Professional teeth whitening for a brighter, natural smile.' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#18181b] font-sans selection:bg-[#2bb2cc] selection:text-white">
      {/* Navbar */}
      <nav className="w-full bg-white z-50 h-[56px] flex items-center mb-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.68629 2 6 4.68629 6 8C6 10.8284 7.5 13.9 10 16.5C10.5 17 10.8 17.8 10.8 18.5V19.5C10.8 20.9 11.2 22 12 22C12.8 22 13.2 20.9 13.2 19.5V18.5C13.2 17.8 13.5 17 14 16.5C16.5 13.9 18 10.8284 18 8C18 4.68629 15.3137 2 12 2Z" stroke="#2bb2cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2L12 8" stroke="#2bb2cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="flex items-center">
                <span className={`font-semibold text-[1.05rem] tracking-tight leading-none ${TEXT_ACCENT}`}>dental</span>
                <span className="font-semibold text-[1.05rem] tracking-tight leading-none text-[#18181b]">health</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['Service', 'About', 'Blog', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className={`text-[12px] font-medium transition-colors hover:text-[#2bb2cc] text-[#18181b]`}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Book by Calling Button */}
            <div className="block">
              <a href="tel:+1234567890">
                <Button variant="outline" className="rounded-full px-5 py-2 h-auto text-[12px] font-semibold border-gray-200 hover:bg-gray-50 text-[#18181b] flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  Call to Book
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>



      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-16 lg:mb-20 lg:pt-2">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-8 items-stretch lg:h-[calc(100vh-80px)] lg:min-h-[400px] lg:max-h-[480px] xl:max-h-[580px]">
          {/* Left Hero Content */}
          <div className="flex flex-col justify-between h-full">
            <div className="max-w-xl mb-6 lg:mb-0">
              <h1 className="text-[2.2rem] sm:text-5xl lg:text-[2.8rem] xl:text-[4rem] font-extrabold leading-[1.05] mb-2 xl:mb-3 tracking-tight text-[#18181b]">
                Your <span className={TEXT_ACCENT}>Smile</span><br />
                Matters to us
              </h1>
              <p className="text-gray-500 text-[12px] xl:text-[13px] leading-relaxed max-w-[380px]">
                Specially designed for patients seeking dentistry abroad, we offer you bespoke expertise at a price that is unbelievably.
              </p>
            </div>

            {/* Middle 2 Images on Left Side */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-10">
              {/* Dental Tools Image with Badge */}
              <div className="relative h-[160px] sm:h-[220px] lg:h-[110px] xl:h-[150px] rounded-[16px] xl:rounded-[24px] overflow-hidden bg-gray-100">
                <Image
                  src="/hero_tools.png"
                  alt="Dentist Tools"
                  fill
                  className="object-cover"
                />
                {/* 15K+ Happy Customers Badge */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-3 sm:left-3 sm:right-3 bg-white/95 backdrop-blur-sm rounded-[12px] xl:rounded-[18px] p-2 shadow-lg flex items-center justify-between border border-gray-100/50">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-white overflow-hidden bg-gray-200">
                        <Image src={`https://i.pravatar.cc/150?img=${i+10}`} alt={`Customer ${i}`} width={20} height={20} className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col pr-0.5 text-right">
                    <span className="text-[#18181b] font-bold text-[8px] sm:text-[9px] leading-tight flex flex-col xl:flex-row gap-0 xl:gap-1">
                      <span>15k+</span> <span>Happy</span>
                    </span>
                    <span className="text-gray-500 font-medium text-[7px] sm:text-[8px] leading-tight">customers</span>
                  </div>
                </div>
              </div>

              {/* Smiling Patient Image */}
              <div className="relative h-[160px] sm:h-[220px] lg:h-[110px] xl:h-[150px] rounded-[16px] xl:rounded-[24px] overflow-hidden bg-gray-100">
                <Image
                  src="/hero_patient.png"
                  alt="Happy Patient"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4">
              <Button onClick={() => router.push('/book')} className={`${PRIMARY_COLOR} hover:bg-black text-white rounded-[24px] px-6 py-3 lg:py-4 xl:py-5 h-auto text-[12px] lg:text-[13px] font-medium`}>
                Book Appointment
              </Button>
              <a href="tel:+1234567890">
                <Button variant="outline" className="w-full sm:w-auto border-gray-200 rounded-[24px] px-6 py-3 lg:py-4 xl:py-5 h-auto text-[12px] lg:text-[13px] font-medium flex items-center justify-center gap-2 text-[#18181b] hover:bg-gray-50">
                  <Phone className="w-4 h-4" />
                  Call to Book
                </Button>
              </a>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="relative h-[350px] sm:h-[450px] lg:h-full w-full rounded-[20px] xl:rounded-[28px] overflow-hidden mt-6 lg:mt-0">
             <Image
               src="/hero_main.png"
               alt="Dentist working on patient"
               fill
               className="object-cover"
               priority
               sizes="(max-width: 1024px) 100vw, 50vw"
             />
             {/* Gradient Text Overlay */}
             <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-8 sm:p-12">
               <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-[24px] max-w-md shadow-2xl">
                 <h4 className="text-white font-medium text-xl mb-3">A Modern Approach to World - Class Care</h4>
                 <p className="text-white/80 text-[13px] leading-relaxed">
                   We&apos;re here to provide exceptional service that meets your needs and exceeds your expectations. Whether you&apos;re looking for expert solutions, personalized care.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-32">
        <div className="text-center mb-10 mt-16">
          <h2 className="text-4xl md:text-[40px] font-bold text-[#18181b] mb-6 tracking-tight">Our Services</h2>
          <p className="text-gray-500 text-[15px] max-w-xl mx-auto leading-relaxed mb-8">
            With over 15 years of experience, we are committed to delivering exceptional dental care tailored to your needs. Our dedicated team ensures a comfortable, stress-free experience for every patient.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['24/7 support', '10+ Doctors', 'Pet Friendly'].map(pill => (
              <span key={pill} className="px-6 py-2 bg-gray-50 hover:bg-gray-100 transition text-gray-500 text-sm font-semibold rounded-full cursor-pointer">
                {pill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#eff5ff] rounded-[40px] p-6 sm:p-10 grid lg:grid-cols-2 gap-10 items-center mt-12">
          {/* Services List Accordion Menu */}
          <div className="space-y-4 px-2 sm:px-6">
            {servicesList.map((service, index) => {
              const isActive = activeService === service.title;
              return (
                <div key={index} className={`border-b border-gray-200/50 pb-6 last:border-0 ${isActive ? '' : 'pt-2'}`}>
                  <button 
                    onClick={() => setActiveService(service.title)}
                    className="w-full flex items-center justify-between text-left mb-2 transition-colors"
                  >
                    <h3 className={`text-xl font-bold ${isActive ? 'text-[#18181b]' : 'text-gray-500'}`}>
                      {service.title}
                    </h3>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-white text-gray-800 shadow-sm' : 'bg-transparent text-gray-400'}`}>
                      {isActive ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  {isActive && (
                    <p className="text-gray-500 text-sm leading-relaxed pr-8 animate-in fade-in duration-300 mt-4">
                      {service.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Service Image */}
          <div className="relative h-[450px] md:h-[550px] rounded-[32px] overflow-hidden">
            <Image
              src="/dental_service.png"
              alt="Dental Service"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-32 pt-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-[40px] font-bold text-[#18181b] mb-6 tracking-tight">
            See What Our<br />Clients have to Say
          </h2>
          <p className="text-gray-500 text-[14px] max-w-[500px] mx-auto leading-relaxed">
            With over 15 years of experience, our clinic is dedicated to providing top-notch dental care. Our team of professionals ensures every visit is comfortable and stress-free.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-[#f9fafc] p-10 rounded-[32px]">
              <p className="text-gray-500 text-[14px] leading-relaxed mb-10 min-h-[120px]">
                The team was professional, friendly, and made me feel at ease throughout the entire process. My smile has never looked better, and I truly appreciate the personalized attention I was given.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <Image src={`https://i.pravatar.cc/150?img=${item + 30}`} alt={`Client ${item}`} width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#18181b] text-[15px]">Mark Jhonson</h4>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-1">Service taken - {item === 1 ? 'Dental Filling' : item === 2 ? 'Dental Cleaning' : 'Whitening'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Book Your Appointment Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-20 pt-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side Form */}
          <div className="max-w-[480px]">
            <h2 className="text-4xl md:text-[45px] font-bold text-[#18181b] mb-6 tracking-tight leading-[1.1]">
              Book Your<br />Appointment
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-10">
              With 15+ years of experience, our clinic offers top-notch, stress-free dental care. Book your appointment today for a healthier smile!
            </p>

            <form className="space-y-4">
              <Input placeholder="Your Name" className="bg-[#f4f4f5] border-none h-14 rounded-2xl px-6 text-[15px]" />
              <Input type="email" placeholder="Email" className="bg-[#f4f4f5] border-none h-14 rounded-2xl px-6 text-[15px]" />
              <div className="grid grid-cols-2 gap-4">
                <Input type="tel" placeholder="Phone number" className="bg-[#f4f4f5] border-none h-14 rounded-2xl px-6 text-[15px]" />
                <div className="relative">
                  <select defaultValue="" className="w-full h-14 bg-[#f4f4f5] border-none rounded-2xl px-6 text-[15px] text-gray-500 appearance-none outline-none focus:ring-2 focus:ring-[#2bb2cc] focus:border-transparent">
                    <option value="" disabled>Choose slot</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <Button onClick={() => router.push('/book')} type="button" className={`${PRIMARY_COLOR} hover:bg-black text-white rounded-full px-10 py-7 h-auto text-sm font-medium mt-6`}>
                Book Now
              </Button>
            </form>
          </div>

          {/* Right Side Image */}
          <div className="relative h-[650px] w-full rounded-[32px] overflow-hidden">
            <Image
              src="/clinic_location.png"
              alt="Clinic Location"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium text-[15px]">Our Location</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white/80 text-xs">1224 Main Street, Suite 101<br/>Anytown, USA 12345</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row before footer */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-0 hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-10">
              <div>
                  <h3 className="text-4xl font-bold mb-2">25+</h3>
                  <p className="text-xs text-gray-500 uppercase">Years of Experience</p>
              </div>
          </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#18181b] text-white pt-24 pb-10 px-4 sm:px-6 lg:px-8 mt-24 max-w-none">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
            {/* Brand Column */}
            <div className="md:col-span-4 pr-8">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.68629 2 6 4.68629 6 8C6 10.8284 7.5 13.9 10 16.5C10.5 17 10.8 17.8 10.8 18.5V19.5C10.8 20.9 11.2 22 12 22C12.8 22 13.2 20.9 13.2 19.5V18.5C13.2 17.8 13.5 17 14 16.5C16.5 13.9 18 10.8284 18 8C18 4.68629 15.3137 2 12 2Z" stroke="#2bb2cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2L12 8" stroke="#2bb2cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="flex items-center">
                  <span className={`font-semibold text-xl tracking-tight leading-none ${TEXT_ACCENT}`}>dental</span>
                  <span className="font-semibold text-xl tracking-tight leading-none text-white">health</span>
                </div>
              </Link>
              <p className="text-gray-400 text-[13px] leading-relaxed max-w-xs mt-8">
                With 15+ years of experience, our clinic offers top-notch, stress-free dental care. Book your appointment today for a healthier smile!
              </p>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-2 md:col-start-6">
              <h4 className="font-bold text-[10px] tracking-widest uppercase text-white mb-8">USEFUL LINKS</h4>
              <ul className="space-y-4">
                {['About Us', 'Our Services', 'Appointment', 'Privacy Policy', 'Contact Us'].map(link => (
                  <li key={link}>
                    <Link href="#" className="text-gray-400 hover:text-white text-[13px]">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-[10px] tracking-widest uppercase text-white mb-8">OUR SERVICES</h4>
              <ul className="space-y-4">
                {['Cosmetic Dentistry', 'General Dentistry', 'Certified Dentist', 'New Technology', 'Accept Insurance'].map(link => (
                  <li key={link}>
                    <Link href="#" className="text-gray-400 hover:text-white text-[13px]">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-[10px] tracking-widest uppercase text-white mb-8">FOLLOW US</h4>
              <ul className="space-y-4">
                {['Twitter', 'Facebook', 'Instagram'].map(link => (
                  <li key={link}>
                    <Link href="#" className="text-gray-400 hover:text-white text-[13px]">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <p className="text-gray-500 text-[11px]">Copyright 2024 UIStrat</p>
            <Link href="#" className="text-gray-500 hover:text-white text-[11px]">Terms and Condition</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
