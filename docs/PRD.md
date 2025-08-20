# 📘 AAConnect – Product Requirements Document (PRD)

**Version:** 2.0  
**Last Updated:** July 2025

---

## 🔍 Overview

AAConnect is a mobile-first PWA for Asian American Christian Fellowship chapters that centralizes event access, afterevent ride coordination, and apartment availability for spontaneous hangouts. It's designed to reduce planning friction and foster deeper in-community connection. The application now supports both web and native iOS/Android deployment with cross-platform Firebase integration.

---

## 🔐 Authentication System - COMPLETED ✅

The authentication system provides secure access control using Google OAuth via Firebase Auth, with cross-platform compatibility for web and native deployment.

### Features Implemented:
- **Google OAuth Integration**: Seamless sign-in with Google accounts
- **Admin Role Management**: Firestore-based admin verification system
- **Protected Routes**: Automatic redirection for unauthenticated users
- **User Profile Management**: Profile display and sign out functionality
- **Error Handling**: Comprehensive error messages and recovery flows
- **Loading States**: Smooth UX with proper loading indicators
- **Admin-Only Routes**: Specialized protection for admin pages
- **Cross-Platform Support**: Works seamlessly on web, iOS, and Android

### Security Features:
- Firebase Auth integration with Google OAuth
- Admin role verification against Firestore database
- Automatic session management and persistence
- Secure route protection with proper redirects
- Cross-platform security model using Firestore rules

### Technical Implementation:
- **Web Platform**: Firebase Web SDK for authentication
- **Native Platforms**: Capacitor Firebase Authentication plugin
- **Cross-Platform Abstraction**: Automatic platform detection and appropriate API usage
- **No CORS Issues**: Native platforms use platform-specific APIs

---

## 🧭 Global Navigation System - COMPLETED ✅

A comprehensive navigation system that provides consistent access to all app features across all pages and platforms.

### Features Implemented:
- **Global Navigation Bar**: Persistent navigation header with logo and main menu items
- **Mobile Hamburger Menu**: Responsive mobile navigation with slide-out menu
- **Active Page Indicators**: Visual feedback showing current page location
- **User Authentication Integration**: Sign in/out functionality integrated into navigation
- **Admin Access Control**: Conditional admin menu items based on user permissions
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Loading States**: Smooth loading indicators during authentication checks
- **Cross-Platform Compatibility**: Consistent behavior across web, iOS, and Android

### Navigation Items:
- **Home**: Landing page and community discovery
- **Events**: Event calendar and management
- **Rides**: Carpool coordination and signup
- **Hosting**: Apartment availability and hangout coordination
- **Admin**: Administrative dashboard (admin users only)

### Technical Implementation:
- **Next.js App Router**: Leverages Next.js 15 routing system
- **React Server Components**: Optimized performance with RSC
- **Tailwind CSS**: Consistent styling with design system
- **Cross-Platform Firebase**: Real-time authentication state management across platforms
- **Mobile-First Design**: Responsive breakpoints and touch-friendly interface
- **Capacitor Integration**: Native navigation support for iOS/Android

---

## 🏠 Landing Page (v1) - COMPLETED ✅

The landing page serves as the primary entry point for AAConnect, providing users with immediate access to key features and community information across all platforms.

### Features Implemented:
- **Hero Section**: Welcoming headline with "Welcome to AAConnect 👋" and dual call-to-action buttons
- **Social Media Integration**: Direct links to Instagram, Facebook, Discord, and Linktree
- **Email Subscription**: Community newsletter signup form
- **Quick Actions**: Three main action cards (Events Calendar, Rides, Community)
- **Upcoming Events**: Dynamic display of upcoming events from Firebase
- **Responsive Design**: Mobile-first approach optimized for PWA installation
- **Accessibility**: WCAG 2.2 AA compliant with proper ARIA labels and semantic HTML
- **Cross-Platform Data**: Events loaded using cross-platform Firestore abstraction

### Design Principles:
- Clean, centered card layout for focus
- Consistent color scheme using AACF brand colors
- Clear visual hierarchy and intuitive navigation
- Fast loading with optimized performance
- Consistent experience across web and native platforms

---

