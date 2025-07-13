"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic imports for heavy components
export const DynamicCarpoolManagement = dynamic(
  () => import('./admin/CarpoolManagement/CarpoolManagement'),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    ),
    ssr: false // Disable SSR for complex drag-and-drop components
  }
);

export const DynamicEventManagement = dynamic(
  () => import('./admin/EventManagement').then(mod => ({ default: mod.EventManagement })),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }
);

export const DynamicApartmentManagement = dynamic(
  () => import('./admin/ApartmentManagement/ApartmentManagement'),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }
);

// Wrapper component for dynamic imports with error boundary
interface DynamicComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function DynamicComponentWrapper({ children, fallback }: DynamicComponentWrapperProps) {
  return (
    <Suspense fallback={fallback || (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
      </div>
    )}>
      {children}
    </Suspense>
  );
} 