"use client";

import { useMemo, useState } from "react";

import { buttonVariants } from "../shared/ui/Button";
import { Stepper } from "./Stepper";

const steps = ["Даты", "Гости", "Услуги", "Оплата"];

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [nights, setNights] = useState(3);
  const [guests, setGuests] = useState(2);
  const [extras, setExtras] = useState({ breakfast: true, transfer: false });

  const total = useMemo(() => {
    const base = nights * 6200;
    const extraBreakfast = extras.breakfast ? nights * 700 : 0;
    const transfer = extras.transfer ? 1200 : 0;
    return base + extraBreakfast + transfer;
  }, [nights, extras]);

  return (
    <div className="space-y-8">
      <Stepper steps={steps} currentStep={step} />

      <div className="rounded-3xl border border-sand-100 bg-white/90 p-6 shadow-[0_16px_40px_-32px_rgba(43,42,40,0.35)]">
        {step === 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-stone-600">
              Заезд
              <input
                type="date"
                className="rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 focus-ring"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-stone-600">
              Выезд
              <input
                type="date"
                className="rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 focus-ring"
                onChange={(event) => setNights(event.target.value ? 4 : 3)}
              />
            </label>
          </div>
        ) : null}

        {step === 1 ? (
          <label className="flex flex-col gap-2 text-sm text-stone-600">
            Гостей
            <input
              type="number"
              min={1}
              max={6}
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
              className="rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 focus-ring"
            />
          </label>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={extras.breakfast}
                onChange={(event) =>
                  setExtras((prev) => ({ ...prev, breakfast: event.target.checked }))
                }
                className="h-4 w-4 rounded border-sand-100 accent-sea-500"
              />
              Завтрак (+700 ₽/ночь)
            </label>
            <label className="flex items-center gap-3 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={extras.transfer}
                onChange={(event) =>
                  setExtras((prev) => ({ ...prev, transfer: event.target.checked }))
                }
                className="h-4 w-4 rounded border-sand-100 accent-sea-500"
              />
              Трансфер (+1 200 ₽)
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <p className="text-sm text-stone-600">
              Оплата будет подтверждена менеджером. Мы свяжемся для уточнения
              деталей.
            </p>
            <button className={buttonVariants({ size: "l" })} type="button">
              Отправить заявку
            </button>
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-sand-100 bg-sand-100/70 p-6">
        <p className="text-caption uppercase tracking-[0.2em] text-stone-600">
          Итого
        </p>
        <p className="mt-2 text-2xl font-semibold text-stone-900">
          {total.toLocaleString("ru-RU")} ₽
        </p>
        <p className="mt-1 text-sm text-stone-600">
          {nights} ночи · {guests} гостей
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={buttonVariants({ variant: "secondary", size: "s" })}
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          disabled={step === 0}
        >
          Назад
        </button>
        <button
          type="button"
          className={buttonVariants({ size: "s" })}
          onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}
          disabled={step === steps.length - 1}
        >
          Далее
        </button>
      </div>
    </div>
  );
}
