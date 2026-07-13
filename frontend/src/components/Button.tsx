import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'full';
  loading?: boolean;
}

export const Button = React.memo(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled, 
  children, 
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-mrf-primary text-white hover:bg-blue-700 focus:ring-mrf-primary",
    secondary: "bg-mrf-secondary text-white hover:bg-blue-500 focus:ring-mrf-secondary",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-300",
    danger: "bg-mrf-danger text-white hover:bg-red-600 focus:ring-mrf-danger",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    full: "w-full h-12 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="mr-2 animate-spin">🌀</span> : null}
      {children}
    </button>
  );
});
