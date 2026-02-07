"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { slugify } from "../../shared/lib/slugify";

type RoomFormProps = {
  mode: "create" | "edit";
  roomId?: string;
  initialValues?: {
    name: string;
    slug: string;
    description: string;
    capacity: number;
    basePrice: number;
    amenities: string[];
    isActive: boolean;
    images: Array<{ url: string; alt: string | null }>;
  };
};

const parseImages = (input: string) =>
  input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [url, alt] = line.split("|").map((value) => value.trim());
      return { url, alt: alt || undefined, sortOrder: index };
    });

const parseAmenities = (input: string) =>
  input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export function RoomForm({ mode, roomId, initialValues }: RoomFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [capacity, setCapacity] = useState(initialValues?.capacity ?? 2);
  const [basePrice, setBasePrice] = useState(initialValues?.basePrice ?? 0);
  const [amenities, setAmenities] = useState(
    initialValues?.amenities?.join("\n") ?? ""
  );
  const [images, setImages] = useState(
    initialValues?.images
      ?.map((image) => `${image.url}${image.alt ? ` | ${image.alt}` : ""}`)
      .join("\n") ?? ""
  );
  const [isActive, setIsActive] = useState(initialValues?.isActive ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  const imagesPreview = useMemo(() => parseImages(images), [images]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      name,
      slug,
      description,
      capacity: Number(capacity),
      basePrice: Number(basePrice),
      amenities: parseAmenities(amenities),
      isActive,
      images: parseImages(images)
    };

    const endpoint =
      mode === "create" ? "/api/admin/rooms" : `/api/admin/rooms/${roomId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.message ?? "Не удалось сохранить номер");
      } else {
        router.refresh();
        if (mode === "create") {
          setName("");
          setSlug("");
          setDescription("");
          setCapacity(2);
          setBasePrice(0);
          setAmenities("");
          setImages("");
          setIsActive(true);
          setSlugTouched(false);
        }
      }
    } catch (error) {
      setError("Не удалось сохранить номер");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Название
            <input
              type="text"
              className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Slug
            <input
              type="text"
              className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
              value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugTouched(true);
              }}
            />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Описание
          <textarea
            rows={4}
            className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Вместимость
            <input
              type="number"
              min={1}
              max={10}
              className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
              value={capacity}
              onChange={(event) => setCapacity(Number(event.target.value))}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Базовая цена (₽/ночь)
            <input
              type="number"
              min={0}
              className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
              value={basePrice}
              onChange={(event) => setBasePrice(Number(event.target.value))}
              required
            />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Удобства (по одному на строку)
          <textarea
            rows={4}
            className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
            value={amenities}
            onChange={(event) => setAmenities(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Изображения (url | alt, по одному на строку)
          <textarea
            rows={4}
            className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
            value={images}
            onChange={(event) => setImages(event.target.value)}
          />
        </label>
        {imagesPreview.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {imagesPreview.map((image) => (
              <div
                key={`${image.url}-${image.sortOrder}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <img
                  src={image.url}
                  alt={image.alt ?? "Room image"}
                  className="h-24 w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
          />
          Активен
        </label>
        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isSaving}
        >
          {isSaving
            ? "Сохраняем..."
            : mode === "create"
              ? "Создать номер"
              : "Сохранить изменения"}
        </button>
      </div>
    </form>
  );
}
