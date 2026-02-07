import Link from "next/link";

import { SeasonalRateDeleteButton } from "../../../features/admin/SeasonalRateDeleteButton";
import { SeasonalRateForm } from "../../../features/admin/SeasonalRateForm";
import { prisma } from "../../../shared/lib/prisma";

export const dynamic = "force-dynamic";

const formatDateInput = (value: Date) => value.toISOString().slice(0, 10);

export default async function AdminPricesPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: "desc" },
    include: { rates: { orderBy: { startDate: "asc" } } }
  });

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Admin
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Сезонные цены
          </h1>
        </div>
        <Link className="text-sm text-slate-500 hover:text-slate-900" href="/">
          ← На главную
        </Link>
      </header>

      <div className="grid gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {room.isActive ? "Активен" : "Скрыт"}
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                {room.name}
              </h2>
              <p className="text-sm text-slate-600">
                Базовая цена: {room.basePrice} ₽/ночь
              </p>
            </div>

            <div className="mt-4">
              <SeasonalRateForm
                mode="create"
                roomId={room.id}
                startDate=""
                endDate=""
                pricePerNight={room.basePrice}
              />
            </div>

            <div className="mt-6 grid gap-4">
              {room.rates.length === 0 ? (
                <p className="text-sm text-slate-600">
                  Сезонных тарифов пока нет.
                </p>
              ) : (
                room.rates.map((rate) => (
                  <div
                    key={rate.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <SeasonalRateForm
                      mode="edit"
                      roomId={room.id}
                      rateId={rate.id}
                      startDate={formatDateInput(rate.startDate)}
                      endDate={formatDateInput(rate.endDate)}
                      pricePerNight={rate.pricePerNight}
                    />
                    <div className="mt-2">
                      <SeasonalRateDeleteButton id={rate.id} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
