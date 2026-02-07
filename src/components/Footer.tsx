import Link from "next/link";

import { Container } from "../shared/ui/Container";

const socialLinks = [
  { label: "Telegram", href: "https://t.me" },
  { label: "VK", href: "https://vk.com" },
  { label: "Instagram", href: "https://instagram.com" }
];

export function Footer() {
  return (
    <footer className="border-t border-sand-100 bg-sand-50">
      <Container className="grid gap-8 py-12 text-sm md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-600">
            Hotel Bastion
          </p>
          <p className="text-stone-600">Судак, набережная (адрес уточняется)</p>
          <a className="text-stone-900" href="tel:+79990001122">
            +7 (999) 000-11-22
          </a>
        </div>
        <div className="space-y-3">
          <p className="font-semibold text-stone-900">Навигация</p>
          <a className="block text-stone-600 hover:text-stone-900" href="#rooms">
            Номера
          </a>
          <a
            className="block text-stone-600 hover:text-stone-900"
            href="#reviews"
          >
            Отзывы
          </a>
          <a
            className="block text-stone-600 hover:text-stone-900"
            href="#location"
          >
            Локация
          </a>
        </div>
        <div className="space-y-3">
          <p className="font-semibold text-stone-900">Связаться</p>
          <Link className="block text-stone-600 hover:text-stone-900" href="/privacy">
            Политика конфиденциальности
          </Link>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full border border-sand-100 px-3 py-1 text-xs text-stone-600 transition hover:border-sea-500 hover:text-stone-900"
                aria-label={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
