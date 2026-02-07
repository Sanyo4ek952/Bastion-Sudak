"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SeasonalRateDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }
    setIsDeleting(true);
    try {
      await fetch(`/api/admin/prices/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-xs text-rose-600 hover:text-rose-800 disabled:text-slate-400"
      disabled={isDeleting}
    >
      {isDeleting ? "Удаляем..." : "Удалить"}
    </button>
  );
}
