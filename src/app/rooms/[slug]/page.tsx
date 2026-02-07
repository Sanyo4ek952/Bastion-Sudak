import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RoomBookingWidget } from "../../../features/booking-request/RoomBookingWidget";
import { prisma } from "../../../shared/lib/prisma";

type RoomPageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params
}: RoomPageProps): Promise<Metadata> {
  const room = await prisma.room.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true }
  });

  if (!room) {
    return {
      title: "Номер не найден | Hotel Bastion"
    };
  }

  return {
    title: `${room.name} | Hotel Bastion`,
    description: room.description ?? "Описание номера Hotel Bastion"
  };
}

export const dynamic = "force-dynamic";

export default async function RoomDetailsPage({ params }: RoomPageProps) {
  const room = await prisma.room.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } }
    }
  });

  if (!room || !room.isActive) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-8">
      <Link className="text-sm text-slate-500 hover:text-slate-900" href="/rooms">
        ← Назад к номерам
      </Link>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Номер
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">{room.name}</h1>
            <p className="mt-2 text-sm text-slate-600">
              До {room.capacity} гостей · от {room.basePrice} ₽/ночь
            </p>
          </div>

          {room.images.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {room.images.map((image) => (
                <div
                  key={image.id}
                  className="h-48 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                >
                  <img
                    src={image.url}
                    alt={image.alt ?? room.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Описание</h2>
            <p className="mt-2 text-sm text-slate-600">
              {room.description ?? "Описание номера скоро появится."}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Удобства</h2>
            {room.amenities.length > 0 ? (
              <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                {room.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    {amenity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-600">Список уточняется.</p>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <RoomBookingWidget roomId={room.id} />
        </aside>
      </div>
    </section>
  );
}
