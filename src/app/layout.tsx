import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Universal Unit Converter - Convert Length, Weight, Temperature & More",
  description: "Free online unit converter for length, weight, temperature, volume, and area. Convert between meters, feet, celsius, fahrenheit, pounds, kilograms and more. Fast, accurate, and mobile-friendly.",
  keywords: "unit converter, length converter, weight converter, temperature converter, metric conversion, imperial conversion, celsius fahrenheit, meters feet, pounds kilograms",
  authors: [{ name: "Unit Converter Team" }],
  creator: "Unit Converter",
  publisher: "Unit Converter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://unitconverter.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Universal Unit Converter - Convert Units Online",
    description: "Convert between different units of measurement including length, weight, temperature, volume, and area. Perfect for students and professionals.",
    url: 'https://unitconverter.vercel.app',
    siteName: 'Universal Unit Converter',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Universal Unit Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universal Unit Converter - Convert Units Online',
    description: 'Convert between different units of measurement including length, weight, temperature, volume, and area.',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Universal Unit Converter",
              "description": "Free online unit converter for length, weight, temperature, volume, and area conversions",
              "url": "https://unitconverter.vercel.app",
              "applicationCategory": "Utility",
              "operatingSystem": "Web",
              "browserRequirements": "Requires JavaScript",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Unit Converter Team"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}