# 🐛 AAConnect Bug Fixes & Lessons Learned

**Project**: AAConnect MVP - Carpool Management System & Apartment Hosting  
**Technology Stack**: Next.js, React, Firebase, TypeScript, Tailwind CSS, Vercel, Capacitor  
**Last Updated**: July 2025  

---

## 📋 Quick Reference Table

| Bug Type | Severity | Key Lesson | Prevention |
|----------|----------|------------|------------|
| Firebase CORS in Native | 🔴 Critical | Use platform-specific APIs, not web APIs on native | Build abstraction layers early |
| Collection Name Mismatch | 🔴 Critical | Use consistent collection names across app | Use constants for collection names |
| Carpool Hook Restoration | 🟡 High | Don't rewrite working code without testing | Incremental refactoring, preserve working implementations |
| Admin API Routes | 🟡 High | Avoid server-side code for static/native builds | Use client-side checks with Firestore rules |
| Drag-and-Drop State | 🟡 Medium | Deep copy state for drag operations | Use `JSON.parse(JSON.stringify())` for complex state |
| Timezone Handling | 🟡 Medium | Always use UTC for storage, local for display | Use `date-fns` for consistent timezone handling |
| React Hydration | 🟡 Medium | Avoid locale-dependent formatting in SSR | Use deterministic date formatting |

---

## 🔥 Critical Lessons by Category

### **Firebase & Cross-Platform Development**

**🔥 CORS in Native Apps**
- **Problem**: Firebase Web SDK fails on native platforms due to `capacitor://localhost` origin
- **Solution**: Use Capacitor Firebase plugins for native, Web SDK for web
- **Key Code**:
```typescript
const isNativePlatform = () => window.Capacitor?.isNative;
export const getDoc = async (path: string) => {
  if (isNativePlatform()) {
    return await FirebaseFirestore.getDocument({ reference: path });
  } else {
    return await getDoc(doc(getFirestore(), path));
  }
};
```

**🔥 Collection Name Consistency**
- **Problem**: Admin reading from `rideSignups`, public writing to `rides`
- **Solution**: Use same collection names everywhere
- **Prevention**: Use constants for collection names

**🔥 Firebase Auth Domain Configuration**
- **Problem**: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` set to Vercel domain instead of Firebase project domain
- **Solution**: Always use Firebase project domain (e.g., `project.firebaseapp.com`)
- **Prevention**: Never set auth domain to deployment URLs

**🔥 iOS Native Authentication Infinite Loading**
- **Problem**: iOS sign-in button spinning forever, Google popup not appearing due to repeated `FirebaseAuthentication addListener`/`removeListener` cycles
- **Root Cause**: Multiple components using `useAuth` hook directly, creating multiple auth state listeners causing race conditions
- **Solution**: Refactored to global React Context (`AuthProvider`), wrapped app in `<AuthProvider>`, single listener for entire app
- **Key Changes**: Renamed `useAuth.ts` to `useAuth.tsx` with `"use client"` directive, all components consume global auth state
- **Prevention**: Use global context for shared state with listeners, avoid multiple hook instances with subscriptions

### **React State Management**

**🟡 Deep Copy for Drag Operations**
- **Problem**: Drag-and-drop state mutations causing snap-back issues
- **Solution**: Deep copy state before editing
```typescript
const startEditing = () => {
  setEditingAssignments(JSON.parse(JSON.stringify(assignments)));
  setIsEditing(true);
};
```

**🟡 Hydration Mismatches**
- **Problem**: `toLocaleDateString()` causes SSR/client mismatch
- **Solution**: Use `date-fns/format` for deterministic formatting
```typescript
// ❌ toLocaleDateString() - non-deterministic
// ✅ format(date, 'MMM dd, yyyy') - deterministic
```

### **Code Quality & Refactoring**

**🟡 Preserve Working Code**
- **Problem**: Complete rewrite of working `useCarpoolManagement` hook broke functionality
- **Solution**: Restore from git history (`git show 01f1d3d`)
- **Lesson**: Incremental refactoring > complete rewrites

**🟡 Static/Native Compatibility**
- **Problem**: Admin API routes incompatible with static exports
- **Solution**: Move to client-side Firestore checks
```typescript
// ❌ Server-side API route
const response = await fetch('/api/admin/verify');

// ✅ Client-side Firestore check
const adminSnap = await getDoc(doc(db, "admins", user.email));
const isAdmin = adminSnap.exists();
```

### **Data Handling**

**🟡 Timezone Consistency**
- **Problem**: 7-hour timezone shift in apartment availability
- **Solution**: Store dates in UTC, display in local timezone
```typescript
// Store in UTC
const utcDate = new Date().toISOString();

// Display in local
const localDate = format(parseISO(utcDate), 'MMM dd, yyyy');
```

**🟡 Firestore Undefined Fields**
- **Problem**: `undefined` values causing Firestore errors
- **Solution**: Filter out undefined values before saving
```typescript
const cleanData = Object.fromEntries(
  Object.entries(data).filter(([_, value]) => value !== undefined)
);
```

---

## 🚀 Best Practices Checklist

### **Before Deploying**
- [ ] Test on all target platforms (web, iOS, Android)
- [ ] Verify Firebase abstraction layer usage
- [ ] Check for hydration mismatches
- [ ] Validate collection name consistency
- [ ] Test drag-and-drop functionality

### **When Refactoring**
- [ ] Make incremental changes, not complete rewrites
- [ ] Preserve working implementations in separate branches
- [ ] Test all features after changes
- [ ] Use git history to recover lost functionality

### **For Cross-Platform Apps**
- [ ] Build abstraction layers early
- [ ] Use platform-specific APIs when needed
- [ ] Avoid server-side code for static/native builds
- [ ] Test authentication flows on all platforms

---

## 📊 Impact Summary

### **Performance Improvements**
- **Bundle Size**: Reduced by removing `firebase-admin` and API routes
- **Build Time**: Optimized with proper platform detection
- **Runtime**: Improved on native platforms (no CORS overhead)

### **Code Quality**
- **Lint Errors**: Reduced from 23,000+ to 73 warnings
- **Type Safety**: Maintained throughout cross-platform migration
- **Maintainability**: Improved with abstraction layers

### **User Experience**
- **Native Apps**: Full functionality on iOS/Android
- **Admin Dashboard**: All carpool management features working
- **Drag-and-Drop**: Smooth, responsive editing experience

---

## 🔮 Prevention Strategies

1. **Early Platform Planning**: Consider native deployment from day one
2. **Abstraction-First**: Build platform abstractions before specific implementations
3. **Incremental Development**: Small, testable changes over large rewrites
4. **Comprehensive Testing**: Test on all platforms during development
5. **Documentation**: Document platform-specific limitations early

---

**Document Version**: 2.0 (Condensed)  
**Lines**: ~200 (down from 1,300+)  
**Focus**: Actionable lessons and quick reference 