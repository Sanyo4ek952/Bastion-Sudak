import Link from "next/link";

import { RoomForm } from "../../../features/admin/RoomForm";
import { prisma } from "../../../shared/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } }
  });

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Admin
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">Номера</h1>
        </div>
        <Link className="text-sm text-slate-500 hover:text-slate-900" href="/">
          ← На главную
        </Link>
      </header>

      <RoomForm mode="create" />

      <div className="grid gap-4 md:grid-cols-2">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              {room.images[0] ? (
                <img
                  src={room.images[0].url}
                  alt={room.images[0].alt ?? room.name}
                  className="h-20 w-24 rounded-2xl object-cover"
                />
              ) : (
                <div className="h-20 w-24 rounded-2xl bg-slate-100" />
              )}
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {room.isActive ? "Активен" : "Скрыт"}
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  {room.name}
                </h2>
                <p className="text-sm text-slate-600">
                  {room.capacity} гостей · {room.basePrice} ₽/ночь
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link
                className="text-slate-600 hover:text-slate-900"
                href={`/rooms/${room.slug}`}
              >
                Открыть на сайте
              </Link>
              <Link
                className="text-slate-600 hover:text-slate-900"
                href={`/admin/rooms/${room.id}`}
              >
                Редактировать →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
