import Link from "next/link";
import type { Metadata } from "next";

import { prisma } from "../../shared/lib/prisma";
import { boardDescriptions } from "../../shared/lib/pricing/roomPricing";

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
    include: { room: true, variants: true },
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
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <Link className="hover:text-slate-900" href="/rooms">
            ← Вернуться к номерам
          </Link>
          <Link className="hover:text-slate-900" href="/">
            ← На главную
          </Link>
        </div>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Базовые цены</h2>
        <div className="mt-4 grid gap-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex flex-col gap-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <Link
                className="font-medium text-slate-900 hover:underline"
                href={`/rooms/${room.slug}`}
              >
                {room.name}
              </Link>
              <span>от {room.basePrice} ₽/ночь</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Сезонные правила на ближайшие 90 дней
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          BB — завтрак включён, HB — завтрак и ужин.
        </p>
        {upcomingRates.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm text-slate-700">
              <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="pb-3 pr-4">Номер</th>
                  <th className="pb-3 pr-4">Период</th>
                  <th className="pb-3 pr-4">План</th>
                  <th className="pb-3 pr-4">DBL</th>
                  <th className="pb-3 pr-4">SNGL</th>
                  <th className="pb-3">TRPL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingRates.map((rate) => {
                  const getPrice = (occupancy: "DBL" | "SNGL" | "TRPL") =>
                    rate.variants.find((variant) => variant.occupancy === occupancy)
                      ?.price ?? null;
                  const formatValue = (value: number | null) =>
                    value && value > 0 ? `${value} ₽` : "—";
                  const mutedClass = (value: number | null) =>
                    value && value > 0 ? "text-slate-700" : "text-slate-400";
                  const dbl = getPrice("DBL");
                  const sngl = getPrice("SNGL");
                  const trpl = getPrice("TRPL");

                  return (
                    <tr key={rate.id}>
                      <td className="py-3 pr-4 font-medium text-slate-900">
                        <Link
                          className="hover:underline"
                          href={`/rooms/${rate.room.slug}`}
                        >
                          {rate.room.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-4">
                        {formatDate(rate.startDate)} – {formatDate(rate.endDate)}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="font-medium text-slate-900">
                          {rate.board}
                        </div>
                        <div className="text-xs text-slate-400">
                          {boardDescriptions[rate.board]}
                        </div>
                      </td>
                      <td className={`py-3 pr-4 ${mutedClass(dbl)}`}>
                        {formatValue(dbl)}
                      </td>
                      <td className={`py-3 pr-4 ${mutedClass(sngl)}`}>
                        {formatValue(sngl)}
                      </td>
                      <td className={`py-3 ${mutedClass(trpl)}`}>
                        {formatValue(trpl)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
