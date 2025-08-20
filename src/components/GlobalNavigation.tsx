"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Home, Calendar, Car, Users, Settings, Menu, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useIsCapacitorIOS } from "@/hooks/use-is-capacitor-ios";
import UserProfile from '@/components/UserProfile';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useEffect } from 'react';
import { updateDoc } from '@/lib/firestore';
import { getFirebaseApp } from '@/lib/firebaseClient';

interface GlobalNavigationProps {
  safeAreaStyle?: React.CSSProperties;
}

export default function GlobalNavigation({ safeAreaStyle }: GlobalNavigationProps) {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const isMobile = useMobile();
  const isCapacitorIOS = useIsCapacitorIOS();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch notifications for the logged-in user
  useEffect(() => {
    if (!user || loading) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    let ignore = false;
    const fetchNotifications = async () => {
      try {
        // Use a proper Firestore query with where clause instead of fetching all
        const { getFirestore, collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
        const app = getFirebaseApp();
        if (!app) return;
        
        const db = getFirestore(app);
        const notificationsRef = collection(db, 'notifications');
        const userNotificationsQuery = query(
          notificationsRef,
          where('recipientId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(userNotificationsQuery);
        const userNotifs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (!ignore) {
          setNotifications(userNotifs);
          setUnreadCount(userNotifs.filter((n: any) => !n.read).length);
        }
      } catch (error) {
        console.warn('Failed to fetch notifications:', error);
        // Don't crash the component if notifications fail to load
        if (!ignore) {
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    };
    fetchNotifications();
    // Optionally, poll for new notifications every 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => { ignore = true; clearInterval(interval); };
  }, [user, loading]);

  // Mark all as read when dropdown is opened
  useEffect(() => {
    if (dropdownOpen && notifications.some(n => !n.read)) {
      notifications.filter(n => !n.read).forEach(async (notif) => {
        await updateDoc(`notifications/${notif.id}`, { read: true });
      });
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  }, [dropdownOpen, notifications]);

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/events/rides', label: 'Rides', icon: Car },
  ];

  // Add Hosting link only for authenticated users
  if (user && !loading) {
    navigationItems.push({ href: '/apartments', label: 'Hosting', icon: Users });
  }

  // Add admin link if user is admin
  if (user && !loading) {
    // Check if user is admin (you'll need to implement this check)
    // For now, we'll show it to all authenticated users
    navigationItems.push({ href: '/admin', label: 'Admin', icon: Settings });
  }

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
          {/* Notification Bell */}
          {user && (
            <DropdownMenu onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105">
                  <Bell className="h-6 w-6 text-slate-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 max-w-sm p-0 border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Bell className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">No notifications yet</p>
                      <p className="text-slate-400 text-xs mt-1">You&apos;ll see notifications here when someone joins your hangouts</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.slice(0, 10).map((notif) => (
                        <DropdownMenuItem 
                          key={notif.id} 
                          className={`p-0 focus:bg-transparent focus:outline-none ${!notif.read ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className={`w-full px-6 py-4 hover:bg-slate-50 transition-colors duration-150 ${!notif.read ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}>
                            <div className="flex items-start gap-3">
                              {/* Avatar/Icon */}
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                !notif.read ? 'bg-blue-100' : 'bg-slate-100'
                              }`}>
                                <Users className={`h-5 w-5 ${!notif.read ? 'text-blue-600' : 'text-slate-500'}`} />
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium leading-relaxed ${
                                  !notif.read ? 'text-slate-900' : 'text-slate-700'
                                }`}>
                                  {notif.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs text-slate-400">
                                    {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true
                                    }) : ''}
                                  </span>
                                  {!notif.read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 10 && (
                  <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">
                        Showing latest 10 of {notifications.length} notifications
                      </p>
                    </div>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* User Profile / Auth */}
          {user ? (
            <UserProfile />
          ) : (
            <Link href="/login">
              <Button 
                className="bg-aacf-blue text-white border-aacf-blue hover:bg-blue-800 hover:border-blue-800 shadow-md"
                size="sm"
              >
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