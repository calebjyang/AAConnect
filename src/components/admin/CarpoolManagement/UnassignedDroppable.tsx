"use client";
import { useDroppable } from '@dnd-kit/core';

interface UnassignedDroppableProps {
  children: React.ReactNode;
  className?: string;
}

export default function UnassignedDroppable({ children, className }: UnassignedDroppableProps) {
  const { setNodeRef } = useDroppable({ id: 'unassigned' });
  return (
    <div ref={setNodeRef} id="unassigned" className={className}>
      {children}
    </div>
  );
} 