"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Menu, Home, Calendar, Car, Users, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useIsCapacitorIOS } from "@/hooks/use-is-capacitor-ios";
import UserProfile from '@/components/UserProfile';

interface GlobalNavigationProps {
  safeAreaStyle?: React.CSSProperties;
}

export default function GlobalNavigation({ safeAreaStyle }: GlobalNavigationProps) {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const isMobile = useMobile();
  const isCapacitorIOS = useIsCapacitorIOS();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/events/rides', label: 'Rides', icon: Car },
    { href: '/apartments', label: 'Hosting', icon: Users },
  ];

  // Add admin link if user is admin
  if (user && !loading) {
    // Check if user is admin (you'll need to implement this check)
    // For now, we'll show it to all authenticated users
    navigationItems.push({ href: '/admin', label: 'Admin', icon: Settings });
  }

  // Add test page for debugging (temporary)
  navigationItems.push({ href: '/test-firebase', label: 'Debug Test', icon: Settings });

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const NavLinks = () => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  if (loading) {
    return (
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src="/logo.png" 
                  alt="AAConnect Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-full bg-white p-1 shadow"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AAConnect
                </span>
              </Link>
            </div>
          </div>
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-200/50 shadow-sm"
      style={safeAreaStyle}
    >
      <div className="container mx-auto px-4 min-h-[64px] flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo.png" 
                alt="AAConnect Logo" 
                width={40} 
                height={40} 
                className="rounded-full bg-white p-1 shadow"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AAConnect
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex space-x-1">
              <NavLinks />
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications - removed for now */}

          {/* User Profile / Auth */}
          {user ? (
            <UserProfile />
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 max-w-full bg-white shadow-2xl border-l border-slate-200 p-0 flex flex-col">
                {/* Branding and Close Button */}
                <div
                  className="flex items-center justify-between px-6 pb-4 border-b border-slate-100"
                  style={{ paddingTop: isCapacitorIOS ? 'max(env(safe-area-inset-top), 44px)' : 'env(safe-area-inset-top, 0px)' }}
                >
                  <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="AAConnect Logo" width={36} height={36} className="rounded-full bg-white p-1 shadow" />
                    <span className="text-lg font-bold text-blue-700">AAConnect</span>
                  </div>
                  <button
                    aria-label="Close menu"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-full p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                {/* Menu Items */}
                <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-4 px-5 py-3 rounded-xl text-base font-medium transition-colors ${
                          active
                            ? 'bg-blue-100 text-blue-700 shadow-sm'
                            : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                        style={{ minHeight: 56 }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="h-6 w-6" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                {/* Optional: User Info and Sign Out */}
                {user && (
                  <div className="border-t border-slate-100 px-6 py-4">
                    <div className="text-sm text-gray-500 mb-2">Signed in as {user.displayName || user.email}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
} 