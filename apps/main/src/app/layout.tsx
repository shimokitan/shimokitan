import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ComingSoon } from "../components/ComingSoon";
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
  description: "Recalibrating the district conduits.",
};

import { MainLayout } from "../components/layout/MainLayout";
import { MaintenanceLayout } from "../components/layout/MaintenanceLayout";

const IS_MAINTENANCE = true;

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
          {IS_MAINTENANCE ? (
            <MaintenanceLayout>
              <ComingSoon />
            </MaintenanceLayout>
          ) : (
            <MainLayout>{children}</MainLayout>
          )}
        </Providers>
      </body>
    </html>
  );
}
