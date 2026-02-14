import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { MaintenanceSwitcher } from "../components/layout/MaintenanceSwitcher";

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

const IS_MAINTENANCE = process.env.NODE_ENV === "production";

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
          <MaintenanceSwitcher isMaintenance={IS_MAINTENANCE}>
            {children}
          </MaintenanceSwitcher>
        </Providers>
      </body>
    </html>
  );
}
