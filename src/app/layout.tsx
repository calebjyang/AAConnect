import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GlobalNavigation from "@/components/GlobalNavigation";
import PwaServiceWorker from "@/components/PwaServiceWorker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AAConnect - AACF Community Hub",
  description: "Your one-stop hub for AACF events, rides, and community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PwaServiceWorker />
        <ErrorBoundary>
          <GlobalNavigation />
          <main>
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
