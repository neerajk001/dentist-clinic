'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/appointments', label: 'Appointments', icon: '📅' },
    { href: '/dashboard/patients', label: 'Patients', icon: '👥' },
    { href: '/dashboard/schedule', label: 'Schedule Settings', icon: '⚙️' },
    ...(role === 'doctor'
      ? [{ href: '/dashboard/doctor', label: 'My Patients', icon: '👨‍⚕️' }]
      : [{ href: '/dashboard/receptionist', label: 'Reception', icon: '📋' }]),
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={onMobileClose}
        className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Sidebar: mobile drawer (icons only), desktop full */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen z-50 lg:z-auto
          bg-[#0B0F19] text-white border-r border-[#1C2333]/50 shadow-2xl
          transition-transform duration-300
          w-20 lg:w-64
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          overflow-y-auto shrink-0
        `}
      >
        <div className="flex items-center justify-center lg:justify-between p-4 lg:p-6 border-b border-white/10">
          <div className="overflow-hidden hidden lg:block">
            <h1 className="text-xl font-bold whitespace-nowrap text-[#00d4ff]">Dental Clinic</h1>
            <p className="text-gray-400 text-xs mt-1 whitespace-nowrap truncate uppercase tracking-widest">
              {role === 'doctor' ? 'Doctor View' : 'Reception'}
            </p>
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden text-gray-300 hover:text-white p-2 rounded-md border border-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="mt-4">
          <ul className="space-y-2 px-2 lg:px-3">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={`flex items-center rounded-xl transition-colors ${
                      active ? 'bg-indigo-600/20 text-[#00d4ff] border border-indigo-900/50 shadow-inner' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    } justify-center lg:justify-start py-3 lg:px-4 lg:gap-4`}
                    title={item.label}
                  >
                    <span className={`text-xl shrink-0 flex items-center justify-center ${active ? 'scale-110' : 'opacity-80'}`}>{item.icon}</span>
                    <span className="hidden lg:block font-semibold whitespace-nowrap tracking-wide text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
