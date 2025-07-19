# 🕘 Changelog

## v1.0.11 – July 2025
- **Carpool Management Restoration** 🔧
  - Restored working carpool management from commit 01f1d3d
  - Fixed "Edit Assignments" and "Test Assignment" buttons
  - Updated Firebase imports to use abstraction layer
  - Resolved type errors in CarpoolSignupsList

## v1.0.10 – July 2025
- **Cross-Platform Native Deployment** 📱
  - Added Capacitor integration for iOS/Android native apps
  - Implemented cross-platform Firebase abstraction layer
  - Resolved CORS issues on native platforms
  - Fixed Firebase initialization timing in iOS AppDelegate
  - Removed server-side dependencies for static deployment

## v1.0.9 – July 2025
- **UI/UX Enhancements**
  - Redesigned apartment availability tag selector (3x2 grid, 6 tags)
  - Integrated Shadcn UI component library
  - Fixed import paths and cleaned up unused code
  - All tests passing, linter warnings only

## v1.0.8 – July 2025
- **Collection Name Mismatch Fix** 🔧
  - Fixed admin dashboard not showing ride signups
  - Unified collection usage: both public and admin use `rides` collection
  - Resolved merge conflicts and cleaned up imports

## v1.0.7 – July 2025
- **Authentication & Styling Fixes** 🔐
  - Fixed sign in button styling with proper brand colors and contrast
  - Resolved apartment availability posting errors (charAt undefined)
  - Add null safety for postedByName fields across components
  - Update Firebase auth domain configuration lesson in docs
  - Clean up README environment setup section
  - Ensure proper user data handling in availability management

## v1.0.6 – July 2025
- **Authentication Redirect Fix** 🔧
  - Fixed Firebase auth domain configuration issue
  - Resolved localhost authentication redirect problems
  - Simplified Firebase configuration for better reliability
  - Added comprehensive error handling for authentication flow

## v1.0.5 – July 2025
- **Documentation & Code Quality** 📚
  - Updated CHANGELOG formatting and version numbering
  - Added Firebase auth domain configuration lesson to bugfixes
  - Improved code documentation and error handling
  - Enhanced development workflow consistency

## v1.0.4 – July 2025
- **Development Environment Cleanup** 🧹
  - Killed all active local deployments for clean state
  - Ensured consistent development server management
  - Improved build and deployment processes
  - Enhanced development workflow reliability

## v1.0.3 – June 2025
- **Google OAuth Authentication** 🔐
  - Enhanced Firebase Auth with Google OAuth
  - Admin role verification with Firestore
  - Protected routes for users and admins
  - User profile component with sign out
  - Loading states and improved UX

## v1.0.2 – June 2025
- **Landing Page (v1)** ✨
  - Hero section with dual CTAs (View Events, Find Rides)
  - Social media links (Instagram, Facebook, Discord, Linktree)
  - Email subscription form
  - Quick Actions section with Events, Rides, Community cards
  - Upcoming Events from Firebase
  - Mobile-first responsive design

## v1.0.1 – June 2025
- **Core Features Implementation**
  - Event Details page
  - Carpool Algorithm (v1)
  - Admin Dashboard for carpooling

## v1.0.0 – June 2025
- **Initial Project Setup**
  - Initial PRD and MVP scope
  - Scaffolding: event calendar, admin dashboard, carpool rides form

---

## ✨ New Features
- Apartment Availability Wall
- iOS Deployment
- Admin Dashboard Improvements

## 🚀 Upcoming Features
- Weekly Recap
- Android Deployment

---

**Document Version**: 2.0 (Condensed)  
**Focus**: Key changes and specific fixes
