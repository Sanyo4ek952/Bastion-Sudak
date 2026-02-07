import Link from "next/link";

import { buttonVariants } from "../shared/ui/Button";

export type RoomCardProps = {
  name: string;
  description: string;
  price: string;
  rating: number;
  imageUrl?: string;
  amenities: string[];
  slug?: string;
  isLinkWrapped?: boolean;
};

export function RoomCard({
  name,
  description,
  price,
  rating,
  imageUrl,
  amenities,
  slug,
  isLinkWrapped = false
}: RoomCardProps) {
  const bookingClasses = buttonVariants({
    size: "s",
    className:
      "translate-y-2 opacity-0 transition duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
  });

  const bookingAction =
    slug && !isLinkWrapped ? (
      <Link
        className={bookingClasses}
        href={`/rooms/${slug}`}
        aria-label={`Забронировать ${name}`}
      >
        Забронировать
      </Link>
    ) : (
      <span className={bookingClasses} aria-hidden={isLinkWrapped}>
        Забронировать
      </span>
    );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sand-100 bg-white shadow-[0_20px_60px_-40px_rgba(43,42,40,0.35)] transition duration-150 ease-out hover:-translate-y-1 hover:shadow-[0_28px_70px_-40px_rgba(43,42,40,0.5)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-sand-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition duration-150 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-600">
            Фото скоро
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-900">
          {rating.toFixed(1)} ★
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="space-y-2">
          <h3>{name}</h3>
          <p className="text-sm text-stone-600">{description}</p>
          <div className="flex flex-wrap gap-2 text-xs text-stone-600">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-full border border-sand-100 bg-sand-50 px-3 py-1"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-caption uppercase tracking-[0.2em] text-stone-600">
              от
            </p>
            <p className="text-lg font-semibold text-stone-900">{price}</p>
          </div>
          {bookingAction}
        </div>
      </div>
    </article>
  );
}
