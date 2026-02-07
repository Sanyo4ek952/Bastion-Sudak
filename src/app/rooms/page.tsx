import Link from "next/link";
import type { Metadata } from "next";

import { Filters } from "../../components/Filters";
import { RoomCard } from "../../components/RoomCard";
import type { BoardType } from "../../data/rooms";
import { getPriceForDateRange } from "../../shared/lib/pricing/getPriceForDateRange";
import {
  getOccupancyByGuests,
  getRoomConfigBySlug
} from "../../shared/lib/pricing/roomPricing";
import { Container } from "../../shared/ui/Container";
import { prisma } from "../../shared/lib/prisma";

export const metadata: Metadata = {
  title: "Номера | Hotel Bastion",
  description: "Каталог номеров Hotel Bastion"
};

export const dynamic = "force-dynamic";

type RoomsPageProps = {
  searchParams?: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    board?: BoardType;
  };
};

const parseDate = (value?: string) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const checkIn = parseDate(searchParams?.checkIn);
  const checkOut = parseDate(searchParams?.checkOut);
  const guests = searchParams?.guests ? Number(searchParams.guests) : undefined;
  const occupancy = getOccupancyByGuests(guests);
  const board = searchParams?.board;
  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="py-12">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-caption uppercase tracking-[0.2em] text-stone-600">
            Номера
          </p>
          <h1>Каталог номеров</h1>
          <p className="text-body-large text-stone-600">
            Подберите вариант проживания и отправьте запрос на бронирование.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-sand-100 px-4 py-2 text-sm text-stone-600">
              Сетка
            </button>
            <button className="rounded-full border border-sand-100 px-4 py-2 text-sm text-stone-600">
              Список
            </button>
          </div>
          <select className="rounded-2xl border border-sand-100 bg-sand-50 px-4 py-2 text-sm text-stone-900 focus-ring">
            <option>По популярности</option>
            <option>По цене</option>
            <option>По рейтингу</option>
          </select>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Filters />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rooms.length === 0
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="h-[360px] animate-pulse rounded-3xl border border-sand-100 bg-sand-100/70"
                  />
                ))
              : rooms.map((room) => {
                  const image = room.images[0];
                  const config = getRoomConfigBySlug(room.slug);
                  const selectedPrice =
                    config && checkIn && checkOut
                      ? getPriceForDateRange(
                          config.roomType,
                          config.variant,
                          occupancy,
                          checkIn,
                          checkOut,
                          board
                        )
                      : null;
                  return (
                    <RoomCard
                      key={room.id}
                      name={room.name}
                      description={
                        room.description ?? "Описание номера скоро появится."
                      }
                      price={`${selectedPrice ?? room.basePrice} ₽/ночь`}
                      rating={4.8}
                      amenities={room.amenities.slice(0, 3)}
                      imageUrl={image?.url}
                    />
                  );
                })}
          </div>
        </div>

        <Link className="text-sm text-stone-600 hover:text-stone-900" href="/">
          ← Вернуться на главную
        </Link>
      </Container>
    </section>
  );
}
