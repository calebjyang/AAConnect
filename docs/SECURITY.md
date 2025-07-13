# 🔒 Security Guide - AAConnect

## Overview
This document outlines security best practices and procedures for the AAConnect application, including cross-platform deployment considerations for web, iOS, and Android.

## 🚨 Critical Security Measures

### 1. Environment Variables
- **NEVER** commit `.env` files to version control
- Use `env.example` as a template for required variables
- All Firebase configuration should be in environment variables

### 2. Firebase Configuration
- **NEVER** commit Firebase Admin SDK JSON files
- Use environment variables for admin credentials
- Admin operations should only happen server-side
- **Native Platforms**: Ensure `GoogleService-Info.plist` (iOS) and `google-services.json` (Android) are properly configured

### 3. Cross-Platform Security
- **Web Platform**: Uses Firebase Web SDK with standard browser security
- **Native Platforms**: Uses Capacitor Firebase plugins with platform-specific security
- **Unified Security Model**: Same Firestore security rules apply across all platforms
- **No CORS Issues**: Native platforms bypass browser CORS restrictions through platform APIs

### 4. API Security
- All admin operations go through secure client-side Firestore operations
- Client-side code never has direct admin access
- Use ID tokens for authentication verification
- Firestore security rules enforce access control

## 🔐 Environment Setup

### Required Environment Variables

#### Client-Side (NEXT_PUBLIC_*)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Server-Side (Private) - No longer needed for static deployment
```bash
# These are no longer required since we moved to client-side admin verification
# FIREBASE_ADMIN_PROJECT_ID=your_project_id
# FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
# FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
```

### Native Platform Configuration

#### iOS Configuration
- **GoogleService-Info.plist**: Must be added to Xcode project and included in target
- **Firebase Initialization**: Configured in `AppDelegate.swift` using `+load` method
- **Capacitor Plugins**: `@capacitor-firebase/app`, `@capacitor-firebase/firestore`, `@capacitor-firebase/authentication`

#### Android Configuration
- **google-services.json**: Must be placed in `android/app/` directory
- **Capacitor Plugins**: Same Firebase plugins as iOS
- **Build Configuration**: Automatically handled by Capacitor sync

## 🛡️ Security Checklist

### Before Deployment
- [ ] All environment variables are set
- [ ] No sensitive files in version control
- [ ] Firebase Admin SDK JSON removed from git history
- [ ] Error boundaries implemented
- [ ] Firestore security rules properly configured
- [ ] Admin verification uses client-side Firestore queries
- [ ] Cross-platform Firebase abstraction implemented
- [ ] Native platform configuration files properly set up

### For Native Deployment
- [ ] `GoogleService-Info.plist` added to iOS Xcode project
- [ ] `google-services.json` placed in Android app directory
- [ ] Firebase properly initialized in iOS AppDelegate
- [ ] Capacitor Firebase plugins installed and synced
- [ ] Cross-platform Firestore abstraction tested on all platforms

### Regular Security Reviews
- [ ] Review Firebase security rules monthly
- [ ] Audit admin access quarterly
- [ ] Update dependencies for security patches
- [ ] Monitor Firebase usage and costs
- [ ] Remove unused dependencies and legacy/temp code to reduce attack surface
- [ ] Verify import paths after code moves to prevent module resolution errors
- [ ] Test cross-platform security on web, iOS, and Android

## 🚨 Incident Response

### If Credentials Are Exposed
1. **Immediate Actions:**
   - Rotate Firebase project keys
   - Remove exposed files from git history
   - Update all environment variables
   - Notify team members
   - Regenerate native platform configuration files if needed

2. **Investigation:**
   - Check Firebase console for unauthorized access
   - Review git history for other sensitive files
   - Audit recent deployments
   - Test all platforms for security issues

3. **Prevention:**
   - Update security procedures
   - Implement additional safeguards
   - Document lessons learned
   - Review cross-platform security model

## 📞 Security Contacts
- **Firebase Console:** [Firebase Console](https://console.firebase.google.com)
- **Google Cloud Console:** [Cloud Console](https://console.cloud.google.com)
- **Vercel Dashboard:** [Vercel Dashboard](https://vercel.com/dashboard)
- **Capacitor Documentation:** [Capacitor Docs](https://capacitorjs.com/docs)

## 🔍 Security Monitoring

### Firebase Security Rules
Ensure Firestore security rules are properly configured for cross-platform access:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admins collection - only admins can read/write
    match /admins/{email} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == email;
    }
    
    // Events collection - public read, admin write
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
    
    // Rides collection - public read/write for signups, admin full access
    match /rides/{rideId} {
      allow read, write: if true; // Public signup access
      allow delete: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
  }
}
```

### Cross-Platform Security Considerations

#### Web Platform
- **CORS Protection**: Standard browser CORS policies apply
- **Firebase Web SDK**: Uses standard web security model
- **Session Management**: Browser-based session handling

#### Native Platforms (iOS/Android)
- **No CORS Issues**: Platform APIs bypass browser CORS restrictions
- **Capacitor Firebase Plugins**: Use platform-specific security
- **App Store Security**: Additional security through app store review process
- **Device Security**: Leverages device-level security features

### Deployment Security
- **Vercel Environment Variables**: Secure management of Firebase credentials
- **Preview Deployments**: Test security changes before production
- **Git Integration**: Secure deployment pipeline with automatic security scanning
- **Remove unused code**: Regularly remove temp/legacy files and unused dependencies to minimize risk
- **Verify import paths**: Ensure all imports resolve correctly after refactoring or code moves
- **Cross-Platform Testing**: Test security on all target platforms (web, iOS, Android)

### Error Logging
- All authentication errors are logged
- Admin verification failures are monitored
- Unusual access patterns are flagged
- Cross-platform error tracking for native deployments

## 📚 Additional Resources
- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Capacitor Security Best Practices](https://capacitorjs.com/docs/security)
- [iOS App Security](https://developer.apple.com/security/)
- [Android App Security](https://developer.android.com/topic/security) 