import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'circle';
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  className = '',
}) => {
  const baseClasses = 'shimmer rounded-xl';

  if (variant === 'circle') {
    return <div className={`${baseClasses} rounded-full ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} border border-brand-blue-100 p-5 flex flex-col gap-3 min-h-[100px] ${className}`}>
        <div className="shimmer h-4 w-1/3 rounded" />
        <div className="shimmer h-8 w-full rounded" />
        <div className="shimmer h-4 w-2/3 rounded" />
      </div>
    );
  }

  return <div className={`${baseClasses} h-4 w-full ${className}`} />;
};
