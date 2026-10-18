import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mini ATS - Applicant Tracking System",
  description: "A modern applicant tracking system to manage your hiring pipeline",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col lg:flex-row bg-gray-50 text-gray-900 font-sans">
        <Suspense fallback={<div className="hidden lg:block w-64 shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0" />}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 min-w-0 max-w-full overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
