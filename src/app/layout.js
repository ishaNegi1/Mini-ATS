import { Geist, Geist_Mono } from "next/font/google";
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
      <body className="min-h-full flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
