import Link from "next/link";

import { LeadForm } from "../features/lead-form/LeadForm";
import { Badge } from "../shared/ui/Badge";
import { buttonVariants } from "../shared/ui/Button";
import { Card } from "../shared/ui/Card";
import { Container } from "../shared/ui/Container";
import { SectionHeader } from "../shared/ui/SectionHeader";

const advantages = [
  {
    title: "10 минут до моря",
    description: "Быстрый выход к пляжу и набережной Судака.",
  },
  {
    title: "Уютные номера",
    description: "Тихие интерьеры, кондиционер и комфортный сон.",
  },
  {
    title: "Гибкие даты",
    description: "Поможем подобрать заезд и выезд под ваш маршрут.",
  },
  {
    title: "Честные цены",
    description: "Прямое бронирование без скрытых комиссий.",
  },
];

const roomPreviews = [
  {
    name: "Стандарт",
    capacity: "2 гостя",
    price: "от 4 900 ₽/ночь",
  },
  {
    name: "Комфорт с балконом",
    capacity: "до 3 гостей",
    price: "от 6 200 ₽/ночь",
  },
  {
    name: "Семейный",
    capacity: "до 4 гостей",
    price: "от 7 800 ₽/ночь",
  },
];

const galleryItems = Array.from({ length: 6 }, (_, index) => index);

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(240,191,111,0.3),transparent_55%)]" />
        <div className="b-shine absolute inset-0 opacity-60" />
        <Container className="relative flex flex-col gap-12">
          <Badge>Hotel Bastion</Badge>
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-6">
              <h1>
                Комфортный отдых в{" "}
                <span className="text-gold">Судаке</span>, где все рядом
              </h1>
              <p className="max-w-xl text-lg text-foreground/80">
                Небольшой отель у моря с камерной атмосферой и вниманием к
                деталям. Оставьте заявку — мы перезвоним и подберем лучший
                вариант проживания.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#lead-form"
                  className={buttonVariants({ size: "lg" })}
                >
                  Оставить заявку
                </a>
                <a
                  href="tel:+79990001122"
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  Позвонить
                </a>
              </div>
              <div className="flex flex-wrap gap-3">
                {["Море в 10 минутах", "Новый ремонт 2025", "Тихий двор"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-gold/50 bg-card px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-header"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Море рядом", "Новый ремонт", "Тихий двор"].map((item) => (
                <Card
                  key={item}
                  className="flex min-h-[130px] flex-col justify-between bg-card/80"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.3em] text-foreground/60">
                      2025
                    </span>
                    <span className="h-10 w-10 rounded-full border border-gold/40 bg-white/60" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">{item}</p>
                </Card>
              ))}
              <Card className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">
                  Локация
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  Судак • прогулка до набережной
                </p>
                <p className="mt-2 text-sm text-foreground/70">
                  Маршруты по Крыму, кафе и достопримечательности в пешей
                  доступности.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      <section id="advantages" className="py-20 sm:py-24">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Преимущества"
            title="Теплый сервис и продуманные детали"
            subtitle="Мы продумали все, чтобы отдых был спокойным: от приятной атмосферы до быстрых ответов менеджера."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {advantages.map((advantage) => (
              <Card key={advantage.title}>
                <div className="flex items-center justify-between">
                  <span className="h-12 w-12 rounded-full border border-gold/40 bg-white/70" />
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle cx="14" cy="14" r="13" stroke="currentColor" />
                    <path
                      d="M9 14.5L12.5 18L19.5 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="b-divider mt-4" aria-hidden="true" />
                <h3 className="mt-4 text-lg">{advantage.title}</h3>
                <p className="mt-2 text-sm">{advantage.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="rooms" className="py-20 sm:py-24">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Номера"
              title="Выберите комфортный формат проживания"
              subtitle="Предпросмотр категорий — подключим реальные номера и цены позже."
            />
            <Link
              href="/rooms"
              className="text-sm font-semibold text-foreground/70 transition hover:text-foreground"
            >
              Смотреть все →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {roomPreviews.map((room) => (
              <Card key={room.name} className="flex h-full flex-col gap-6">
                <div className="h-36 w-full rounded-xl bg-gradient-to-br from-[#FFCD96] via-white to-[#F7D9A9]" />
                <div className="flex flex-1 flex-col gap-3">
                  <div>
                    <div className="b-divider mb-4" aria-hidden="true" />
                    <h3 className="text-lg">{room.name}</h3>
                    <p className="text-sm text-foreground/70">
                      {room.capacity}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm font-semibold text-foreground">
                    <span>{room.price}</span>
                    <span className="text-foreground/50">Фото скоро</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="gallery" className="py-20 sm:py-24">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Галерея"
            title="Атмосфера, которая создает настроение отпуска"
            subtitle="Скоро добавим реальные фото номеров и территории."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <div
                key={item}
                className="b-surface h-44 bg-gradient-to-br from-white via-[#FFF6E3] to-[#F7D9A9]"
              />
            ))}
          </div>
        </Container>
      </section>

      <section id="contacts" className="py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <SectionHeader
            eyebrow="Контакты"
            title="Подскажем детали и поможем с маршрутом"
            subtitle="Свяжитесь с нами удобным способом — ответим в рабочее время."
          />
          <Card className="space-y-4 bg-card/80">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-foreground/60">
                Телефон
              </p>
              <a className="text-lg font-semibold" href="tel:+79990001122">
                +7 (999) 000-11-22
              </a>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-foreground/60">
                Адрес
              </p>
              <p>Судак, рядом с набережной (уточняется)</p>
            </div>
            <a
              className="inline-flex items-center gap-2 text-sm font-semibold text-header transition duration-150 hover:text-header/80"
              href="#"
            >
              Посмотреть на карте
              <span aria-hidden="true">→</span>
            </a>
          </Card>
        </Container>
      </section>

      <section id="lead-form" className="py-20 sm:py-24">
        <Container>
          <Card className="space-y-6 bg-card/90">
            <SectionHeader
              eyebrow="Мы вам перезвоним"
              title="Оставьте заявку на подбор номера"
              subtitle="Уточним детали поездки и предложим лучший вариант размещения."
            />
            <LeadForm />
          </Card>
        </Container>
      </section>
    </>
  );
}
