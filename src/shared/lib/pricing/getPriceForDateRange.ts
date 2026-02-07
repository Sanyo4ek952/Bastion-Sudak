import type { BoardType, RoomType, RoomVariant, Season } from "../../../data/rooms";
import { economyRooms, luxuryRooms, standardRooms } from "../../../data/rooms";

const roomSeasonMap: Record<RoomType, Season[]> = {
  standard: standardRooms,
  luxury: luxuryRooms,
  economy: economyRooms
};

const parseSeasonLabel = (label: string, year: number) => {
  const [startLabel, endLabel] = label.split("-");
  if (!startLabel || !endLabel) {
    return null;
  }
  const [startDay, startMonth] = startLabel.split(".").map(Number);
  const [endDay, endMonth] = endLabel.split(".").map(Number);
  if (!startDay || !startMonth || !endDay || !endMonth) {
    return null;
  }
  const start = new Date(Date.UTC(year, startMonth - 1, startDay));
  const end = new Date(Date.UTC(year, endMonth - 1, endDay));
  return { start, end };
};

const normalizeDate = (value: Date) =>
  new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));

export const getPriceForDateRange = (
  roomType: RoomType,
  variant: RoomVariant,
  occupancy: "dbl" | "sngl" | "trpl",
  checkIn: Date,
  checkOut: Date,
  board?: BoardType
): number | null => {
  const seasons = roomSeasonMap[roomType];
  const normalizedCheckIn = normalizeDate(checkIn);
  const normalizedCheckOut = normalizeDate(checkOut);

  if (normalizedCheckOut <= normalizedCheckIn) {
    throw new Error("Invalid date range");
  }

  const year = normalizedCheckIn.getUTCFullYear();

  const season = seasons.find((entry) => {
    const range = parseSeasonLabel(entry.seasonLabel, year);
    if (!range) {
      return false;
    }
    if (board && entry.board !== board) {
      return false;
    }
    return normalizedCheckIn >= range.start && normalizedCheckIn <= range.end;
  });

  if (!season) {
    return null;
  }

  const variantPricing = season.prices[variant];
  if (!variantPricing) {
    return null;
  }

  const price = variantPricing[occupancy as keyof typeof variantPricing];
  if (price === null || price === undefined || price === 0) {
    return null;
  }

  return price;
};
