import { z } from "zod";

export const quoteQuerySchema = z.object({
  roomId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  board: z.enum(["RO", "BB", "HB"]).optional(),
  occupancy: z.enum(["DBL", "SNGL", "TRPL"]).optional()
});

export const parseQuoteSearchParams = (url: URL) =>
  quoteQuerySchema.safeParse({
    roomId: url.searchParams.get("roomId") ?? "",
    checkIn: url.searchParams.get("checkIn") ?? "",
    checkOut: url.searchParams.get("checkOut") ?? "",
    board: url.searchParams.get("board") ?? undefined,
    occupancy: url.searchParams.get("occupancy") ?? undefined
  });
