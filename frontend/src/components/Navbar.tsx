import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  user?: { name: string; role: string };
  onLogout?: () => void;
}

export const Navbar = ({ user, onLogout, className }: NavbarProps) => (
  <nav className={cn("bg-mrf-primary text-white px-4 py-3 flex items-center justify-between shadow-md", className)}>
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold tracking-tight">MRF Pro</span>
    </div>
    {user && (
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium opacity-80">{user.role}</p>
          <p className="text-sm font-semibold">{user.name}</p>
        </div>
        <button 
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-md text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    )}
  </nav>
);
