export type ReviewItemProps = {
  name: string;
  rating: number;
  text: string;
};

export function ReviewItem({ name, rating, text }: ReviewItemProps) {
  return (
    <div className="rounded-3xl border border-sand-100 bg-white/90 p-6 shadow-[0_16px_40px_-32px_rgba(43,42,40,0.35)]">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-stone-900">{name}</p>
        <span className="rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-stone-900">
          {rating.toFixed(1)} ★
        </span>
      </div>
      <p className="mt-3 text-sm text-stone-600">{text}</p>
    </div>
  );
}
