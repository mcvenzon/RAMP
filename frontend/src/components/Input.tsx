import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.memo(({ 
  className, 
  label, 
  error, 
  type = 'text',
  ...props 
}: InputProps) => (
  <div className={cn("w-full space-y-1.5", className)}>
    {label && (
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
    )}
    <input
      type={type}
      className={cn(
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400",
        "focus:border-mrf-secondary focus:ring-2 focus:ring-mrf-secondary/20 focus:outline-none",
        error && "border-mrf-danger focus:border-mrf-danger focus:ring-mrf-danger/20"
      )}
      {...props}
    />
    {error && (
      <p className="text-xs text-mrf-danger font-medium">{error}</p>
    )}
  </div>
));
