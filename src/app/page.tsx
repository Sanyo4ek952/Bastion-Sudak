import Link from "next/link";

import { LeadForm } from "../features/lead-form/LeadForm";
import { prisma } from "../shared/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  return (
    <main className="flex flex-col gap-16">
      <section className="flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Hotel Bastion
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Комфортный отдых в Судаке
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          Небольшой отель у моря с уютными номерами, гибкими тарифами и
          внимательным сервисом. Оставьте заявку — мы перезвоним и поможем с
          выбором.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#lead-form"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Оставить заявку
          </a>
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Смотреть номера
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Номера
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Подберите вариант размещения
            </h2>
          </div>
          <Link
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
            href="/rooms"
          >
            Все номера →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {rooms.map((room) => {
            const image = room.images[0];
            return (
              <article
                key={room.id}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative h-40 w-full bg-slate-100">
                  {image ? (
                    <img
                      src={image.url}
                      alt={image.alt ?? room.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {room.name}
                    </h3>
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

      <section
        id="lead-form"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Мы вам перезвоним
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Оставьте заявку на подбор номера
          </h2>
          <p className="text-base text-slate-600">
            Уточним детали поездки и предложим лучший вариант размещения.
          </p>
        </div>
        <LeadForm />
      </section>

      <div className="text-xs text-slate-400">
        <a className="hover:text-slate-600" href="/admin/requests">
          Admin
        </a>
      </div>
    </main>
  );
}
