import { buildQuote } from "../../../shared/lib/pricing/quote";
import { parseQuoteSearchParams } from "./quoteSchema";

const parseDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = parseQuoteSearchParams(url);

  if (!parsed.success) {
    return Response.json(
      { ok: false, message: "Некорректные параметры запроса" },
      { status: 400 }
    );
  }

  const checkIn = parseDate(parsed.data.checkIn);
  const checkOut = parseDate(parsed.data.checkOut);

  if (!checkIn || !checkOut) {
    return Response.json(
      { ok: false, message: "Некорректный формат дат" },
      { status: 400 }
    );
  }

  try {
    const quote = await buildQuote({
      roomId: parsed.data.roomId,
      checkIn,
      checkOut,
      board: parsed.data.board,
      occupancy: parsed.data.occupancy
    });
    return Response.json({ ok: true, ...quote });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка расчета цены";
    return Response.json({ ok: false, message }, { status: 400 });
  }
}
