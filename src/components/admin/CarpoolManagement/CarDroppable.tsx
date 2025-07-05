"use client";
import { useDroppable } from '@dnd-kit/core';

interface CarDroppableProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function CarDroppable({ id, children, className }: CarDroppableProps) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} id={id} className={className}>
      {children}
    </div>
  );
} 