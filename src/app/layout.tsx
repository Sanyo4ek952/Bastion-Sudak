import "./globals.css";
import type { Metadata } from "next";

import { buttonVariants } from "../shared/ui/Button";
import { Container } from "../shared/ui/Container";

export const metadata: Metadata = {
  title: "Hotel Bastion",
  description: "Hotel Bastion landing page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-background text-foreground">
        <header className="b-shine sticky top-0 z-40 border-b border-gold/40 bg-header text-gold shadow-[0_10px_30px_-20px_rgba(59,28,0,0.7)]">
          <Container className="flex items-center justify-between py-5">
            <a
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.4em] text-gold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-header"
            >
              Bastion
            </a>
            <nav className="hidden items-center gap-6 text-sm text-gold md:flex">
              <a
                href="#rooms"
                className="b-glow transition duration-150 hover:underline hover:underline-offset-4 hover:drop-shadow-[0_0_10px_rgba(240,191,111,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-header"
              >
                Номера
              </a>
              <a
                href="#gallery"
                className="b-glow transition duration-150 hover:underline hover:underline-offset-4 hover:drop-shadow-[0_0_10px_rgba(240,191,111,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-header"
              >
                Фото
              </a>
              <a
                href="#contacts"
                className="b-glow transition duration-150 hover:underline hover:underline-offset-4 hover:drop-shadow-[0_0_10px_rgba(240,191,111,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-header"
              >
                Контакты
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <a
                href="tel:+79990001122"
                className="hidden text-sm font-semibold text-gold/90 transition hover:text-gold md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-header"
              >
                +7 (999) 000-11-22
              </a>
              <a
                href="#lead-form"
                className={buttonVariants({
                  size: "sm",
                  className: "b-glow hidden md:inline-flex",
                })}
              >
                Оставить заявку
              </a>
            </div>
          </Container>
        </header>

        <main className="flex min-h-screen flex-col gap-24 py-16">
          {children}
        </main>

        <footer className="border-t border-gold/40 bg-header text-gold">
          <Container className="grid gap-6 py-12 text-sm text-gold/80 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                Hotel Bastion
              </p>
              <p>Судак, набережная (адрес уточняется)</p>
              <a
                className="block transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-header"
                href="tel:+79990001122"
              >
                +7 (999) 000-11-22
              </a>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gold">Навигация</p>
              <a
                className="block transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-header"
                href="#rooms"
              >
                Номера
              </a>
              <a
                className="block transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-header"
                href="#gallery"
              >
                Галерея
              </a>
              <a
                className="block transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-header"
                href="#contacts"
              >
                Контакты
              </a>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gold">Информация</p>
              <a
                className="block transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-header"
                href="/privacy"
              >
                Политика конфиденциальности
              </a>
              <a
                className="block transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-header"
                href="/admin/requests"
              >
                Admin
              </a>
            </div>
          </Container>
        </footer>
      </body>
    </html>
  );
}