## 🚗 Afterevent Carpool Coordinator - COMPLETED ✅

The carpool system provides comprehensive ride coordination for afterevents with both automated assignment and manual admin override capabilities. This feature includes a sophisticated drag-and-drop interface built with @dnd-kit for intuitive manual assignment management, now with cross-platform Firebase integration.

### Recent Enhancements (July 2025):
- **Cross-Platform Firebase Integration**: Seamless operation on web, iOS, and Android without CORS issues
- **Enhanced Matching Algorithm**: Added grade and gender-based matching for better carpool assignments
- **Grade Mixing**: Ensures diverse grade levels in each car for better community building
- **Gender Balance**: Prioritizes having at least 2 females per car when possible
- **Improved User Experience**: Added grade and gender fields to signup forms
- **Admin Interface Updates**: Enhanced admin forms and data display with new fields

### Recent Fixes (July 2025):
- **Native Platform Compatibility**: Resolved CORS issues by implementing cross-platform Firebase abstraction
- **Collection Name Consistency**: Fixed critical bug where admin dashboard wasn't displaying ride signups due to collection name mismatch between public form (`rides`) and admin interface (`rideSignups`)
- **Data Visibility**: Ensured all signups are now visible in admin dashboard, including "Fall Week 1" and other weeks
- **Code Quality**: Improved import consistency and reduced bundle size
- **Firebase Initialization**: Fixed timing issues in iOS AppDelegate for proper Firebase setup

### Features Implemented:
- **Member Signup Form**: Easy-to-use form for drivers and riders to sign up with grade and gender information
- **Smart Assignment Algorithm**: Automatic carpool assignment with location-based optimization, grade mixing, and gender balance
- **Admin Dashboard**: Complete management interface for ride coordination
- **Advanced Drag-and-Drop Interface**: Intuitive drag-and-drop editing for admins to manually adjust assignments
- **Real-time Statistics**: Live assignment metrics and success rates
- **Export Functionality**: CSV export for assignments and raw data
- **Capacity Management**: Visual indicators for full cars and overflow handling
- **Week-based Organization**: Filter and manage assignments by afterevent week
- **Custom Drag Preview**: Optimized drag overlay with exact styling matching original cards
- **Multi-Container Support**: Drag between cars, unassigned area, and empty containers
- **Fallback Logic**: Graceful handling of invalid drop zones with automatic reversion
- **Cross-Platform Data**: All Firestore operations work seamlessly across web and native platforms

### Algorithm Features:
- **Location Optimization**: Prioritizes exact location matches, then location groups
- **Grade Mixing**: Ensures diverse grade levels in each car for better community building
- **Gender Balance**: Prioritizes having at least 2 females per car when possible
- **Capacity Management**: Respects vehicle capacity limits
- **First-Come-First-Served**: Fair assignment based on signup time
- **Overflow Handling**: Clear identification of unassigned riders
- **Location Groups**: Smart grouping for friend-group mixing (Middle Earth, Mesa Court, UTC, ACC, Other)

### Admin Features:
- **Visual Assignment Display**: Clear overview of all carpool assignments
- **Advanced Drag-and-Drop Editing**: Intuitive interface to move riders between cars with visual feedback
- **Capacity Validation**: Prevents overloading vehicles with real-time validation
- **Save/Cancel Operations**: Safe editing with ability to revert changes
- **Assignment Statistics**: Real-time metrics on assignment success
- **Empty Container Support**: Ability to drag to empty cars and unassigned areas
- **Custom Drag Overlay**: Professional drag preview that maintains card dimensions and styling
- **Enhanced Data Management**: Grade and gender fields in admin forms and data display
- **Cross-Platform Admin**: Admin dashboard works consistently across all platforms

### Technical Implementation:
- **@dnd-kit Integration**: Modern drag-and-drop library with accessibility support
- **Multi-Container Architecture**: Separate droppable zones for each car and unassigned area
- **Custom Components**: CarDroppable and UnassignedDroppable components for clean separation
- **State Management**: Optimistic updates with fallback error handling
- **Performance Optimized**: Efficient re-rendering and minimal DOM manipulation
- **Accessibility Compliant**: Full keyboard navigation and screen reader support
- **Cross-Platform Firebase**: Uses appropriate Firebase API for each platform (Web SDK vs Capacitor plugins)
- **Platform Detection**: Automatic detection of web vs native environment
- **In-Memory Filtering**: Advanced queries handled with client-side filtering on native platforms

