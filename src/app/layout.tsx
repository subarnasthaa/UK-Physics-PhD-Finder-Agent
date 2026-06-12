import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UK Physics PhD Finder - For Nepali Students",
  description: "Comprehensive guide for Nepali MSc Physics students from Tribhuvan University to find PhD programs in the UK. Explore Russell Group universities, National Facilities, EPSRC/STFC/UKRI scholarships, Commonwealth Scholarships, and get AI-powered assistance.",
  keywords: ["UK", "PhD", "Physics", "EPSRC", "STFC", "UKRI", "Russell Group", "Commonwealth Scholarship", "CSC", "British university", "Nepal", "Tribhuvan University", "study in UK", "IELTS", "doctoral scholarship", "Rutherford Appleton", "National Facility"],
  authors: [{ name: "UK Physics PhD Finder" }],
  openGraph: {
    title: "UK Physics PhD Finder",
    description: "Find your Physics PhD in the UK - Guide for Nepali Physics students with EPSRC, Russell Group, Commonwealth Scholarships",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Physics PhD Finder",
    description: "Find your Physics PhD in the UK - Guide for Nepali Physics students with EPSRC, Russell Group, Commonwealth Scholarships",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
