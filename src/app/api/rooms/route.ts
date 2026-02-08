import { prisma } from "../../../shared/lib/prisma";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        basePrice: true,
        capacity: true
      },
      orderBy: { name: "asc" }
    });

    return Response.json({ ok: true, rooms });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось загрузить номера";
    return Response.json({ ok: false, message }, { status: 500 });
  }
}
