# AAConnect

**AAConnect** is a modern PWA for AACF chapters, centralizing event discovery, RSVP, and carpool coordination. Built with Next.js, Firebase, and Tailwind CSS, it streamlines community logistics and fosters connection.

---

## 🚦 Project Status & Progress Board

- **See our [MVP Progress Board](https://github.com/users/calebjyang/projects/1/views/7) for real-time status and upcoming features.**

### Latest Status Update (July 4, 2025)

- ✅ **Project Setup:** Next.js, TypeScript, Tailwind, Firebase, CI/CD
- ✅ **Authentication:** Google OAuth via Firebase Auth with admin role management
- ✅ **Landing Page:** Complete PWA-ready homepage with social links and email signup
- ✅ **Event Calendar:** `/events` route with list/calendar view toggle
- ✅ **Event Details:** Comprehensive modal with Google Calendar integration
- ✅ **Admin Dashboard:** `/admin` route with protected access and event management
- ✅ **Carpool Algorithm:** Advanced assignment logic with location-based optimization
- ✅ **Carpool Admin UI:** Sophisticated drag-and-drop interface with @dnd-kit
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
