# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Native iOS Development
```bash
npx cap sync ios     # Sync with iOS native project
npx cap open ios     # Open in Xcode
```

### Running Single Tests
```bash
npm test -- --testNamePattern="test name"
npm test -- src/components/ComponentName.test.tsx
```

## Architecture Overview

### Cross-Platform Firebase Abstraction Layer
The most critical architectural pattern in this codebase is the unified Firebase abstraction that supports both web and native iOS platforms:

**Key Files:**
- `src/lib/firebaseClient.ts` - Platform detection and Firebase app initialization
- `src/lib/auth.ts` - Unified authentication with automatic web/native switching
- `src/lib/firestore.ts` - Cross-platform Firestore operations

**Pattern:** Never import Firebase SDKs directly. Always use the abstraction layer which automatically detects the platform (Capacitor.isNativePlatform()) and uses appropriate APIs:
- Web: Firebase Web SDK
- Native iOS: Capacitor Firebase plugins

### Component Architecture

**Protected Routes Pattern:**
- `ProtectedRoute.tsx` - Wraps components requiring authentication
- `AdminRoute.tsx` - Wraps admin-only components with role verification
- Authentication state managed via `src/lib/useAuth.tsx`

**Error Boundaries:**
- `ErrorBoundary.tsx` - General error handling
- `FirebaseErrorBoundary.tsx` - Firebase-specific error handling
- `LoadingBoundary.tsx` - Loading state management

### Key Business Logic

**Carpool Algorithm (`src/lib/carpoolAlgorithm.ts`):**
- Multi-pass assignment algorithm with location-based optimization
- Grade mixing for community building
- Gender balance prioritization
- Drag-and-drop admin interface with @dnd-kit integration

**Admin Dashboard:**
- Protected `/admin` route with comprehensive CRUD operations
- Advanced drag-and-drop carpool management
- Real-time statistics and CSV export functionality

### UI Component System
Built on Shadcn UI with Radix primitives in `src/components/ui/`. Uses Tailwind CSS with mobile-first responsive design.

## Key Development Patterns

### Firebase Operations
Always use async/await with proper error handling:
```typescript
// Correct - uses abstraction layer
import { authManager } from '@/lib/auth';
const user = await authManager.getCurrentUser();

// Incorrect - direct Firebase import
import { getAuth } from 'firebase/auth'; // Don't do this
```

### File Naming Convention
- UI components must be lowercase for Vercel compatibility
- Use kebab-case for directories: `components/auth-wizard`
- Use PascalCase for component files: `UserProfile.tsx`

### State Management
- Prefer React Server Components over client components
- Use custom hooks for complex state logic (e.g., `useUserApartment.ts`)
- Minimize `'use client'` directives and `useEffect` usage

### Cross-Platform Testing
Test features on both platforms:
1. Web (npm run dev)
2. iOS (npx cap sync ios && npx cap open ios)

## Environment Setup

### Required Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Platform-Specific Configuration
- **Capacitor Config:** `capacitor.config.ts` defines native app settings
- **Firebase Native:** Uses Capacitor Firebase plugins, not Web SDK
- **CORS:** Native iOS bypasses CORS issues through native APIs

## Testing Strategy

### Test Structure
- Jest + React Testing Library setup
- Custom Jest configuration in `jest.config.js`
- Test utilities for mocking Firebase services
- Coverage collection from `src/**/*.{js,jsx,ts,tsx}`

### Critical Test Areas
1. Authentication flow across web and iOS platforms
2. Carpool algorithm with various edge cases
3. Admin drag-and-drop interface
4. Cross-platform Firebase operations
5. Protected route behavior

## Deployment

### Web Deployment (Vercel)
- Automatic deployment on main branch
- Environment variables configured in Vercel dashboard
- Static export configuration for optimal performance

### iOS Deployment
- Build through Xcode after `npx cap sync ios`
- iOS assets and configuration in `ios/` directory
- App Store deployment through Xcode

## Security Considerations

### Authentication & Authorization
- Google OAuth through Firebase Auth
- Admin role verification via Firestore document lookup
- Route protection at component and API level
- No domain restrictions for multi-campus support

### Firestore Security Rules
Located in `firestore.rules` - defines access patterns for collections including events, rides, apartments, and availability slots.

## Performance Optimizations

### Code Splitting
- Dynamic imports for Firebase operations
- Lazy loading of admin components
- Optimized bundle splitting for web deployment

### Mobile Performance
- PWA configuration for mobile installation
- Service worker for offline functionality
- Mobile-first responsive design approach
- Touch-optimized drag-and-drop interfaces

## Common Issues & Solutions

### Platform Detection Issues
If Firebase operations fail on iOS, verify `Capacitor.isNativePlatform()` detection and ensure proper plugin initialization in iOS AppDelegate.

### Carpool Drag-and-Drop Issues
The drag-and-drop system requires careful state management. Reference the CarDroppable and UnassignedDroppable components for proper implementation patterns.

### Authentication Flow Problems
Check that Firebase configuration matches across web and iOS platforms, and verify that auth state listeners are properly cleaned up.

### Build Issues
- Ensure UI components use lowercase filenames
- Verify all Firebase imports go through abstraction layer
- Check that TypeScript strict mode requirements are met

## Project-Specific Guidelines

### Admin Role Management
Admin users are verified by checking if their email ends with '@uci.edu' (see `isUserAdmin` function in `src/lib/auth.ts`). This will be enhanced with proper role-based access control in the future.


### Apartment Availability System
Users can post time slots for hangouts with activity tags (Snacks, Games, Study, Yap, Quiet, Prayer, Jam Sesh). The system handles timezone properly and prevents common date/time input issues.
