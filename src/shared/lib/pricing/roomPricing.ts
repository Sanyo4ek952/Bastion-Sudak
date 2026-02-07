import type { BoardType, RoomType, RoomVariant } from "../../../data/rooms";
import { roomSlugConfig } from "../../../data/rooms";

type RoomSlug = keyof typeof roomSlugConfig;

export const getRoomConfigBySlug = (slug: string) => {
  if (slug in roomSlugConfig) {
    return roomSlugConfig[slug as RoomSlug];
  }
  return undefined;
};

export const getOccupancyByGuests = (guests?: number) => {
  if (!guests || guests <= 1) {
    return "sngl" as const;
  }
  if (guests === 2) {
    return "dbl" as const;
  }
  return "trpl" as const;
};

export const boardDescriptions: Record<BoardType, string> = {
  RO: "без питания",
  BB: "только завтрак",
  HB: "завтрак и ужин включены"
};

export type RoomConfig = {
  roomType: RoomType;
  variant: RoomVariant;
};
