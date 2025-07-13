"use client";
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { RideSignup } from '@/lib/carpoolAlgorithm';

interface SortableRiderProps {
  id: string;
  rider: RideSignup;
  isUnassigned?: boolean;
}

const SortableRider = React.memo(function SortableRider({ id, rider, isUnassigned = false }: SortableRiderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-2 bg-white border rounded shadow-sm cursor-move ${
        isUnassigned 
          ? 'border-red-200' 
          : 'border-gray-200'
      } ${isDragging ? 'invisible' : ''}`}
    >
      <div className={`text-sm font-medium ${
        isUnassigned ? 'text-red-800' : 'text-gray-800'
      }`}>
        👤 {rider.name}
      </div>
      <div className="text-xs text-gray-600">
        {rider.location} • 📞 {rider.phone}
      </div>
    </div>
  );
});

export default SortableRider; 