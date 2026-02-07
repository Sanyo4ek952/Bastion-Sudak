import type { Metadata } from "next";

import { prisma } from "../../shared/lib/prisma";

export const metadata: Metadata = {
  title: "Цены | Hotel Bastion",
  description: "Базовые цены и сезонные правила Hotel Bastion"
};

export const dynamic = "force-dynamic";

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(value);

export default async function PricesPage() {
  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  const now = new Date();
  const endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const upcomingRates = await prisma.seasonalRate.findMany({
    where: {
      startDate: { lte: endDate },
      endDate: { gte: now }
    },
    include: { room: true },
    orderBy: { startDate: "asc" }
  });

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Цены
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Базовые цены и сезонные правила
        </h1>
        <p className="text-base text-slate-600">
          Итоговая стоимость зависит от выбранных дат и сезонных коэффициентов.
        </p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Базовые цены</h2>
        <div className="mt-4 grid gap-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex flex-col gap-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium text-slate-900">{room.name}</span>
              <span>от {room.basePrice} ₽/ночь</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Сезонные правила на ближайшие 90 дней
        </h2>
        {upcomingRates.length > 0 ? (
          <div className="mt-4 grid gap-3">
            {upcomingRates.map((rate) => (
              <div
                key={rate.id}
                className="flex flex-col gap-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-slate-900">
                  {rate.room.name}
                </span>
                <span>
                  {formatDate(rate.startDate)} – {formatDate(rate.endDate)}
                </span>
                <span>{rate.pricePerNight} ₽/ночь</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Нет активных сезонных правил на ближайшие 90 дней.
          </p>
        )}
      </div>
    </section>
  );
}
