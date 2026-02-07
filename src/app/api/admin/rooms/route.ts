import { z } from "zod";

import { prisma } from "../../../../shared/lib/prisma";
import { slugify } from "../../../../shared/lib/slugify";

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  sortOrder: z.number().int().optional()
});

const roomSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  capacity: z.number().int().min(1).max(10),
  basePrice: z.number().int().min(0),
  amenities: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  images: z.array(imageSchema).optional()
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    return Response.json(
      { ok: false, message: "Некорректный JSON" },
      { status: 400 }
    );
  }

  const result = roomSchema.safeParse(payload);
  if (!result.success) {
    return Response.json(
      { ok: false, message: "Ошибка валидации" },
      { status: 400 }
    );
  }

  const slug = result.data.slug && result.data.slug.length > 0
    ? slugify(result.data.slug)
    : slugify(result.data.name);

  if (!slug) {
    return Response.json(
      { ok: false, message: "Не удалось сгенерировать slug" },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.room.create({
      data: {
        name: result.data.name,
        slug,
        description: result.data.description,
        capacity: result.data.capacity,
        basePrice: result.data.basePrice,
        amenities: result.data.amenities ?? [],
        isActive: result.data.isActive ?? true,
        images: result.data.images?.length
          ? {
              create: result.data.images.map((image, index) => ({
                url: image.url,
                alt: image.alt,
                sortOrder: image.sortOrder ?? index
              }))
            }
          : undefined
      }
    });

    return Response.json({ ok: true, id: created.id });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Не удалось создать номер" },
      { status: 500 }
    );
  }
}
