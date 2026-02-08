"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Select } from "../../shared/ui";

const STATUS_OPTIONS = [
  "NEW",
  "IN_PROGRESS",
  "CONFIRMED",
  "DECLINED",
  "SPAM"
] as const;

type Props = {
  id: string;
  currentStatus: string;
};

export function RequestStatusForm({ id, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.message ?? "Ошибка обновления");
      } else {
        router.refresh();
      }
    } catch (error) {
      setError("Ошибка обновления");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          size="s"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Button
          type="button"
          onClick={handleSave}
          size="s"
          disabled={isSaving}
        >
          {isSaving ? "Сохраняем..." : "Сохранить"}
        </Button>
      </div>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </div>
  );
}
