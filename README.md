# AAConnect

A Next.js PWA for Asian American Christian Fellowship chapters that centralizes event access, afterevent ride coordination, and apartment availability for spontaneous hangouts.

<!-- Vercel deployment fix: Updated tsconfig.json and resolved import issues -->

## Features

- **Authentication**: Google OAuth via Firebase Auth
- **Event Management**: Calendar view with event details and RSVP
- **Carpool Coordination**: Smart assignment algorithm with admin override
- **Apartment Availability**: Post and discover hangout opportunities
- **Admin Dashboard**: Complete management interface
- **Mobile-First PWA**: Optimized for mobile devices

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Firebase (Auth, Firestore)
- **Deployment**: Vercel
- **UI Components**: Radix UI, Lucide React icons

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`
5. Build for production: `npm run build`

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Development

- **Code Style**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode
- **Testing**: Jest + React Testing Library (planned)
- **Performance**: Next.js App Router with SSR/SSG

## Deployment

The app is configured for deployment on Vercel with automatic builds from the main branch.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

## 🚦 Project Status & Progress Board

- **See our [MVP Progress Board](https://github.com/users/calebjyang/projects/1/views/7) for real-time status and upcoming features.**

### Latest Status Update (July 6, 2025)

- ✅ **Project Setup:** Next.js, TypeScript, Tailwind, Firebase, CI/CD
- ✅ **Authentication:** Google OAuth via Firebase Auth with admin role management
- ✅ **Landing Page:** Complete PWA-ready homepage with social links and email signup
- ✅ **Event Calendar:** `/events` route with list/calendar view toggle
- ✅ **Event Details:** Comprehensive modal with Google Calendar integration
- ✅ **Admin Dashboard:** `/admin` route with protected access and event management
- ✅ **Carpool Algorithm:** Advanced assignment logic with location-based optimization
- ✅ **Carpool Admin UI:** Sophisticated drag-and-drop interface with @dnd-kit
- ✅ **Apartment Availability Wall:** Members can post and browse open hangout slots for their apartments, with a modern tag selector (Snacks, Games, Study, Yap, Quiet, Prayer), real-time updates, and a clean, mobile-friendly UI.
- ✅ **Code Quality:** ESLint compliance and TypeScript type safety
- ⏳ **Up Next:**
  - Apartment Availability Wall feature
  - Performance optimization (FCP < 1s)
  - Accessibility audit (WCAG 2.2 AA)
  - Cross-device testing and PWA validation
  - Production deployment setup

---

## 📘 Docs

- [Product Requirements Document (PRD)](docs/docs_PRD.md)
- [Changelog](docs/Changelog.md)

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
