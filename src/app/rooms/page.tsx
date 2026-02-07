import Link from "next/link";
import type { Metadata } from "next";

import { prisma } from "../../shared/lib/prisma";

export const metadata: Metadata = {
  title: "Номера | Hotel Bastion",
  description: "Каталог номеров Hotel Bastion"
};

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Номера
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Каталог номеров
        </h1>
        <p className="text-base text-slate-600">
          Подберите вариант проживания и отправьте запрос на бронирование.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {rooms.map((room) => {
          const image = room.images[0];
          return (
            <article
              key={room.id}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-56 w-full bg-slate-100">
                {image ? (
                  <img
                    src={image.url}
                    alt={image.alt ?? room.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {room.name}
                  </h2>
                  <p className="text-sm text-slate-600">
                    До {room.capacity} гостей
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    от {room.basePrice} ₽/ночь
                  </span>
                  <Link
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    href={`/rooms/${room.slug}`}
                  >
                    Подробнее →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
