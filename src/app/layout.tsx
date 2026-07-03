import type { Metadata, Viewport } from "next";
import { Manrope, DM_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ScrollProgress } from "../components/ScrollProgress";
import { StructuredData } from "../components/StructuredData";
import { PremiumLoader } from "../components/PremiumLoader";
import { FloatingActions } from "../components/FloatingActions";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--sans",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "CS Vertex | Enterprise Software, AI, IoT & Embedded Solutions",
    template: "%s | CS Vertex"
  },
  description: "Enterprise AI, IoT networks, custom hardware, and scalable web solutions delivered with zero compromise. Trusted by enterprises, startups, and governments.",
  metadataBase: new URL('https://csvertex.com'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "CS Vertex | Enterprise Software, AI, IoT & Embedded Solutions",
    description: "Enterprise AI, IoT networks, custom hardware, and scalable web solutions delivered with zero compromise.",
    url: "https://csvertex.com",
    siteName: "CS Vertex",
    images: [
      {
        url: "/assets/logo/csvertex-logo.png",
        width: 800,
        height: 600,
        alt: "CS Vertex Logo"
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CS Vertex | Enterprise Software, AI, IoT & Embedded Solutions",
    description: "Enterprise AI, IoT networks, custom hardware, and scalable web solutions.",
    images: ["/assets/logo/csvertex-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmMono.variable}`} style={{ scrollBehavior: 'smooth' }} suppressHydrationWarning>
      <head>
        <StructuredData />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/assets/vertex-hero.png" />
        <link rel="preload" as="image" href="/logo-nav.png" />
        
      </head>
      <body>
        <PremiumLoader />
        <ScrollProgress />
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
