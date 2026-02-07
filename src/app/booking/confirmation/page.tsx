import Link from "next/link";

import { Container } from "../../../shared/ui/Container";
import { buttonVariants } from "../../../shared/ui/Button";

export default function BookingConfirmationPage() {
  return (
    <section className="py-16">
      <Container className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sea-500/10">
          <span className="text-3xl text-sea-500">✓</span>
        </div>
        <h1>Бронирование подтверждено</h1>
        <p className="text-body-large text-stone-600">
          Мы отправили детали на вашу почту и свяжемся при необходимости.
        </p>
        <div className="rounded-3xl border border-sand-100 bg-white/90 p-6 text-left text-sm text-stone-600 shadow-[0_16px_40px_-32px_rgba(43,42,40,0.3)]">
          <p className="text-caption uppercase tracking-[0.2em] text-stone-600">
            Ваше бронирование
          </p>
          <p className="mt-2 text-lg font-semibold text-stone-900">
            3 ночи · 2 гостя · 18 600 ₽
          </p>
          <p className="mt-2">Заезд: 12 августа · Выезд: 15 августа</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className={buttonVariants({ size: "s" })}>
            На главную
          </Link>
          <button className={buttonVariants({ variant: "secondary", size: "s" })}>
            Добавить в календарь
          </button>
        </div>
      </Container>
    </section>
  );
}
