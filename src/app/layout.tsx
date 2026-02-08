import "./globals.css";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ToastProvider } from "../shared/ui";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter"
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  title: "Hotel Bastion",
  description: "Hotel Bastion landing page"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen">
        <ToastProvider>
          <Header />
          <main className="flex min-h-screen flex-col gap-24 py-12">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