### Bug Fixes & Optimizations:
- **Snap-back Issue**: Resolved by removing SortableContext for multi-container operations
- **Drag Preview Styling**: Fixed oversized/distorted preview with custom DragOverlay
- **Height Consistency**: Maintained consistent card dimensions during drag operations
- **Duplicate Previews**: Eliminated by hiding original elements during drag
- **Invalid Drop Handling**: Added fallback logic to revert moves when dropped outside valid zones
- **Empty Container Support**: Ensured all containers are registered as droppable zones
- **React Hooks Compliance**: Fixed Rules of Hooks violations by extracting droppable logic
- **CORS Resolution**: Eliminated CORS issues on native platforms through cross-platform Firebase integration
- **Firebase Initialization**: Fixed timing issues preventing Firebase from loading on iOS

---

## July 2025 Update: Async Query Helpers & Error Handling

- All Firestore query helpers (orderByQuery, limitQuery, whereQuery) are now async and use dynamic imports for the Firebase Web SDK.
- This ensures robust error handling and compatibility with both web and native builds.
- See README and ADMIN_NATIVE_REFACTOR.md for details.

---

## 👤 User Roles

| Role   | Permissions |
|--------|-------------|
| **Member** | View events, RSVP (via external form), sign up for afterevents, join one apartment, post availability |
| **Admin**  | Create/edit events, manage carpool assignments, manage users, seed apartment list, assign members to apartments |

---

## 🔐 Core Features

### 🔐 Authentication - COMPLETED ✅
- Login required via Google OAuth
- No domain restrictions for multi-campus and staff support
- Cross-platform compatibility (web, iOS, Android)
- Secure admin role verification using Firestore

### 🧭 Global Navigation - COMPLETED ✅
- Persistent navigation bar across all pages
- Mobile hamburger menu with slide-out navigation
- Active page indicators and user authentication integration
- Admin access control with conditional menu items
- Responsive design optimized for all devices
- Cross-platform consistency across web and native platforms

### 🏠 Landing Page - COMPLETED ✅
- Hero section with welcoming design and dual call-to-action buttons
- Social media integration with direct links to Instagram, Facebook, Discord, and Linktree
- Email subscription form for community newsletter
- Quick Actions section with Events Calendar, Rides, and Community cards
- Upcoming Events section with dynamic loading from Firebase
- Responsive design optimized for mobile-first PWA installation
- Accessibility improvements (WCAG 2.2 AA compliant)
- Cross-platform data loading using unified Firestore abstraction

### 🚗 Afterevent Carpool Coordinator - COMPLETED ✅
- Members indicate whether they are a driver or need a ride
- Drivers set max passengers
- Riders can select early/late preference
- **Enhanced Algorithm** with grade and gender matching:
  - Mix of grades for better community building
  - Gender balance (at least 2 females per car when possible)
  - Location-based optimization
  - Car timing preference
- **Advanced Drag-and-Drop Admin Interface**: Intuitive manual assignment editing
- **Multi-Container Drag Support**: Drag between cars, unassigned area, and empty containers
- **Custom Drag Preview**: Professional drag overlay with exact styling
- **Capacity Validation**: Real-time validation prevents overloading vehicles
- **Fallback Error Handling**: Graceful handling of invalid operations
- **Cross-Platform Compatibility**: Works seamlessly on web, iOS, and Android
- Output is shown in-app with CSV export functionality

### 📆 Event Calendar - COMPLETED ✅
- Chronological or calendar view of events
- Each event includes name, date/time, location, description
- RSVP handled via external Google Form
- Admins can create/edit/delete events via admin dashboard
- **List and Calendar View Toggle**: Users can switch between chronological and calendar layouts
- **Event Detail Modal**: Comprehensive event information with Google Calendar integration
- **Past Events Display**: Historical event viewing with visual distinction

