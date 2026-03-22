'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) { // Collapse on tablets and mobile natively
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/appointments', label: 'Appointments', icon: '📅' },
    { href: '/dashboard/patients', label: 'Patients', icon: '👥' },
    { href: '/dashboard/treatments', label: 'Treatments', icon: '💊' },
    { href: '/dashboard/schedule', label: 'Schedule Settings', icon: '⚙️' },
    ...(role === 'doctor'
      ? [{ href: '/dashboard/doctor', label: 'My Patients', icon: '👨‍⚕️' }]
      : [{ href: '/dashboard/receptionist', label: 'Reception', icon: '📋' }]),
  ];

  const isActive = (href: string) => pathname === href;

  if (!mounted) return <aside className="w-20 lg:w-64 bg-[#0B0F19] h-screen sticky top-0 flex-shrink-0 border-r border-[#1C2333]/50"></aside>;

  return (
    <aside className={`bg-[#0B0F19] h-screen sticky top-0 overflow-y-auto flex-shrink-0 text-white border-r border-[#1C2333]/50 shadow-2xl transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center p-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-xl font-bold whitespace-nowrap text-[#00d4ff]">Dental Clinic</h1>
            <p className="text-gray-400 text-xs mt-1 whitespace-nowrap truncate uppercase tracking-widest">
              {role === 'doctor' ? 'Doctor View' : 'Reception'}
            </p>
          </div>
        )}
        <button 
           onClick={() => setIsCollapsed(!isCollapsed)} 
           className="text-gray-400 hover:text-white p-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shrink-0"
           title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="mt-4">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center transition-colors rounded-xl ${
                    active ? 'bg-indigo-600/20 text-[#00d4ff] border border-indigo-900/50 shadow-inner' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  } ${isCollapsed ? 'justify-center py-3' : 'gap-4 px-4 py-3'}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={`text-xl shrink-0 flex items-center justify-center ${active ? 'scale-110' : 'opacity-80'}`}>{item.icon}</span>
                  {!isCollapsed && <span className="font-semibold whitespace-nowrap tracking-wide text-sm">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
