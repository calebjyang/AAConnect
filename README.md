# AAConnect

**AAConnect** is a modern PWA for AACF chapters, centralizing event discovery, RSVP, and carpool coordination. Built with Next.js, Firebase, and Tailwind CSS, it streamlines community logistics and fosters connection.

---

## 🚦 Project Status & Progress Board

- **See our [MVP Progress Board](https://github.com/users/calebjyang/projects/1/views/7) for real-time status and upcoming features.**

### Latest Status Update (July 2024)

- ✅ **Project Setup:** Next.js, TypeScript, Tailwind, Firebase, CI/CD
- ✅ **Authentication:** Google OAuth via Firebase Auth
- ✅ **Event Calendar:** `/events` route, event list UI (chronological)
- ✅ **Event Details:** Detail sheet/page for each event
- ✅ **Admin Dashboard:** `/admin` route, protected access
- ✅ **Carpool Algorithm:** Rider/driver assignment logic (v1)
- ⏳ **Up Next:**
  - Calendar Toggle (list/calendar views)
  - Admin CRUD for events
  - Carpool Admin UI (drag-and-drop, overflow handling)
  - Social Media Links page
  - Testing & QA (unit, integration, E2E, accessibility)
  - Performance polish (FCP < 1s, PWA install/offline)

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