### 🛠 Admin Dashboard - PARTIALLY COMPLETED ✅
- Protected `/admin` route
- CRUD access for events
- **Advanced Carpool Management**: Drag-and-drop interface with real-time validation
- **Assignment Statistics**: Live metrics and success rates
- **Export Functionality**: CSV export for assignments and raw data
- **Apartment Management**: Create, edit, and assign apartments to members
- **Afterevent Week Configuration**: Set and manage current afterevent week

#### 🚧 In Progress / Planned Features:
- **User Management**: Tools to manage users, assign roles, and view user data (placeholder implemented)
- **Analytics Dashboard**: Data visualization, metrics, and reporting tools (placeholder implemented)

### 🏠 Apartment Availability Wall - COMPLETED ✅

The apartment availability system enables members to post and discover open time slots for spontaneous hangouts across all apartments in the community.

#### Recent Implementation (July 2025):
- **Complete Apartment Management**: Admin interface for creating apartments and assigning members
- **User Apartment Assignment**: Automatic user-to-apartment assignment system
- **Availability Posting**: Intuitive form for posting time slots with descriptions
- **Global Availability Dashboard**: Real-time view of all apartment availability
- **Responsive Design**: Mobile-first interface optimized for PWA usage
- **Enhanced Tag System**: Tag selector now includes 7 tags (Snacks, Games, Study, Yap, Quiet, Prayer, Jam Sesh) for comprehensive activity selection
- **UI Component Library**: Integrated Shadcn UI for modern, reusable UI primitives
- **Modal/Card Layouts**: Improved modal and card layouts for clarity and compactness
- **Code Cleanup**: Removed legacy/temp files and fixed import path issues for better maintainability

#### Features Implemented:
- **Admin Apartment Management**: Create, edit, and manage apartment listings
- **Member Assignment System**: Assign users to specific apartments with admin controls
- **Availability Form**: User-friendly interface for posting time slots with:
  - Start and end time selection (24-hour format)
  - Description field (200 character limit)
  - Optional guest limit (1-20 guests, or unlimited)
  - Enhanced tag selection (7 tags including new "Jam Sesh" option)
- **Global Availability List**: Comprehensive dashboard showing all availability slots
- **Filtering & Sorting**: Filter by time (all/upcoming/past) and sort by time or apartment
- **Delete Functionality**: Members can remove their own availability posts
- **Real-time Updates**: Live data synchronization with Firestore

#### Technical Implementation:
- **TypeScript Types**: Comprehensive type definitions for apartments, members, and availability
- **Custom Hooks**: `useUserApartment` and `useAvailabilityManagement` for state management
- **Firestore Integration**: Real-time database with proper indexing and security rules
- **Form Validation**: Client-side validation with error handling
- **Modal Interface**: Clean modal-based posting interface
- **Responsive UI**: Tailwind CSS styling consistent with app design system

#### Bug Fixes & Optimizations:
- **Timezone Handling**: Fixed 7-hour timezone shift by using local timezone formatting
- **Manual Date Input**: Resolved year input issues with uncontrolled datetime-local inputs
- **Firestore Compatibility**: Fixed `undefined` field errors by using `null` for optional values
- **Form UX**: Improved input handling for better manual typing experience
- **UI Consistency**: Updated styling to match app-wide design patterns
- **Type Safety**: Enhanced TypeScript types to handle optional fields properly

#### User Experience:
- **Intuitive Interface**: Clean, card-based design with proper spacing
- **Clear Feedback**: Success/error messages and loading states
- **Accessibility**: Proper labels, ARIA attributes, and keyboard navigation
- **Mobile Optimization**: Touch-friendly interface with responsive design

### 🔗 Social Media Links - COMPLETED ✅
- Links out to AACF's Instagram, Facebook, YouTube, etc.

---

## ✅ User Stories

### Member
- "I want to know when and where our next event is." ✅
- "I need a ride to an afterevent." ✅
- "I want to see which apartments are open to hang." ✅
- "I want to let people know our apartment is open for visitors." ✅
- "I want to easily navigate between different sections of the app." ✅

