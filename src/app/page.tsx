"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import UserProfile from "@/components/UserProfile";

type Event = {
  id: string;
  title: string;
  date: { seconds: number; nanoseconds: number };
  location: string;
  description?: string;
  rsvpUrl?: string;
  ridesUrl?: string;
};

export default function Home() {
  const { user, loading } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        const now = new Date();
        const q = query(
          collection(db, "events"),
          orderBy("date", "asc"),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const allEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        
        const futureEvents = allEvents.filter((event: Event) => 
          new Date(event.date.seconds * 1000) > now
        );
        
        setUpcomingEvents(futureEvents.slice(0, 3));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setEventsLoading(false);
      }
    }

    fetchUpcomingEvents();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="AAConnect Logo" 
                width={40} 
                height={40} 
                className="rounded-full bg-white p-1 shadow"
              />
              <span className="font-extrabold text-2xl text-aacf-blue tracking-tight">
                AAConnect
              </span>
            </div>
            <div className="flex items-center gap-4">
              {!loading && (
                <>
                  {user ? (
                    <UserProfile />
                  ) : (
                    <Link
                      href="/login"
                      className="px-4 py-2 bg-aacf-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition shadow-sm"
                    >
                      Sign In
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Centered Card Layout */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-2xl mx-auto">
          {/* Centered Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Welcome to <span className="text-aacf-blue">AAConnect</span> <span role="img" aria-label="waving hand">👋</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Your one-stop hub for AACF events,<br />
              rides, and community.
            </p>
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <Link
                href="/events"
                className="px-8 py-4 bg-white text-aacf-blue border-2 border-aacf-blue rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg text-lg"
              >
                View Events
              </Link>
              <Link
                href="/events/rides"
                className="px-8 py-4 bg-white text-aacf-blue border-2 border-aacf-blue rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg text-lg"
              >
                Find Rides
              </Link>
            </div>
          </div>
        </div>
        {/* Thin Blue Accent Line Divider */}
        <div className="w-full flex justify-center">
          <div className="h-1 w-32 rounded-full bg-aacf-blue/70 my-8"></div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Stay Connected</h2>
          <p className="text-lg sm:text-xl text-aacf-blue mb-8 tracking-wide">
            Follow us on social media for the latest updates and community highlights!
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a
              href="https://www.instagram.com/aacf.uci/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-aacf-blue to-pink-500 text-white rounded-lg font-semibold hover:from-blue-800 hover:to-pink-600 transition shadow-md"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
            <a
              href="https://www.facebook.com/share/g/1A2BP7mzx5/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
            <a
              href="https://discord.gg/da3yMZ4nke"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-aacf-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition shadow-md"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
              </svg>
              Discord
            </a>
            <a
              href="https://linktr.ee/aacfuci"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
            >
              <Image src="/linktree-logo.svg" alt="Linktree" className="w-5 h-5" width={20} height={20} />
              Linktree
            </a>
          </div>
          {/* Email Subscription Form */}
          <EmailSubscribeForm />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/events"
              className="group bg-white rounded-xl p-8 text-center shadow-md border border-aacf-blue/20 hover:shadow-xl hover:ring-2 hover:ring-aacf-blue/30 transition-all duration-200"
            >
              <div className="w-16 h-16 bg-aacf-blue rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Events Calendar</h3>
              <p className="text-gray-600">Browse upcoming events and RSVP</p>
            </Link>

            <Link
              href="/events/rides"
              className="group bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100 hover:shadow-xl hover:ring-2 hover:ring-emerald-300 transition-all duration-200"
            >
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rides</h3>
              <p className="text-gray-600">Get or give a ride to afterevents</p>
            </Link>

            <div className="bg-white rounded-xl p-8 text-center border border-aacf-blue/20 shadow-md hover:shadow-xl hover:ring-2 hover:ring-aacf-blue/30 transition-all duration-200">
              <div className="w-16 h-16 bg-aacf-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">Connect with fellow members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Upcoming Events
          </h2>
          {eventsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-aacf-blue"></div>
              <p className="mt-2 text-gray-600">Loading events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold text-aacf-blue mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {new Date(event.date.seconds * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-gray-700 mb-4">{event.location}</p>
                  {event.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  )}
                  <div className="flex gap-2">
                    {event.rsvpUrl && (
                      <a
                        href={event.rsvpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-aacf-blue text-white text-sm rounded-md hover:bg-blue-800 transition"
                      >
                        RSVP
                      </a>
                    )}
                    {event.ridesUrl && (
                      <a
                        href={event.ridesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition"
                      >
                        Rides
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No upcoming events at the moment.</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              href="/events"
              className="px-6 py-2 bg-aacf-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image 
              src="/logo.png" 
              alt="AAConnect Logo" 
              width={32} 
              height={32} 
              className="rounded-full bg-white p-1"
            />
            <span className="font-bold text-xl">AAConnect</span>
          </div>
          <p className="text-gray-400 mb-4">
            Your one-stop hub for AACF events, rides, and community updates.
          </p>
          <div className="text-sm text-gray-500">
            © 2025 AAConnect. Built with ❤️ for the AACF community.
          </div>
        </div>
      </footer>
    </div>
  );
}

// EmailSubscribeForm component
function EmailSubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: Replace with real API call
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("success");
    setMessage("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
      <label htmlFor="subscribe-email" className="sr-only">Email address</label>
      <input
        id="subscribe-email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Sign up for our emails!"
        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-aacf-blue focus:outline-none text-lg w-72"
        required
        aria-label="Email address"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-aacf-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition shadow-md text-lg"
      >
        Subscribe
      </button>
      {status !== "idle" && (
        <span className={`ml-4 text-lg ${status === "success" ? "text-emerald-600" : "text-red-600"}`}>{message}</span>
      )}
    </form>
  );
}
