import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.memo(({ 
  className, 
  label, 
  error, 
  options, 
  ...props 
}: SelectProps) => (
  <div className={cn("w-full space-y-1.5", className)}>
    {label && (
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
    )}
    <select
      className={cn(
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-mrf-secondary focus:ring-2 focus:ring-mrf-secondary/20 focus:outline-none appearance-none bg-white",
        error && "border-mrf-danger focus:border-mrf-danger focus:ring-mrf-danger/20"
      )}
      {...props}
    >
      <option value="">Select option...</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-mrf-danger font-medium">{error}</p>
    )}
  </div>
));
