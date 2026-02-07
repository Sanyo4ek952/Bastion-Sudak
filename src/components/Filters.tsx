export function Filters() {
  return (
    <aside className="sticky top-24 hidden h-fit rounded-3xl border border-sand-100 bg-white/90 p-6 shadow-[0_20px_50px_-40px_rgba(43,42,40,0.4)] lg:block">
      <div className="space-y-4">
        <div>
          <p className="text-caption uppercase tracking-[0.2em] text-stone-600">
            Фильтры
          </p>
          <h3 className="mt-2 text-lg">Настройте поиск</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-stone-600">
            <input type="checkbox" className="h-4 w-4" />
            Завтрак включен
          </label>
          <label className="flex items-center gap-3 text-sm text-stone-600">
            <input type="checkbox" className="h-4 w-4" />
            Вид на море
          </label>
          <label className="flex items-center gap-3 text-sm text-stone-600">
            <input type="checkbox" className="h-4 w-4" />
            Можно с питомцами
          </label>
        </div>
        <div className="space-y-2">
          <p className="text-caption uppercase tracking-[0.2em] text-stone-600">
            Цена
          </p>
          <select className="w-full rounded-2xl border border-sand-100 bg-sand-50 px-4 py-3 text-sm text-stone-900 focus-ring">
            <option>Любая</option>
            <option>до 6 000 ₽</option>
            <option>6 000 – 9 000 ₽</option>
            <option>от 9 000 ₽</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
