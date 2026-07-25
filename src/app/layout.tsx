import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const jbMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jbmono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "NEXORA — торговая площадка для геймеров",
    template: "%s — NEXORA",
  },
  description:
    "NEXORA — маркетплейс игровых ценностей: аккаунты, внутриигровая валюта, буст рейтинга и цифровые товары с гарантией безопасной сделки.",
  keywords: ["маркетплейс", "игры", "аккаунты", "буст", "игровая валюта", "NEXORA"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`${manrope.variable} ${inter.variable} ${jbMono.variable} min-h-screen bg-background font-body text-foreground`}
      >
        <div className="pointer-events-none fixed inset-0 bg-gradient-mesh" />
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            classNames: {
              toast: "glass !text-foreground",
            },
          }}
        />
      </body>
    </html>
  );
}
