import { z } from "zod";

import { prisma } from "../../../../../shared/lib/prisma";

const variantSchema = z.object({
  occupancy: z.enum(["DBL", "SNGL", "TRPL"]),
  price: z.number().int().min(0)
});

const payloadSchema = z.object({
  roomId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  board: z.enum(["RO", "BB", "HB"]),
  variants: z
    .array(variantSchema)
    .min(1)
    .refine(
      (items) => new Set(items.map((item) => item.occupancy)).size === items.length,
      { message: "Повторяющиеся типы размещения" }
    )
});

const parseDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    return Response.json(
      { ok: false, message: "Некорректный JSON" },
      { status: 400 }
    );
  }

  const result = payloadSchema.safeParse(payload);
  if (!result.success) {
    return Response.json(
      { ok: false, message: "Ошибка валидации" },
      { status: 400 }
    );
  }

  const startDate = parseDate(result.data.startDate);
  const endDate = parseDate(result.data.endDate);

  if (!startDate || !endDate || endDate < startDate) {
    return Response.json(
      { ok: false, message: "Некорректный диапазон дат" },
      { status: 400 }
    );
  }

  const room = await prisma.room.findUnique({
    where: { id: result.data.roomId },
    select: { id: true }
  });
  if (!room) {
    return Response.json(
      { ok: false, message: "Номер не найден" },
      { status: 400 }
    );
  }

  const overlap = await prisma.seasonalRate.findFirst({
    where: {
      roomId: result.data.roomId,
      id: { not: params.id },
      board: result.data.board,
      startDate: { lte: endDate },
      endDate: { gte: startDate }
    }
  });

  if (overlap) {
    return Response.json(
      { ok: false, message: "Диапазон дат пересекается с существующим тарифом" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const rate = await tx.seasonalRate.update({
        where: { id: params.id },
        data: {
          roomId: result.data.roomId,
          startDate,
          endDate,
          board: result.data.board
        }
      });

      await tx.seasonalRateVariant.deleteMany({
        where: { seasonalRateId: params.id }
      });

      await tx.seasonalRateVariant.createMany({
        data: result.data.variants.map((variant) => ({
          seasonalRateId: params.id,
          occupancy: variant.occupancy,
          price: variant.price
        }))
      });

      return rate;
    });
    return Response.json({ ok: true, id: updated.id });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Не удалось обновить тариф" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.seasonalRate.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Не удалось удалить тариф" },
      { status: 500 }
    );
  }
}
