import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ScrollProgress } from "../components/ScrollProgress";
import { StructuredData } from "../components/StructuredData";

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "CS Vertex | Enterprise Software & Hardware Engineering",
    template: "%s | CS Vertex"
  },
  description: "Enterprise AI, IoT networks, custom hardware, and scalable web solutions delivered with zero compromise. Trusted by enterprises, startups, and governments.",
  metadataBase: new URL('https://csvertex.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "CS Vertex | Enterprise Software & Hardware Engineering",
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
    title: "CS Vertex | Enterprise Engineering",
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
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <StructuredData />
      </head>
      <body>
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
