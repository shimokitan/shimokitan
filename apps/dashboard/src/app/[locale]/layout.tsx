import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "../providers";
import { locales, Locale, defaultLocale, getDictionary } from "@shimokitan/utils";
import Sidebar from "@/components/Sidebar";
import { ensureUserSync } from "./auth-helpers";
import { Toaster } from "sonner";

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
  const user = await ensureUserSync();

  return (
    <html lang={locale || defaultLocale} suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-rose-500/30 selection:text-rose-200 bg-black text-white`}
      >
        <Providers>
          <div className="flex h-screen overflow-hidden">
            {user && <Sidebar user={user} />}
            <main className="flex-1 overflow-y-auto bg-black relative">
              {/* Subtle Ambient Background */}
              <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
                  <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-900/40 blur-[120px] rounded-full" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-900/30 blur-[100px] rounded-full" />
              </div>
              
              <div className="relative z-10 p-8 max-w-[1600px] mx-auto min-h-full">
                {children}
              </div>
            </main>
          </div>
          <Toaster position="top-right" theme="dark" closeButton />
        </Providers>
      </body>
    </html>
  );
}