### Admin
- "I want to create and edit upcoming events." ✅
- "I want to generate and adjust carpool groupings with an intuitive interface." ✅
- "I want to manually override algorithm assignments when needed." ✅
- "I want to see real-time statistics on assignment success." ✅
- "I want to export carpool data for external communication." ✅
- "I want to manage apartment membership." ✅
- "I want to keep the hangout wall clean and up-to-date." ✅
- "I want better carpool matching that considers grade and gender for community building." ✅
- "I want to manage user accounts and roles." 🚧 (planned)
- "I want to view analytics and usage statistics." 🚧 (planned)

---

## 🚫 Out of Scope (MVP)
- In-app RSVP (forms link externally)
- Push notifications
- Public discoverability
- Campus switching / multi-chapter support

---

## 🔜 Future Ideas
- Push notifications for event reminders and carpool updates
- Public-facing event views (no login required)
- In-app RSVP with Firebase sync
- Apartment group chat / maps
- Match history or smart ride pairing
- Advanced carpool algorithms with machine learning
- Real-time carpool status updates
- Integration with ride-sharing services

---

## 🛠 Technical Stack

### Frontend & Deployment
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: Modern component library with Radix UI primitives
- **@dnd-kit**: Modern drag-and-drop library
- **Vercel**: Deployment platform with native Next.js support
- **Capacitor**: Cross-platform native deployment (iOS/Android)
- **Firebase SDK**: Real-time database integration

### Backend
- **Firebase Auth**: Google OAuth authentication with cross-platform support
- **Firestore**: NoSQL database for events and user data
- **Cross-Platform Firebase**: Unified abstraction layer for web and native platforms
- **Cloud Functions**: Serverless backend logic (future)

### Development Tools
- **ESLint**: Code quality and consistency
- **TypeScript**: Static type checking
- **Git**: Version control with feature branching

### Performance & Quality
- **Mobile-First Design**: Optimized for PWA installation
- **Accessibility**: WCAG 2.2 AA compliance
- **Performance**: Fast loading with optimized bundles
- **Code Quality**: Comprehensive linting and type safety
- **Cross-Platform Testing**: Comprehensive testing across web, iOS, and Android
- **Deployment**: Vercel (web) with automatic Git integration and Capacitor (native) deployment

## 📱 In-App Notifications

### Overview
AAConnect now includes a robust in-app notification system that provides real-time updates about events, carpools, and apartment hangouts.

### User Stories

**As a** apartment host  
**I want to** receive notifications when someone joins my hangout  
**So that** I can stay updated on who's coming to my apartment

**As a** user  
**I want to** see a notification count in the navigation  
**So that** I know when I have new notifications to check

**As a** user  
**I want to** view my notifications in a beautiful dropdown  
**So that** I can easily see what's happening with my hangouts

### Technical Requirements

**Frontend**: React components with Tailwind CSS styling
**Backend**: Firestore `notifications` collection
**Real-time**: Automatic notification creation on hangout joins
**UI Components**: Notification bell, dropdown, badge counter
**Data Structure**: 
  ```typescript
  interface Notification {
    id: string;
    recipientId: string;
    apartmentId: string;
    slotId: string;
    type: 'join_hangout';
    message: string;
    createdAt: string;
    read: boolean;
    joiningUser: {
      userId: string;
      displayName: string;
      email: string;
      photoURL: string;
    };
  }
  ```

**Security Implementation**:
- **Firestore Rules**: Updated `availabilitySlots` collection for authenticated-only access
- **Route Protection**: `ProtectedRoute` component wrapper for apartments page
- **Navigation Logic**: Conditional rendering based on authentication state
- **Redirect Handling**: Automatic login redirects for unauthenticated users

**Performance Requirements**:
- **Notification Loading**: Optimized queries with Firestore indexes
- **Real-time Updates**: Efficient notification fetching and state management
- **Mobile Responsiveness**: Smooth animations and touch-friendly interactions

**Success Metrics**:
- **User Engagement**: Increased hangout participation through notifications
- **Security**: Zero unauthorized access to apartment availability data
- **User Experience**: Smooth authentication flow and intuitive notification system
- **Performance**: Fast notification loading and responsive UI interactions

**Future Enhancements**:
- Push notifications for mobile apps
- Email notification preferences
- Notification categories and filtering
- Advanced notification settings and privacy controls
