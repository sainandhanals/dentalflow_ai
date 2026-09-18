import React from 'react';
import { PriorityLevel, EnquiryStatus, EngagementLevel } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'priority' | 'status' | 'engagement' | 'source' | 'service' | 'neutral';
  value?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  value, 
  size = 'sm',
  className = '' 
}) => {
  const baseClasses = `inline-flex items-center font-medium rounded-full ${
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
  }`;

  let colorClasses = 'bg-slate-100 text-slate-700 border border-slate-200';

  if (variant === 'priority') {
    const p = (value || children) as PriorityLevel;
    switch (p) {
      case 'Urgent Review':
        colorClasses = 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold animate-pulse';
        break;
      case 'High':
        colorClasses = 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold';
        break;
      case 'Medium':
        colorClasses = 'bg-blue-50 text-blue-700 border border-blue-200';
        break;
      case 'Low':
        colorClasses = 'bg-slate-100 text-slate-600 border border-slate-200';
        break;
    }
  } else if (variant === 'status') {
    const s = (value || children) as EnquiryStatus;
    switch (s) {
      case 'New':
        colorClasses = 'bg-sky-50 text-sky-700 border border-sky-200 font-semibold';
        break;
      case 'Pending Review':
        colorClasses = 'bg-amber-50 text-amber-800 border border-amber-200';
        break;
      case 'Follow-up Required':
        colorClasses = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
        break;
      case 'Responded':
        colorClasses = 'bg-teal-50 text-teal-700 border border-teal-200';
        break;
      case 'Converted':
        colorClasses = 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold';
        break;
      case 'Closed':
        colorClasses = 'bg-slate-100 text-slate-500 border border-slate-200';
        break;
    }
  } else if (variant === 'engagement') {
    const e = (value || children) as EngagementLevel;
    switch (e) {
      case 'Active':
        colorClasses = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
        break;
      case 'Moderate':
        colorClasses = 'bg-amber-50 text-amber-700 border border-amber-200';
        break;
      case 'At Risk':
        colorClasses = 'bg-rose-50 text-rose-700 border border-rose-200 font-medium';
        break;
    }
  } else if (variant === 'source') {
    colorClasses = 'bg-slate-100 text-slate-700 border border-slate-200';
  } else if (variant === 'service') {
    colorClasses = 'bg-teal-50 text-teal-800 border border-teal-200';
  }

  return (
    <span className={`${baseClasses} ${colorClasses} ${className}`}>
      {children}
    </span>
  );
};
