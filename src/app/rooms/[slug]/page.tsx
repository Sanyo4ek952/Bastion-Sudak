import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReviewItem } from "../../../components/ReviewItem";
import { RoomGallery } from "../../../components/RoomGallery";
import { RoomBookingWidget } from "../../../features/booking-request/RoomBookingWidget";
import { Container } from "../../../shared/ui/Container";
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
                До {room.capacity} гостей · от {room.basePrice} ₽/ночь
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
              <RoomBookingWidget roomId={room.id} />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
