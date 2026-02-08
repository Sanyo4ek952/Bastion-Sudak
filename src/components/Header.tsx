import Link from "next/link";

import { Button } from "../shared/ui/button";
import { Container } from "../shared/ui/Container";

const navItems = [
  { label: "Номера", href: "/rooms" },
  { label: "Цены", href: "/prices" },
  { label: "Главная", href: "/" },
  { label: "Номера на главной", href: "#rooms" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Локация", href: "#location" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand-100 bg-sand-50/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-900 focus-ring"
        >
          Bastion
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navItems.map((item) =>
            item.href.startsWith("#") ? (
              <a
                key={item.href}
                href={item.href}
                className="text-stone-600 transition duration-150 hover:text-stone-900 focus-ring"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-stone-600 transition duration-150 hover:text-stone-900 focus-ring"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="tel:+79990001122"
            className="hidden text-sm font-semibold text-stone-600 md:inline-flex"
          >
            +7 (999) 000-11-22
          </a>
          <Button asChild size="s" variant="secondary">
            <Link href="/booking">Войти</Link>
          </Button>
          <Button asChild size="s">
            <a href="#lead-form">Бронирование</a>
          </Button>
        </div>
      </Container>
    </header>
  );
}
