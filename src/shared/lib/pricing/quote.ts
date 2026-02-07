import { prisma } from "../prisma";

const startOfDay = (value: Date) =>
  new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));

const addDays = (value: Date, amount: number) =>
  new Date(value.getTime() + amount * 24 * 60 * 60 * 1000);

export type QuoteResult = {
  nights: number;
  total: number;
  nightly: Array<{ date: string; price: number }>;
  currency: string;
};

export const buildQuote = async (params: {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  board?: "RO" | "BB" | "HB";
  occupancy?: "DBL" | "SNGL" | "TRPL";
}): Promise<QuoteResult> => {
  const board = params.board ?? "RO";
  const occupancy = params.occupancy ?? "DBL";
  const room = await prisma.room.findUnique({
    where: { id: params.roomId },
    select: {
      basePrice: true,
      rates: {
        where: {
          endDate: { gte: params.checkIn },
          startDate: { lte: params.checkOut },
          board
        },
        orderBy: { startDate: "asc" },
        include: { variants: true }
      }
    }
  });

  if (!room) {
    throw new Error("Room not found");
  }

  const start = startOfDay(params.checkIn);
  const end = startOfDay(params.checkOut);
  const nights = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));

  if (nights <= 0) {
    throw new Error("Invalid date range");
  }

  const nightly: Array<{ date: string; price: number }> = [];
  let total = 0;

  for (let offset = 0; offset < nights; offset += 1) {
    const date = addDays(start, offset);
    const match = room.rates.find(
      (rate) => date >= startOfDay(rate.startDate) && date <= startOfDay(rate.endDate)
    );
    const variantPrice = match?.variants.find(
      (variant) => variant.occupancy === occupancy
    )?.price;
    const price = variantPrice && variantPrice > 0 ? variantPrice : room.basePrice;
    nightly.push({ date: date.toISOString().slice(0, 10), price });
    total += price;
  }

  return {
    nights,
    total,
    nightly,
    currency: "RUB"
  };
};
