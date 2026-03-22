'use client';

import { useSession, signOut } from 'next-auth/react';
import { Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession();

  return (
    <header className="bg-white/95 backdrop-blur border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 md:py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Dashboard</h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 truncate max-w-45">{session?.user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{session?.user?.role}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-3 py-2 sm:px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
