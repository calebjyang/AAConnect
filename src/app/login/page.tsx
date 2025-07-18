"use client";
import Image from "next/image";
import { signInWithGoogle, getAuthErrorMessage } from "@/lib/auth";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [user, loading, isAdmin, router]);

  const handleSignIn = async () => {
    console.log('Sign-in button clicked');
    setSigningIn(true);
    setError(null);
    
    try {
      console.log('Calling signInWithGoogle...');
      const result = await signInWithGoogle();
      console.log('Sign-in result:', result);
    } catch (err: any) {
      console.error("Sign-in error:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      setError(getAuthErrorMessage(err));
    } finally {
      console.log('Sign-in process completed, setting signingIn to false');
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-aacf-blue mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        {/* Logo Image */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="AAConnect Logo"
              width={64}
              height={64}
              className="w-16 h-16"
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Welcome to AAConnect</h1>
        <p className="mb-8 text-gray-500 text-center">Sign in to see events, RSVP, and join carpools!</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <button
          className={`flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors duration-200 ${
            signingIn ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          onClick={handleSignIn}
          disabled={signingIn}
        >
          {signingIn ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </>
          ) : (
            <>
              {/* Google Icon SVG */}
              <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_17_40)">
                  <path d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24V29.1H37.4C36.7 32.1 34.7 34.6 31.8 36.3V42.1H39.5C44 38.1 47.5 32.1 47.5 24.5Z" fill="#4285F4"/>
                  <path d="M24 48C30.6 48 36.1 45.9 39.5 42.1L31.8 36.3C29.9 37.5 27.3 38.3 24 38.3C17.7 38.3 12.2 34.2 10.3 28.7H2.3V34.7C5.7 41.1 14.1 48 24 48Z" fill="#34A853"/>
                  <path d="M10.3 28.7C9.7 26.7 9.7 24.7 10.3 22.7V16.7H2.3C-0.3 21.1-0.3 26.9 2.3 34.7L10.3 28.7Z" fill="#FBBC05"/>
                  <path d="M24 9.7C27.6 9.7 30.7 11 32.8 13.1L39.7 6.2C36.1 2.8 30.6 0 24 0C14.1 0 5.7 6.9 2.3 16.7L10.3 22.7C12.2 17.2 17.7 13.1 24 13.1V9.7Z" fill="#EA4335"/>
                </g>
                <defs>
                  <clipPath id="clip0_17_40">
                    <rect width="48" height="48" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              Sign in with Google
            </>
          )}
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            By signing in, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}
