import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHIMOKITAN // COMING SOON",
  description: "SHIMOKITAN is a district for Japanese culture enthusiasts who document their anime, games, and music as lived memories — not data points. Inspired by the back-alleys of Shimokitazawa, this is where your taste becomes a curated archive of experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-violet-500/30 selection:text-violet-200`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
