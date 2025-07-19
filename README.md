# AAConnect

A Next.js PWA for Asian American Christian Fellowship chapters that centralizes event access, afterevent ride coordination, and apartment availability for spontaneous hangouts.

## Features

- **Authentication**: Google OAuth via Firebase Auth with admin role management
- **Event Management**: Calendar view with event details and Google Calendar integration
- **Carpool Coordination**: Smart assignment algorithm with drag-and-drop admin override
- **Apartment Availability**: Post and discover hangout opportunities with activity tags
- **Admin Dashboard**: Complete management interface for events, carpools, and apartments
- **Mobile-First PWA**: Optimized for mobile devices with native app deployment
- **Cross-Platform**: Works on web, iOS, and Android via Capacitor

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Firebase (Auth, Firestore)
- **Deployment**: Vercel (web), Capacitor (native iOS/Android)
- **UI Components**: Radix UI, Lucide React icons

## Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/calebjyang/AAConnect.git
   cd AAConnect
   npm install
   ```



3. **Development**
   ```bash
   npm run dev          # Web development
   npm run build        # Production build
   npx cap sync ios     # iOS native build
   npx cap open ios     # Open in Xcode
   ```



## Architecture Highlights

### Cross-Platform Firebase Abstraction
- **Unified API**: Single abstraction layer for web and native platforms
- **Automatic Detection**: Platform-specific Firebase SDK selection
- **CORS Resolution**: Native apps use Capacitor Firebase plugins
- **Error Handling**: Robust fallbacks and error management

### Key Components
- **Admin Dashboard**: Protected routes with role-based access
- **Carpool Algorithm**: Location-based optimization with manual override
- **Drag-and-Drop Interface**: @dnd-kit for carpool assignment editing
- **Responsive Design**: Mobile-first with PWA capabilities

## Deployment

### Web (Vercel)
1. Connect repository to Vercel
2. Set environment variables
3. Add Vercel domain to Firebase Auth
4. Automatic deployments on main branch

### Native (iOS/Android)
1. Install Capacitor: `npm install @capacitor/core @capacitor/cli`
2. Add platforms: `npx cap add ios android`
3. Sync assets: `npx cap sync ios`
4. Open in Xcode/Android Studio: `npx cap open ios`

## Development Guidelines

### Code Quality
- **TypeScript**: Strict mode enabled
- **ESLint**: Code style enforcement
- **Testing**: Jest + React Testing Library
- **File Naming**: UI components must be lowercase (Vercel compatibility)

### Best Practices
- Use Firebase abstraction layer (never direct SDK imports)
- Test on all platforms (web, iOS, Android)
- Follow mobile-first responsive design
- Maintain accessibility standards (WCAG 2.2 AA)

## Project Status

### ✅ Completed Features
- Authentication system with admin roles
- Event calendar with Google Calendar integration
- Carpool algorithm with drag-and-drop editing
- Apartment availability wall with activity tags
- Admin dashboard with comprehensive management
- Cross-platform deployment (web, iOS, Android)
- PWA capabilities and mobile optimization

### 🚧 In Progress
- Performance optimization
- Accessibility audit
- Unit test coverage
- Documentation improvements

## Documentation

- **[Product Requirements (PRD)](docs/PRD.md)** - Feature specifications and requirements
- **[Changelog](docs/CHANGELOG.md)** - Version history and updates
- **[Bug Fixes & Lessons](docs/BUGFIXES_LESSONS_LEARNED.md)** - Debugging insights and best practices
- **[Security Guide](docs/SECURITY.md)** - Security considerations and practices

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Run tests: `npm test`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the AACF community**
