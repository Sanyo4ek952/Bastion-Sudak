import { buttonVariants } from "../shared/ui/Button";

export function SearchBar() {
  return (
    <div className="w-full">
      <div className="hidden rounded-3xl border border-sand-100 bg-white/90 p-4 shadow-[0_20px_50px_-40px_rgba(43,42,40,0.4)] md:block">
        <form className="grid grid-cols-5 items-center gap-4" action="/rooms" method="get">
          <label className="flex flex-col gap-2 text-caption uppercase tracking-[0.2em] text-stone-600">
            Заезд
            <input
              name="checkIn"
              type="date"
              className="rounded-2xl border border-sand-100 bg-sand-50 px-4 py-3 text-base text-stone-900 focus-ring"
            />
          </label>
          <label className="flex flex-col gap-2 text-caption uppercase tracking-[0.2em] text-stone-600">
            Выезд
            <input
              name="checkOut"
              type="date"
              className="rounded-2xl border border-sand-100 bg-sand-50 px-4 py-3 text-base text-stone-900 focus-ring"
            />
          </label>
          <label className="flex flex-col gap-2 text-caption uppercase tracking-[0.2em] text-stone-600">
            Гости
            <select
              name="guests"
              className="rounded-2xl border border-sand-100 bg-sand-50 px-4 py-3 text-base text-stone-900 focus-ring"
            >
              <option value="1">1 взрослый</option>
              <option value="2">2 взрослых</option>
              <option value="3">2 взрослых + 1 ребенок</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-caption uppercase tracking-[0.2em] text-stone-600">
            Питание
            <select
              name="board"
              className="rounded-2xl border border-sand-100 bg-sand-50 px-4 py-3 text-base text-stone-900 focus-ring"
            >
              <option value="RO">RO · без питания</option>
              <option value="BB">BB · завтрак</option>
              <option value="HB">HB · завтрак и ужин</option>
            </select>
          </label>
          <button className={buttonVariants({ size: "l" })} type="submit">
            Найти номер
          </button>
        </form>
      </div>
      <div className="fixed inset-x-4 bottom-4 z-40 rounded-2xl border border-sand-100 bg-white/95 p-3 shadow-[0_16px_40px_-24px_rgba(43,42,40,0.35)] md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-caption uppercase tracking-[0.2em] text-stone-600">
              Поиск
            </p>
            <p className="text-sm font-semibold text-stone-900">
              Даты и гости
            </p>
          </div>
          <button className={buttonVariants({ size: "s" })} type="button">
            Найти
          </button>
        </div>
      </div>
    </div>
  );
}
