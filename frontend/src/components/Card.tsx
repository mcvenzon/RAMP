import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

export const Card = ({ 
  className, 
  title, 
  subtitle, 
  headerAction, 
  children 
}: CardProps) => (
  <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", className)}>
    {(title || subtitle) && (
      <div className="px-6 py-4 border-b border-gray-100">
        {title && <h3 className="text-lg font-semibold text-gray.800">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    )}
    <div className="px-6 py-4">
      {children}
    </div>
    {headerAction && (
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-right">
        {headerAction}
      </div>
    )}
  </div>
);
