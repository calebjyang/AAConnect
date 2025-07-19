"use client";
import { useAuth } from "@/lib/useAuth";
import { signOutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function UserProfile() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOutUser();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      setSigningOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-aacf-blue flex items-center justify-center text-white font-semibold text-sm">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            user.displayName?.charAt(0) || user.email?.charAt(0) || "?"
          )}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {user.displayName || "User"}
          </div>
          <div className="text-xs text-gray-500">
            {isAdmin ? "Admin" : "Member"}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isMenuOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900">
              {user.displayName || "User"}
            </div>
            <div className="text-xs text-gray-500">{user.email}</div>
            <div className="text-xs text-aacf-blue font-medium mt-1">
              {isAdmin ? "Administrator" : "Member"}
            </div>
          </div>
          
          {isAdmin && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/admin");
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Admin Dashboard
            </button>
          )}
          
          <button
            onClick={() => {
              setIsMenuOpen(false);
              router.push("/");
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Home
          </button>
          
          <button
            onClick={() => {
              setIsMenuOpen(false);
              router.push("/events");
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Events
          </button>
          
          <div className="border-t border-gray-100 mt-1">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 