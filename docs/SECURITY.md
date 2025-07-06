# 🔒 Security Guide - AAConnect

## Overview
This document outlines security best practices and procedures for the AAConnect application.

## 🚨 Critical Security Measures

### 1. Environment Variables
- **NEVER** commit `.env` files to version control
- Use `env.example` as a template for required variables
- All Firebase configuration should be in environment variables

### 2. Firebase Admin SDK
- **NEVER** commit Firebase Admin SDK JSON files
- Use environment variables for admin credentials
- Admin operations should only happen server-side

### 3. API Security
- All admin operations go through secure API routes
- Client-side code never has direct admin access
- Use ID tokens for authentication verification

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

#### Server-Side (Private)
```bash
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
```

## 🛡️ Security Checklist

### Before Deployment
- [ ] All environment variables are set
- [ ] No sensitive files in version control
- [ ] Firebase Admin SDK JSON removed from git history
- [ ] Error boundaries implemented
- [ ] API routes properly secured
- [ ] Admin verification uses server-side validation

### Regular Security Reviews
- [ ] Review Firebase security rules monthly
- [ ] Audit admin access quarterly
- [ ] Update dependencies for security patches
- [ ] Monitor Firebase usage and costs

## 🚨 Incident Response

### If Credentials Are Exposed
1. **Immediate Actions:**
   - Rotate Firebase project keys
   - Remove exposed files from git history
   - Update all environment variables
   - Notify team members

2. **Investigation:**
   - Check Firebase console for unauthorized access
   - Review git history for other sensitive files
   - Audit recent deployments

3. **Prevention:**
   - Update security procedures
   - Implement additional safeguards
   - Document lessons learned

## 📞 Security Contacts
- **Firebase Console:** [Firebase Console](https://console.firebase.google.com)
- **Google Cloud Console:** [Cloud Console](https://console.cloud.google.com)
- **Vercel Dashboard:** [Vercel Dashboard](https://vercel.com/dashboard)

## 🔍 Security Monitoring

### Firebase Security Rules
Ensure Firestore security rules are properly configured:
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
  }
}
```

### Deployment Security
- **Vercel Environment Variables**: Secure management of Firebase credentials
- **Preview Deployments**: Test security changes before production
- **Git Integration**: Secure deployment pipeline with automatic security scanning

### Error Logging
- All authentication errors are logged
- Admin verification failures are monitored
- Unusual access patterns are flagged

## 📚 Additional Resources
- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/) 