import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Page = ({ title, subtitle, children }: PageProps) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </header>
    <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      {children}
    </main>
    <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
      <p>© 2026 MRF Inventory & Marketplace</p>
    </footer>
  </div>
);
