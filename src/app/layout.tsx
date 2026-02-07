import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { buttonVariants } from "../shared/ui/Button";
import { Container } from "../shared/ui/Container";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
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
    <html lang="ru">
      <body
        className={`min-h-screen bg-background text-foreground ${inter.variable} ${playfair.variable}`}
      >
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
          <Container className="flex items-center justify-between py-4">
            <a
              href="/"
              className="text-lg font-semibold uppercase tracking-[0.35em] text-foreground"
            >
              Bastion
            </a>
            <nav className="hidden items-center gap-6 text-sm text-foreground/70 md:flex">
              <a href="#rooms" className="transition hover:text-foreground">
                Номера
              </a>
              <a href="#gallery" className="transition hover:text-foreground">
                Фото
              </a>
              <a href="#contacts" className="transition hover:text-foreground">
                Контакты
              </a>
            </nav>
            <a
              href="#lead-form"
              className={buttonVariants({ size: "sm", className: "hidden md:inline-flex" })}
            >
              Оставить заявку
            </a>
          </Container>
        </header>

        <main className="flex min-h-screen flex-col gap-20 py-12">{children}</main>

        <footer className="border-t border-border bg-background">
          <Container className="grid gap-6 py-10 text-sm text-foreground/70 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">
                Hotel Bastion
              </p>
              <p>Судак, набережная (адрес уточняется)</p>
              <a className="block hover:text-foreground" href="tel:+79990001122">
                +7 (999) 000-11-22
              </a>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Навигация</p>
              <a className="block hover:text-foreground" href="#rooms">
                Номера
              </a>
              <a className="block hover:text-foreground" href="#gallery">
                Галерея
              </a>
              <a className="block hover:text-foreground" href="#contacts">
                Контакты
              </a>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Информация</p>
              <a className="block hover:text-foreground" href="/privacy">
                Политика конфиденциальности
              </a>
              <a className="block hover:text-foreground" href="/admin/requests">
                Admin
              </a>
            </div>
          </Container>
        </footer>
      </body>
    </html>
  );
}
