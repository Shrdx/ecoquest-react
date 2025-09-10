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
  title: "EcoQuest - Gamified Environmental Education",
  description: "Learn environmental science through quests, badges, and social challenges.",
};

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { UserProvider } from "@/contexts/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full eco-bg text-[#e7f5ef]`}>
        <UserProvider>
          <NavBar />
          <main>{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
