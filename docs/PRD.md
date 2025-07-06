# 📘 AAConnect – Product Requirements Document (PRD)

**Version:** 1.6  
**Last Updated:** January 2025

---

## 🔍 Overview

AAConnect is a mobile-first PWA for Asian American Christian Fellowship chapters that centralizes event access, afterevent ride coordination, and apartment availability for spontaneous hangouts. It's designed to reduce planning friction and foster deeper in-community connection.

---

## 🔐 Authentication System - COMPLETED ✅

The authentication system provides secure access control using Google OAuth via Firebase Auth.

### Features Implemented:
- **Google OAuth Integration**: Seamless sign-in with Google accounts
- **Admin Role Management**: Firestore-based admin verification system
- **Protected Routes**: Automatic redirection for unauthenticated users
- **User Profile Management**: Profile display and sign out functionality
- **Error Handling**: Comprehensive error messages and recovery flows
- **Loading States**: Smooth UX with proper loading indicators
- **Admin-Only Routes**: Specialized protection for admin pages

### Security Features:
- Firebase Auth integration with Google OAuth
- Admin role verification against Firestore database
- Automatic session management and persistence
- Secure route protection with proper redirects

---

## 🏠 Landing Page (v1) - COMPLETED ✅

The landing page serves as the primary entry point for AAConnect, providing users with immediate access to key features and community information.

### Features Implemented:
- **Hero Section**: Welcoming headline with "Welcome to AAConnect 👋" and dual call-to-action buttons
- **Social Media Integration**: Direct links to Instagram, Facebook, Discord, and Linktree
- **Email Subscription**: Community newsletter signup form
- **Quick Actions**: Three main action cards (Events Calendar, Rides, Community)
- **Upcoming Events**: Dynamic display of upcoming events from Firebase
- **Responsive Design**: Mobile-first approach optimized for PWA installation
- **Accessibility**: WCAG 2.2 AA compliant with proper ARIA labels and semantic HTML

### Design Principles:
- Clean, centered card layout for focus
- Consistent color scheme using AACF brand colors
- Clear visual hierarchy and intuitive navigation
- Fast loading with optimized performance

---

## 🚗 Afterevent Carpool Coordinator - COMPLETED ✅

The carpool system provides comprehensive ride coordination for afterevents with both automated assignment and manual admin override capabilities. This feature includes a sophisticated drag-and-drop interface built with @dnd-kit for intuitive manual assignment management.

### Recent Fixes (January 2025):
- **Collection Name Consistency**: Fixed critical bug where admin dashboard wasn't displaying ride signups due to collection name mismatch between public form (`rides`) and admin interface (`rideSignups`)
- **Data Visibility**: Ensured all signups are now visible in admin dashboard, including "Fall Week 1" and other weeks
- **Code Quality**: Improved import consistency and reduced bundle size

### Features Implemented:
- **Member Signup Form**: Easy-to-use form for drivers and riders to sign up
- **Smart Assignment Algorithm**: Automatic carpool assignment with location-based optimization
- **Admin Dashboard**: Complete management interface for ride coordination
- **Advanced Drag-and-Drop Interface**: Intuitive drag-and-drop editing for admins to manually adjust assignments
- **Real-time Statistics**: Live assignment metrics and success rates
- **Export Functionality**: CSV export for assignments and raw data
- **Capacity Management**: Visual indicators for full cars and overflow handling
- **Week-based Organization**: Filter and manage assignments by afterevent week
- **Custom Drag Preview**: Optimized drag overlay with exact styling matching original cards
- **Multi-Container Support**: Drag between cars, unassigned area, and empty containers
- **Fallback Logic**: Graceful handling of invalid drop zones with automatic reversion

### Algorithm Features:
- **Location Optimization**: Prioritizes exact location matches, then location groups
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

### Technical Implementation:
- **@dnd-kit Integration**: Modern drag-and-drop library with accessibility support
- **Multi-Container Architecture**: Separate droppable zones for each car and unassigned area
- **Custom Components**: CarDroppable and UnassignedDroppable components for clean separation
- **State Management**: Optimistic updates with fallback error handling
- **Performance Optimized**: Efficient re-rendering and minimal DOM manipulation
- **Accessibility Compliant**: Full keyboard navigation and screen reader support

