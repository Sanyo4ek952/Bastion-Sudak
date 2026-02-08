"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Field, Input, Select } from "../../shared/ui";

type RateFormProps = {
  mode: "create" | "edit";
  roomId: string;
  rateId?: string;
  startDate: string;
  endDate: string;
  board: "RO" | "BB" | "HB";
  prices: Array<{ occupancy: "DBL" | "SNGL" | "TRPL"; price: number }>;
  onSuccess?: () => void;
};

export function SeasonalRateForm({
  mode,
  roomId,
  rateId,
  startDate,
  endDate,
  board,
  prices,
  onSuccess
}: RateFormProps) {
  const router = useRouter();
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);
  const [selectedBoard, setSelectedBoard] = useState<"RO" | "BB" | "HB">(board);
  const [priceVariants, setPriceVariants] = useState(prices);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePrice = (occupancy: "DBL" | "SNGL" | "TRPL", value: number) => {
    setPriceVariants((prev) =>
      prev.map((variant) =>
        variant.occupancy === occupancy ? { ...variant, price: value } : variant
      )
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const invalidPrice = priceVariants.some((variant) => variant.price < 0);
    if (invalidPrice) {
      setIsSaving(false);
      setError("Цена должна быть не меньше 0");
      return;
    }

    const payload = {
      roomId,
      startDate: start,
      endDate: end,
      board: selectedBoard,
      variants: priceVariants.map((variant) => ({
        occupancy: variant.occupancy,
        price: Number(variant.price)
      }))
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
          setSelectedBoard("RO");
          setPriceVariants([
            { occupancy: "DBL", price: 0 },
            { occupancy: "SNGL", price: 0 },
            { occupancy: "TRPL", price: 0 }
          ]);
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
      <div className="grid gap-3 lg:grid-cols-4">
        <Field label="Начало">
          <Input
            type="date"
            size="s"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            required
          />
        </Field>
        <Field label="Конец">
          <Input
            type="date"
            size="s"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            required
          />
        </Field>
        <Field label="План питания">
          <Select
            size="s"
            value={selectedBoard}
            onChange={(event) =>
              setSelectedBoard(event.target.value as "RO" | "BB" | "HB")
            }
          >
            <option value="RO">RO</option>
            <option value="BB">BB</option>
            <option value="HB">HB</option>
          </Select>
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {priceVariants.map((variant) => (
          <Field key={variant.occupancy} label={variant.occupancy}>
            <Input
              type="number"
              min={0}
              size="s"
              value={variant.price}
              onChange={(event) =>
                updatePrice(variant.occupancy, Number(event.target.value))
              }
              required
            />
          </Field>
        ))}
      </div>
      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      ) : null}
      <Button
        type="submit"
        disabled={isSaving}
        size="s"
        className="w-fit"
      >
        {isSaving
          ? "Сохраняем..."
          : mode === "create"
            ? "Добавить тариф"
            : "Сохранить"}
      </Button>
    </form>
  );
}
