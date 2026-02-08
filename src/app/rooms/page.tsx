import Link from "next/link";
import type { Metadata } from "next";

import { Filters } from "../../components/Filters";
import { RoomCard } from "../../components/RoomCard";
import type { BoardType } from "../../data/rooms";
import { getPriceForDateRange } from "../../shared/lib/pricing/getPriceForDateRange";
import {
  getOccupancyByGuests,
  getRoomConfigBySlug,
  normalizeOccupancyParam
} from "../../shared/lib/pricing/roomPricing";
import { Button, Container, H1, Select, Small, Text } from "../../shared/ui";
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
    occupancy?: "DBL" | "SNGL" | "TRPL";
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
  const occupancy =
    normalizeOccupancyParam(searchParams?.occupancy) ?? getOccupancyByGuests(guests);
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
          <Small className="uppercase tracking-[0.2em] text-stone-600">
            Номера
          </Small>
          <H1>Каталог номеров</H1>
          <Text className="text-body-large text-stone-600">
            Подберите вариант проживания и отправьте запрос на бронирование.
          </Text>
          <Link className="text-sm text-stone-600 hover:text-stone-900" href="/prices">
            Сезонные цены →
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="s">
              Сетка
            </Button>
            <Button variant="secondary" size="s">
              Список
            </Button>
          </div>
          <Select size="s">
            <option>По популярности</option>
            <option>По цене</option>
            <option>По рейтингу</option>
          </Select>
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
                    <Link
                      key={room.id}
                      href={`/rooms/${room.slug}`}
                      className="focus-ring block rounded-3xl"
                    >
                      <RoomCard
                        name={room.name}
                        description={
                          room.description ?? "Описание номера скоро появится."
                        }
                        price={`${selectedPrice ?? room.basePrice} ₽/ночь`}
                        rating={4.8}
                        amenities={room.amenities.slice(0, 3)}
                        imageUrl={image?.url}
                        slug={room.slug}
                        isLinkWrapped
                      />
                    </Link>
                  );
                })}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-stone-600">
          <Link className="hover:text-stone-900" href="/prices">
            Перейти к сезонным ценам →
          </Link>
          <Link className="hover:text-stone-900" href="/">
            ← Вернуться на главную
          </Link>
        </div>
      </Container>
    </section>
  );
}
