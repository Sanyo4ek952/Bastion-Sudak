import Image from "next/image";

import { ReviewItem } from "../components/ReviewItem";
import { RoomCard } from "../components/RoomCard";
import { SearchBar } from "../components/SearchBar";
import { LeadForm } from "../features/lead-form/LeadForm";
import {
  Badge,
  Card,
  CardContent,
  Container,
  H1,
  SectionHeader,
  Small,
  Text
} from "../shared/ui";

const advantages = [
  {
    title: "10 минут до моря",
    description: "Пешая прогулка до пляжа и набережной Судака."
  },
  {
    title: "Современные номера",
    description: "Свежий ремонт, кондиционер и тихие ночи."
  },
  {
    title: "Гибкие даты",
    description: "Подберем оптимальный заезд под ваш маршрут."
  }
];

const rooms = [
  {
    name: " 1-комнатный стандарт с балконом, вид на море и/или горы",
    description: "Компактный номер для двоих с видом во внутренний двор.",
    price: "4 900 ₽/ночь",
    rating: 4.7,
    amenities: ["Wi‑Fi", "Кондиционер", "Душ"],
    imageUrl: "/images/one-korpus/01.jpg"
  },
  {
    name: "Комфорт с балконом",
    description: "Больше света и воздуха, балкон для вечерних посиделок.",
    price: "6 200 ₽/ночь",
    rating: 4.9,
    amenities: ["Балкон", "Мини-бар", "Кофемашина"],
    imageUrl: "/images/room-2.svg"
  },
  {
    name: "Семейный",
    description: "Просторный формат с дополнительным спальным местом.",
    price: "7 800 ₽/ночь",
    rating: 4.8,
    amenities: ["Терасса", "Диван", "Панорама"],
    imageUrl: "/images/room-3.svg"
  }
];

const reviews = [
  {
    name: "Ирина П.",
    rating: 4.9,
    text: "Очень уютный отель, тихо и чисто. Понравилась близость к набережной."
  },
  {
    name: "Дмитрий К.",
    rating: 4.8,
    text: "Брали номер с балконом, супер вид на закат. Менеджер быстро ответил."
  },
  {
    name: "София А.",
    rating: 5.0,
    text: "Новый ремонт, приятные материалы, и отличная атмосфера отдыха."
  }
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-20">
        <div className="absolute inset-0">
          <Image
            src="/images/bastion.jpg"
            alt="Бастион, Судак"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-stone-900/50" />
        </div>
        <Container className="relative z-10 flex flex-col gap-10">
          <div className="max-w-2xl space-y-6 text-sand-50">
            <Badge className="border-white/40 bg-white/20 text-sand-50">
              Bastion Resort
            </Badge>
            <H1 className="text-sand-50">Современный отдых у моря в Судаке</H1>
            <Text className="text-body-large text-sand-50/90">
              Небольшой курортный отель с камерной атмосферой, в 10 минутах от
              пляжа. Подберем номер под ваш стиль путешествия.
            </Text>
          </div>
          <SearchBar />
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <SectionHeader
            eyebrow="Преимущества"
            title="Все, что нужно для спокойного отпуска"
            subtitle="Собрали ключевые детали, чтобы отдых был комфортным: от приватности до быстрых ответов менеджера."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {advantages.map((advantage) => (
              <Card
                key={advantage.title}
                className="shadow-[0_16px_40px_-32px_rgba(43,42,40,0.3)]"
              >
                <CardContent className="pt-5">
                  <Text className="text-sm font-semibold">
                    {advantage.title}
                  </Text>
                  <Text className="mt-2 text-sm text-stone-600">
                    {advantage.description}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="rooms" className="py-16">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Популярные номера"
            title="Выберите формат размещения"
            subtitle="Каждая категория оснащена современными удобствами и свежим ремонтом."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.name} {...room} />
            ))}
          </div>
        </Container>
      </section>

      <section id="reviews" className="py-16">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Отзывы"
            title="Гости возвращаются снова"
            subtitle="Средняя оценка по отзывам 4.8/5 — спасибо за доверие!"
            align="center"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <ReviewItem key={review.name} {...review} />
            ))}
          </div>
        </Container>
      </section>

      <section id="location" className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <SectionHeader
            eyebrow="Локация"
            title="Центр курортной жизни Судака"
            subtitle="Пляж, кафе и прогулочные маршруты доступны пешком. Мы подскажем лучшие места для отдыха и гастрономии."
          />
          <Card variant="soft" className="shadow-none">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div>
                  <Small className="uppercase tracking-[0.2em] text-stone-600">
                    Адрес
                  </Small>
                  <Text className="text-lg font-semibold text-stone-900">
                    Судак, набережная (уточняется)
                  </Text>
                </div>
                <div className="rounded-2xl bg-white/80 p-4 text-sm text-stone-600">
                  Карта будет доступна после финализации адреса.
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section id="lead-form" className="py-16">
        <Container>
          <Card className="shadow-[0_18px_50px_-36px_rgba(43,42,40,0.4)]">
            <CardContent className="pt-8">
              <SectionHeader
                eyebrow="Мы вам перезвоним"
                title="Оставьте заявку на подбор номера"
                subtitle="Уточним даты, пожелания и предложим лучший вариант проживания."
              />
              <div className="mt-8">
                <LeadForm />
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </>
  );
}