### Bug Fixes & Optimizations:
- **Snap-back Issue**: Resolved by removing SortableContext for multi-container operations
- **Drag Preview Styling**: Fixed oversized/distorted preview with custom DragOverlay
- **Height Consistency**: Maintained consistent card dimensions during drag operations
- **Duplicate Previews**: Eliminated by hiding original elements during drag
- **Invalid Drop Handling**: Added fallback logic to revert moves when dropped outside valid zones
- **Empty Container Support**: Ensured all containers are registered as droppable zones
- **React Hooks Compliance**: Fixed Rules of Hooks violations by extracting droppable logic

---

## 👤 User Roles

| Role   | Permissions |
|--------|-------------|
| **Member** | View events, RSVP (via external form), sign up for afterevents, join one apartment, post availability |
| **Admin**  | Create/edit events, manage carpool assignments, manage users, seed apartment list, assign members to apartments |

---

## 🌟 Core Features

### 📆 Event Calendar - COMPLETED ✅
- Chronological or calendar view of events
- Each event includes name, date/time, location, description
- RSVP handled via external Google Form
- Admins can create/edit/delete events via admin dashboard
- **List and Calendar View Toggle**: Users can switch between chronological and calendar layouts
- **Event Detail Modal**: Comprehensive event information with Google Calendar integration
- **Past Events Display**: Historical event viewing with visual distinction

### 🚗 Afterevent Carpool Coordinator - COMPLETED ✅
- Members indicate whether they are a driver or need a ride
- Drivers set max passengers
- Riders can select early/late preference
- Algorithm groups cars with considerations:
  - Mix of grades
  - Gender balance
  - Car timing preference
- **Advanced Drag-and-Drop Admin Interface**: Intuitive manual assignment editing
- **Multi-Container Drag Support**: Drag between cars, unassigned area, and empty containers
- **Custom Drag Preview**: Professional drag overlay with exact styling
- **Capacity Validation**: Real-time validation prevents overloading vehicles
- **Fallback Error Handling**: Graceful handling of invalid operations
- Output is shown in-app with CSV export functionality

### 🏠 Apartment Availability Wall
- Admins seed apartment names (e.g. "Treehouse", "The Fridge")
- Members can join one apartment
- Apartment members can post open time slots:
  - Time window (e.g. 2–4pm)
  - Short description ("extra pizza and Smash!")
- Global dashboard shows open/upcoming availability across all apartments
- Admins can manage apartment assignments and remove members

### 🔗 Social Media Links - COMPLETED ✅
- Links out to AACF's Instagram, Facebook, YouTube, etc.

### 🔐 Authentication - COMPLETED ✅
- Login required via Google OAuth
- No domain restrictions for multi-campus and staff support

### 🛠 Admin Dashboard - COMPLETED ✅
- Protected `/admin` route
- CRUD access for events
- **Advanced Carpool Management**: Drag-and-drop interface with real-time validation
- **Assignment Statistics**: Live metrics and success rates
- **Export Functionality**: CSV export for assignments and raw data
- Apartment assignment tools

---

## ✅ User Stories

### Member
- "I want to know when and where our next event is." ✅
- "I need a ride to an afterevent." ✅
- "I want to see which apartments are open to hang."
- "I want to let people know our apartment is open for visitors."

### Admin
- "I want to create and edit upcoming events." ✅
- "I want to generate and adjust carpool groupings with an intuitive interface." ✅
- "I want to manually override algorithm assignments when needed." ✅
- "I want to see real-time statistics on assignment success." ✅
- "I want to export carpool data for external communication." ✅
- "I want to manage apartment membership."
- "I want to keep the hangout wall clean and up-to-date."

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

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **@dnd-kit**: Modern drag-and-drop library
- **Firebase SDK**: Real-time database integration

### Backend
- **Firebase Auth**: Google OAuth authentication
- **Firestore**: NoSQL database for events and user data
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
