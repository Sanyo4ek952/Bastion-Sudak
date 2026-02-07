import Link from "next/link";
import { notFound } from "next/navigation";

import { RoomForm } from "../../../../features/admin/RoomForm";
import { prisma } from "../../../../shared/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminRoomEditPage({
  params
}: {
  params: { id: string };
}) {
  const room = await prisma.room.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { sortOrder: "asc" } } }
  });

  if (!room) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Admin
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Редактировать номер
          </h1>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link className="text-slate-500 hover:text-slate-900" href="/admin/rooms">
            ← К списку номеров
          </Link>
          <Link className="text-slate-500 hover:text-slate-900" href="/">
            На главную
          </Link>
        </div>
      </header>

      <RoomForm
        mode="edit"
        roomId={room.id}
        initialValues={{
          name: room.name,
          slug: room.slug,
          description: room.description ?? "",
          capacity: room.capacity,
          basePrice: room.basePrice,
          amenities: room.amenities,
          isActive: room.isActive,
          images: room.images.map((image) => ({
            url: image.url,
            alt: image.alt
          }))
        }}
      />
    </section>
  );
}
