"use client";
import { useState, useCallback, useMemo } from 'react';
import React from 'react';
import Image from 'next/image';
import type { Apartment, ApartmentMember } from '@/types/apartment';

interface ApartmentListProps {
  apartments: Apartment[];
  members: ApartmentMember[];
  onEdit: (apartment: Apartment) => void;
  onDelete: (apartmentId: string) => void;
  onAssignMember: (apartmentId: string) => void;
  loading?: boolean;
}

const ApartmentList = React.memo(function ApartmentList({
  apartments,
  members,
  onEdit,
  onDelete,
  onAssignMember,
  loading = false
}: ApartmentListProps) {
  const [expandedApartment, setExpandedApartment] = useState<string | null>(null);

  const toggleExpanded = useCallback((apartmentId: string) => {
    setExpandedApartment(expandedApartment === apartmentId ? null : apartmentId);
  }, [expandedApartment]);

  const formatDate = useCallback((timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Memoize apartment members lookup
  const apartmentMembersMap = useMemo(() => {
    const map = new Map<string, ApartmentMember[]>();
    members.forEach(member => {
      if (!map.has(member.apartmentId)) {
        map.set(member.apartmentId, []);
      }
      map.get(member.apartmentId)!.push(member);
    });
    return map;
  }, [members]);

  const getApartmentMembers = useCallback((apartmentId: string) => {
    return apartmentMembersMap.get(apartmentId) || [];
  }, [apartmentMembersMap]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No apartments found</p>
        <p className="text-gray-400 text-sm mt-2">Create your first apartment to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apartments.map((apartment) => {
        const apartmentMembers = getApartmentMembers(apartment.id);
        const isExpanded = expandedApartment === apartment.id;

        return (
          <div key={apartment.id} className="bg-white rounded-lg shadow border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {apartment.name}
                  </h3>
                  {apartment.description && (
                    <p className="text-gray-600 text-sm mt-1">
                      {apartment.description}
                    </p>
                  )}
                  {apartment.address && (
                    <p className="text-gray-500 text-xs mt-1">
                      📍 {apartment.address}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>👥 {apartmentMembers.length} members</span>
                    <span>📅 Created {formatDate(apartment.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onAssignMember(apartment.id)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Assign Member
                  </button>
                  <button
                    onClick={() => onEdit(apartment)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(apartment.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleExpanded(apartment.id)}
                    className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    {isExpanded ? '▼' : '▶'}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Members ({apartmentMembers.length})
                  </h4>
                  {apartmentMembers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No members assigned yet</p>
                  ) : (
                    <div className="space-y-2">
                      {apartmentMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                          {member.userPicture && (
                            <Image
                              src={member.userPicture}
                              alt={member.userName}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {member.userName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.userEmail}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            Joined {formatDate(member.joinedAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default ApartmentList; 