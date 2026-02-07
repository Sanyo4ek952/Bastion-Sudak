"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
        <select
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isSaving}
        >
          {isSaving ? "Сохраняем..." : "Сохранить"}
        </button>
      </div>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </div>
  );
}
