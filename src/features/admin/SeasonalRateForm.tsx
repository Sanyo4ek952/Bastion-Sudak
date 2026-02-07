"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RateFormProps = {
  mode: "create" | "edit";
  roomId: string;
  rateId?: string;
  startDate: string;
  endDate: string;
  pricePerNight: number;
  onSuccess?: () => void;
};

export function SeasonalRateForm({
  mode,
  roomId,
  rateId,
  startDate,
  endDate,
  pricePerNight,
  onSuccess
}: RateFormProps) {
  const router = useRouter();
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);
  const [price, setPrice] = useState(pricePerNight);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      roomId,
      startDate: start,
      endDate: end,
      pricePerNight: Number(price)
    };

    const endpoint =
      mode === "create" ? "/api/admin/prices" : `/api/admin/prices/${rateId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.message ?? "Не удалось сохранить тариф");
      } else {
        router.refresh();
        onSuccess?.();
        if (mode === "create") {
          setStart("");
          setEnd("");
          setPrice(0);
        }
      }
    } catch (error) {
      setError("Не удалось сохранить тариф");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Начало
          <input
            type="date"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Конец
          <input
            type="date"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Цена/ночь
          <input
            type="number"
            min={0}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            required
          />
        </label>
      </div>
      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        className="inline-flex w-fit items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isSaving}
      >
        {isSaving
          ? "Сохраняем..."
          : mode === "create"
            ? "Добавить тариф"
            : "Сохранить"}
      </button>
    </form>
  );
}
