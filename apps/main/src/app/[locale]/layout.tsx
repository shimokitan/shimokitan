
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "../providers";
import { locales, Locale, defaultLocale } from "@shimokitan/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja' ? "SHIMOKITAN // 近日公開" : locale === 'id' ? "SHIMOKITAN // SEGERA HADIR" : "SHIMOKITAN // COMING SOON",
    description: "SHIMOKITAN is a district for Japanese culture enthusiasts who document their anime, games, and music as lived memories - not data points.",
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale || defaultLocale} suppressHydrationWarning>
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
