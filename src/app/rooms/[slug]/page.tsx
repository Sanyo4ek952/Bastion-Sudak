import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { BoardType, RoomType, Season } from "../../../data/rooms";
import { economyRooms, luxuryRooms, standardRooms } from "../../../data/rooms";
import { ReviewItem } from "../../../components/ReviewItem";
import { RoomGallery } from "../../../components/RoomGallery";
import { RoomBookingWidget } from "../../../features/booking-request/RoomBookingWidget";
import { getPriceForDateRange } from "../../../shared/lib/pricing/getPriceForDateRange";
import {
  boardDescriptions,
  getOccupancyByGuests,
  getRoomConfigBySlug,
  normalizeOccupancyParam
} from "../../../shared/lib/pricing/roomPricing";
import { Container } from "../../../shared/ui/Container";
import { prisma } from "../../../shared/lib/prisma";

type RoomPageProps = {
  params: { slug: string };
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

const demoReviews = [
  {
    name: "Мария",
    rating: 4.9,
    text: "Теплый сервис, быстро решили вопрос с дополнительной кроватью."
  },
  {
    name: "Артем",
    rating: 4.7,
    text: "Хорошая шумоизоляция и удобные матрасы. Рядом кафе и море."
  }
];

const roomSeasonsByType: Record<RoomType, Season[]> = {
  standard: standardRooms,
  luxury: luxuryRooms,
  economy: economyRooms
};

export default async function RoomDetailsPage({
  params,
  searchParams
}: RoomPageProps) {
  const room = await prisma.room.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } }
    }
  });

  if (!room || !room.isActive) {
    notFound();
  }

  const checkIn = parseDate(searchParams?.checkIn);
  const checkOut = parseDate(searchParams?.checkOut);
  const guests = searchParams?.guests ? Number(searchParams.guests) : undefined;
  const occupancy =
    normalizeOccupancyParam(searchParams?.occupancy) ?? getOccupancyByGuests(guests);
  const board = searchParams?.board;
  const roomConfig = getRoomConfigBySlug(room.slug);
  const seasonalPrice =
    roomConfig && checkIn && checkOut
      ? getPriceForDateRange(
          roomConfig.roomType,
          roomConfig.variant,
          occupancy,
          checkIn,
          checkOut,
          board
        )
      : null;
  const seasons = roomConfig ? roomSeasonsByType[roomConfig.roomType] : [];

  return (
    <section className="py-12">
      <Container className="flex flex-col gap-8">
        <Link className="text-sm text-stone-600 hover:text-stone-900" href="/rooms">
          ← Назад к номерам
        </Link>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-caption uppercase tracking-[0.2em] text-stone-600">
                Номер
              </p>
              <h1>{room.name}</h1>
              <p className="mt-2 text-body-large text-stone-600">
                До {room.capacity} гостей · от {seasonalPrice ?? room.basePrice} ₽/ночь
              </p>
            </div>

            <RoomGallery name={room.name} images={room.images} />

            <div className="rounded-3xl border border-sand-100 bg-white/90 p-6 shadow-[0_16px_40px_-32px_rgba(43,42,40,0.35)]">
              <h2 className="text-2xl">Описание</h2>
              <p className="mt-2 text-sm text-stone-600">
                {room.description ?? "Описание номера скоро появится."}
              </p>
            </div>

            <div className="rounded-3xl border border-sand-100 bg-white/90 p-6 shadow-[0_16px_40px_-32px_rgba(43,42,40,0.35)]">
              <h2 className="text-2xl">Удобства</h2>
              {room.amenities.length > 0 ? (
                <ul className="mt-3 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
                  {room.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-sea-500" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-stone-600">Список уточняется.</p>
              )}
            </div>

            {roomConfig ? (
              <div className="rounded-3xl border border-sand-100 bg-white/90 p-6 shadow-[0_16px_40px_-32px_rgba(43,42,40,0.35)]">
                <h2 className="text-2xl">Сезонные цены</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm text-stone-600">
                    <thead className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      <tr>
                        <th className="pb-3 pr-4">Период</th>
                        <th className="pb-3 pr-4">План</th>
                        <th className="pb-3 pr-4">DBL</th>
                        <th className="pb-3 pr-4">SNGL</th>
                        <th className="pb-3">TRPL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100">
                      {seasons.map((season) => {
                        const prices = season.prices[roomConfig.variant];
                        const dbl = prices?.dbl ?? null;
                        const sngl = prices?.sngl ?? null;
                        const trpl =
                          prices && "trpl" in prices ? prices.trpl ?? null : null;
                        const formatValue = (value: number | null | undefined) =>
                          value && value > 0 ? `${value} ₽` : "—";
                        const mutedClass = (value: number | null | undefined) =>
                          value && value > 0 ? "text-stone-700" : "text-stone-400";

                        return (
                          <tr key={`${season.seasonLabel}-${season.board}`}>
                            <td className="py-3 pr-4 font-medium text-stone-700">
                              {season.seasonLabel}
                            </td>
                            <td className="py-3 pr-4">
                              <div className="font-medium text-stone-700">
                                {season.board}
                              </div>
                              <div className="text-xs text-stone-400">
                                {boardDescriptions[season.board]}
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
              </div>
            ) : null}

            <div className="space-y-4">
              <h2 className="text-2xl">Отзывы</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {demoReviews.map((review) => (
                  <ReviewItem key={review.name} {...review} />
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="sticky top-24">
              <RoomBookingWidget roomId={room.id} roomSlug={room.slug} />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
