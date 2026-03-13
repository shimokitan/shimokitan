import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "../providers";
import { locales, Locale, defaultLocale, getDictionary } from "@shimokitan/utils";

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
  const dict = getDictionary(locale as Locale);
  
  return {
    title: {
      default: "Console // Dashboard // Shimokitan",
      template: "%s // Dashboard // Shimokitan"
    },
    description: "District Governance & System Control",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-rose-500/30 selection:text-rose-200`}
      >
        <Providers>
          <div className="min-h-screen border-x border-zinc-900 max-w-7xl mx-auto bg-black text-white">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
