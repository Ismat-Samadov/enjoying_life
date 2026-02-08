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
  title: "Enjoying Life - Cultural Concepts Around the World",
  description: "Explore 46+ cultural concepts from around the world that capture the essence of enjoying life, balance, and well-being. Discover untranslatable words that express how different cultures approach happiness.",
  keywords: ["culture", "wellbeing", "happiness", "world", "languages", "concepts", "hygge", "ikigai", "lagom"],
  authors: [{ name: "Enjoying Life" }],
  openGraph: {
    title: "Enjoying Life - Cultural Concepts Around the World",
    description: "Discover how different cultures express joy, balance, and the art of living well through unique, often untranslatable words.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enjoying Life - Cultural Concepts Around the World",
    description: "Explore cultural concepts from around the world on an interactive map",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
