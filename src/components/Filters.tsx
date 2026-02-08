import { Card, CardContent, Checkbox, H3, Select, Small } from "../shared/ui";

export function Filters() {
  return (
    <aside className="sticky top-24 hidden h-fit lg:block">
      <Card className="shadow-[0_20px_50px_-40px_rgba(43,42,40,0.4)]">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Small className="uppercase tracking-[0.2em] text-stone-600">
                Фильтры
              </Small>
              <H3 className="mt-2 text-lg">Настройте поиск</H3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-stone-600">
                <Checkbox />
                Завтрак включен
              </label>
              <label className="flex items-center gap-3 text-sm text-stone-600">
                <Checkbox />
                Вид на море
              </label>
              <label className="flex items-center gap-3 text-sm text-stone-600">
                <Checkbox />
                Можно с питомцами
              </label>
            </div>
            <div className="space-y-2">
              <Small className="uppercase tracking-[0.2em] text-stone-600">
                Цена
              </Small>
              <Select>
                <option>Любая</option>
                <option>до 6 000 ₽</option>
                <option>6 000 – 9 000 ₽</option>
                <option>от 9 000 ₽</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
