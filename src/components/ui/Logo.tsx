import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Sleek Minimalist Emblem */}
      <div
        className={`${iconSizes[size]} relative rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-sm shrink-0 transition-transform duration-200 hover:scale-105`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          {/* Minimalist Intersecting FinFlow Waves */}
          <path d="M4 14.5C4 10 7.5 7 12 7c4 0 8 3 8 7.5" />
          <path d="M7 17.5c1.5-2 3-3 5-3s3.5 1 5 3" />
          <circle cx="12" cy="7" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col min-w-0">
          <span className="font-extrabold text-sm lg:text-base tracking-tight text-slate-900 dark:text-white leading-none">
            FINFLOW
          </span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
            Command Center
          </span>
        </div>
      )}
    </div>
  );
}
