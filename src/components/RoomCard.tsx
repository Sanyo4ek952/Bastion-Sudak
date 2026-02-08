import Link from "next/link";

import { Badge, H3, Small, Text } from "../shared/ui";
import { Button } from "../shared/ui/button";

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
  const bookingClasses =
    "translate-y-2 opacity-0 transition duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100";

  const bookingAction =
    slug && !isLinkWrapped ? (
      <Button asChild size="s" className={bookingClasses}>
        <Link href={`/rooms/${slug}`} aria-label={`Забронировать ${name}`}>
          Забронировать
        </Link>
      </Button>
    ) : (
      <Button asChild size="s" className={bookingClasses}>
        <span aria-hidden={isLinkWrapped}>Забронировать</span>
      </Button>
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
        <Badge className="absolute left-4 top-4 bg-white/90 text-stone-900">
          {rating.toFixed(1)} ★
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="space-y-2">
          <H3 className="text-lg">{name}</H3>
          <Text className="text-sm text-stone-600">{description}</Text>
          <div className="flex flex-wrap gap-2 text-xs text-stone-600">
            {amenities.map((amenity) => (
              <Badge
                key={amenity}
                className="border-sand-100 bg-sand-50 text-xs normal-case tracking-normal text-stone-600"
              >
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div>
            <Small className="uppercase tracking-[0.2em] text-stone-600">от</Small>
            <Text className="text-lg font-semibold text-stone-900">{price}</Text>
          </div>
          {bookingAction}
        </div>
      </div>
    </article>
  );
}
