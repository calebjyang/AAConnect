"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RidesSuccessPage() {
  const router = useRouter();

  // Redirect to home after 10 seconds if user doesn't navigate away
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-12 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          All set!
        </h1>
        
        <p className="text-gray-600 mb-8">
          We&apos;ll be in touch soon about your ride.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-aacf-blue text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Go Home
          </Link>
          
          <Link
            href="/rides"
            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            Submit Another
          </Link>
        </div>

        {/* Auto-redirect notice */}
        <p className="text-xs text-gray-400 mt-6">
          Redirecting to home in 10 seconds...
        </p>
      </div>
    </div>
  );
}
