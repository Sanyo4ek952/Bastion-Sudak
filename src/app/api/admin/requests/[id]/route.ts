import { z } from "zod";

import { prisma } from "../../../../../shared/lib/prisma";

const statusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "CONFIRMED", "DECLINED", "SPAM"])
});

export async function PATCH(
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

  const result = statusSchema.safeParse(payload);

  if (!result.success) {
    return Response.json(
      { ok: false, message: "Некорректный статус" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.bookingRequest.update({
      where: { id: params.id },
      data: { status: result.data.status }
    });

    return Response.json({ ok: true, id: updated.id });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Не удалось обновить статус" },
      { status: 500 }
    );
  }
}
