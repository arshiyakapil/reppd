import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { RetroNavbar } from "@/components/layout/retro-navbar";
import { SessionProvider } from "@/components/providers/session-provider";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "REPPD - Your Campus Community",
  description: "The ultimate campus social platform connecting students through clubs, events, and vibrant campus life",
  keywords: ["university", "campus", "social media", "students", "community", "college", "clubs", "events"],
  authors: [{ name: "REPPD Team" }],
  creator: "REPPD",
  manifest: "/manifest.json",
  themeColor: "#00ffff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "REPPD"
  },
  openGraph: {
    title: "REPPD - Your Campus Community",
    description: "Connect with your university community, discover events, join clubs, and make lasting friendships",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "REPPD - Your Campus Community",
    description: "The ultimate campus social platform for students",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "REPPD",
    "application-name": "REPPD",
    "msapplication-TileColor": "#00ffff"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <SessionProvider>
          <div className="min-h-screen relative">
            {/* Navigation */}
            <RetroNavbar />

            {/* Main Content */}
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
