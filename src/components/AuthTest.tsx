"use client";
import { useAuth } from "@/lib/useAuth";
import { signInWithGoogle, signOutUser, getAuthErrorMessage } from "@/lib/auth";
import { useState } from "react";

export default function AuthTest() {
  const { user, loading, isAdmin, error } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (_err: any) {
      setAuthError(getAuthErrorMessage(_err));
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOutUser();
    } catch (_err: any) {
      setAuthError("Failed to sign out");
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-800">Loading authentication...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-2">Authentication Error</h3>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-3">Authentication Status</h3>
      
      {user ? (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="text-green-800 font-medium">✅ Signed In</div>
            <div className="text-sm text-green-700 mt-1">
              <div>Name: {user.displayName || "N/A"}</div>
              <div>Email: {user.email}</div>
              <div>Role: {isAdmin ? "Admin" : "Member"}</div>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
          >
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="text-yellow-800 font-medium">❌ Not Signed In</div>
            <p className="text-sm text-yellow-700 mt-1">
              Click the button below to sign in with Google
            </p>
          </div>
          
          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {signingIn ? "Signing in..." : "Sign In with Google"}
          </button>
        </div>
      )}
      
      {authError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {authError}
        </div>
      )}
    </div>
  );
} 