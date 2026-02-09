const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedRooms = [
  {
    name: "Стандарт с видом на море",
    slug: "standard-sea-view",
    description:
      "Уютный номер с балконом, видом на море и всем необходимым для отдыха вдвоем.",
    capacity: 2,
    basePrice: 4200,
    amenities: ["Балкон", "Вид на море", "Кондиционер", "Wi‑Fi"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
        alt: "Номер стандарт с видом на море"
      },
      {
        url: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353",
        alt: "Интерьер номера"
      }
    ]
  },
  {
    name: "Семейный номер",
    slug: "family-room",
    description:
      "Просторный семейный номер с дополнительным местом и зоной для отдыха.",
    capacity: 4,
    basePrice: 5600,
    amenities: ["Две комнаты", "Мини-кухня", "Детская кровать", "Wi‑Fi"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb512",
        alt: "Семейный номер"
      },
      {
        url: "https://images.unsplash.com/photo-1505691723518-36a5ac3be354",
        alt: "Зона отдыха"
      }
    ]
  },
  {
    name: "Комфорт с террасой",
    slug: "comfort-terrace",
    description:
      "Номер повышенной комфортности с собственной террасой и зоной отдыха.",
    capacity: 3,
    basePrice: 6500,
    amenities: ["Терраса", "Шезлонги", "Кофемашина", "Wi‑Fi"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb513",
        alt: "Комфорт с террасой"
      }
    ]
  }
];

const seedRates = [
  {
    slug: "standard-sea-view",
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-08-31"),
    board: "BB",
    variants: [
      { occupancy: "DBL", price: 5200 },
      { occupancy: "SNGL", price: 4700 },
      { occupancy: "TRPL", price: 0 }
    ]
  },
  {
    slug: "family-room",
    startDate: new Date("2024-07-15"),
    endDate: new Date("2024-08-20"),
    board: "HB",
    variants: [
      { occupancy: "DBL", price: 6900 },
      { occupancy: "SNGL", price: 6400 },
      { occupancy: "TRPL", price: 7900 }
    ]
  }
];

const main = async () => {
  await prisma.roomImage.deleteMany();
  await prisma.seasonalRate.deleteMany();
  await prisma.bookingRequest.deleteMany();
  await prisma.room.deleteMany();

  for (const room of seedRooms) {
    const created = await prisma.room.create({
      data: {
        name: room.name,
        slug: room.slug,
        description: room.description,
        capacity: room.capacity,
        basePrice: room.basePrice,
        amenities: room.amenities,
        images: {
          create: room.images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            sortOrder: index
          }))
        }
      }
    });

    const rate = seedRates.find((item) => item.slug === created.slug);
    if (rate) {
      await prisma.seasonalRate.create({
        data: {
          roomId: created.id,
          startDate: rate.startDate,
          endDate: rate.endDate,
          board: rate.board,
          variants: {
            createMany: {
              data: rate.variants.map((variant) => ({
                occupancy: variant.occupancy,
                price: variant.price
              }))
            }
          }
        }
      });
    }
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
