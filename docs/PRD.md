# 📘 AAConnect – Product Requirements Document (PRD)

**Version:** 1.2  
**Last Updated:** January 2025

---

## 🔍 Overview

AAConnect is a mobile-first PWA for Asian American Christian Fellowship chapters that centralizes event access, afterevent ride coordination, and apartment availability for spontaneous hangouts. It's designed to reduce planning friction and foster deeper in-community connection.

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

## 👤 User Roles

| Role   | Permissions |
|--------|-------------|
| **Member** | View events, RSVP (via external form), sign up for afterevents, join one apartment, post availability |
| **Admin**  | Create/edit events, manage carpool assignments, manage users, seed apartment list, assign members to apartments |

---

## 🌟 Core Features

### 📆 Event Calendar
- Chronological or calendar view of events
- Each event includes name, date/time, location, description
- RSVP handled via external Google Form
- Admins can create/edit/delete events via admin dashboard

### 🚗 Afterevent Carpool Coordinator
- Members indicate whether they are a driver or need a ride
- Drivers set max passengers
- Riders can select early/late preference
- Algorithm groups cars with considerations:
  - Mix of grades
  - Gender balance
  - Car timing preference
- Admins can edit generated car groupings
- Output is shown in-app (CSV export optional in future)

### 🏠 Apartment Availability Wall
- Admins seed apartment names (e.g. "Treehouse", "The Fridge")
- Members can join one apartment
- Apartment members can post open time slots:
  - Time window (e.g. 2–4pm)
  - Short description ("extra pizza and Smash!")
- Global dashboard shows open/upcoming availability across all apartments
- Admins can manage apartment assignments and remove members

### 🔗 Social Media Links
- Links out to AACF's Instagram, Facebook, YouTube, etc.

### 🔐 Authentication
- Login required via Google OAuth
- No domain restrictions for multi-campus and staff support

### 🛠 Admin Dashboard
- Protected `/admin` route
- CRUD access for events
- Carpool edit UI
- Apartment assignment tools

---

## ✅ User Stories

### Member
- "I want to know when and where our next event is."
- "I need a ride to an afterevent."
- "I want to see which apartments are open to hang."
- "I want to let people know our apartment is open for visitors."

### Admin
- "I want to create and edit upcoming events."
- "I want to generate and adjust carpool groupings."
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
