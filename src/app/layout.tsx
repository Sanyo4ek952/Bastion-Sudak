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
        <header className="sticky top-0 z-40 border-b border-amber-900/20 bg-header text-gold shadow-[0_10px_30px_-20px_rgba(59,28,0,0.7)]">
          <Container className="flex items-center justify-between py-5">
            <a
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.4em] text-gold"
            >
              Bastion
            </a>
            <nav className="hidden items-center gap-6 text-sm text-gold/80 md:flex">
              <a
                href="#rooms"
                className="transition duration-150 hover:text-gold"
              >
                Номера
              </a>
              <a
                href="#gallery"
                className="transition duration-150 hover:text-gold"
              >
                Фото
              </a>
              <a
                href="#contacts"
                className="transition duration-150 hover:text-gold"
              >
                Контакты
              </a>
            </nav>
            <a
              href="#lead-form"
              className={buttonVariants({
                size: "sm",
                className: "hidden md:inline-flex",
              })}
            >
              Оставить заявку
            </a>
          </Container>
        </header>

        <main className="flex min-h-screen flex-col gap-24 py-16">
          {children}
        </main>

        <footer className="border-t border-amber-900/20 bg-[#F7E3B8]/80">
          <Container className="grid gap-6 py-12 text-sm text-foreground/70 md:grid-cols-3">
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
