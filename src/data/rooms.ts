export type BoardType = "RO" | "BB" | "HB";

export type Season = {
  seasonLabel: string;
  board: BoardType;
  prices: {
    seaView?: { dbl: number | null; sngl: number | null };
    surroundingsView?: { dbl: number | null; sngl: number | null };
    terrace?: { dbl: number | null; sngl: number | null };
    noBalcony?: { dbl: number | null; sngl: number | null };
    twoRoom?: { dbl: number | null; sngl?: number | null; trpl?: number | null };
    threeRoom?: { dbl: number | null; sngl: number | null };
    oneRoom?: { dbl: number | null; sngl: number | null };
  };
};

export const standardRooms: Season[] = [
  {
    seasonLabel: "01.01-31.03",
    board: "RO",
    prices: {
      seaView: { dbl: 3000, sngl: 3000 },
      surroundingsView: { dbl: 3000, sngl: 3000 },
      terrace: { dbl: 3000, sngl: 3000 },
      noBalcony: { dbl: 3000, sngl: 3000 },
      twoRoom: { dbl: 0, trpl: 0 }
    }
  },
  {
    seasonLabel: "01.04-19.04",
    board: "BB",
    prices: {
      seaView: { dbl: 4300, sngl: 3800 },
      surroundingsView: { dbl: 4300, sngl: 3800 },
      terrace: { dbl: 4300, sngl: 3800 },
      noBalcony: { dbl: 4300, sngl: 3800 },
      twoRoom: { dbl: 4900, trpl: 5400 }
    }
  }
];

export const luxuryRooms: Season[] = [
  {
    seasonLabel: "01.01-31.03",
    board: "RO",
    prices: {
      twoRoom: { dbl: 4500, sngl: 4500 },
      threeRoom: { dbl: 0, sngl: 0 }
    }
  },
  {
    seasonLabel: "01.04-19.04",
    board: "BB",
    prices: {
      twoRoom: { dbl: 5700, sngl: 5200 },
      threeRoom: { dbl: 6200, sngl: 5700 }
    }
  }
];

export const economyRooms: Season[] = [
  {
    seasonLabel: "01.06-14.06",
    board: "BB",
    prices: {
      twoRoom: { dbl: 4300, trpl: 4800 },
      oneRoom: { dbl: 4300, sngl: 3800 }
    }
  },
  {
    seasonLabel: "15.06-30.06",
    board: "BB",
    prices: {
      twoRoom: { dbl: 0, trpl: 0 },
      oneRoom: { dbl: 0, sngl: 0 }
    }
  },
  {
    seasonLabel: "01.07-14.07",
    board: "BB",
    prices: {
      twoRoom: { dbl: 0, trpl: 0 },
      oneRoom: { dbl: 0, sngl: 0 }
    }
  },
  {
    seasonLabel: "15.07-25.08",
    board: "BB",
    prices: {
      twoRoom: { dbl: 0, trpl: 0 },
      oneRoom: { dbl: 0, sngl: 0 }
    }
  },
  {
    seasonLabel: "26.08-14.09",
    board: "BB",
    prices: {
      twoRoom: { dbl: 0, trpl: 0 },
      oneRoom: { dbl: 0, sngl: 0 }
    }
  }
];

export const roomSlugConfig = {
  "standard-sea-view": { roomType: "standard", variant: "seaView" },
  "family-room": { roomType: "standard", variant: "twoRoom" },
  "comfort-terrace": { roomType: "standard", variant: "terrace" }
} as const;

export type RoomType = "standard" | "luxury" | "economy";
export type RoomVariant = keyof Season["prices"];
