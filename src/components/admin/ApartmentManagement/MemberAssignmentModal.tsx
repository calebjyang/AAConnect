"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCollection } from '@/lib/firestore';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface MemberAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartmentId: string;
  apartmentName: string;
  onAssign: (_userId: string, _userEmail: string, _userName: string, _userPicture?: string) => Promise<void>;
  loading?: boolean;
}

export default function MemberAssignmentModal({
  isOpen,
  onClose,
  apartmentId: _apartmentId,
  apartmentName,
  onAssign,
  loading = false
}: MemberAssignmentModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch all users from the users collection
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersCollection = await getCollection('users');
        const usersData: User[] = usersCollection.map((user: any) => ({
          uid: user.id,
          ...user,
        } as User));
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isOpen]);

  const filteredUsers = users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selectedUser) return;

    const user = users.find(u => u.uid === selectedUser);
    if (!user) return;

    try {
      await onAssign(user.uid, user.email, user.displayName, user.photoURL);
      setSelectedUser('');
      setSearchTerm('');
      onClose();
    } catch {
      // Error handling is done in the parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Assign Member to {apartmentName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Users
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name or email..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User
              </label>
              {loadingUsers ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    {searchTerm ? 'No users found matching your search' : 'No users available'}
                  </p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.uid}
                      className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0 ${
                        selectedUser === user.uid ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedUser(user.uid)}
                    >
                      <div className="flex items-center space-x-3">
                        {user.photoURL && (
                          <Image
                            src={user.photoURL}
                            alt={user.displayName}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {user.displayName || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                        {selectedUser === user.uid && (
                          <div className="text-blue-600">✓</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedUser || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Assigning...' : 'Assign Member'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 