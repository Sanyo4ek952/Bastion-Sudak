"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { leadFormSchema } from "./schema";
import type { LeadFormValues } from "./types";
import { normalizePhone } from "./utils";

type SubmitStatus = "idle" | "loading" | "success" | "error";

const defaultValues: LeadFormValues = {
  name: "",
  phone: "",
  checkIn: undefined,
  checkOut: undefined,
  guests: undefined,
  comment: "",
  consent: false,
};

export function LeadForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    if (status === "loading") {
      return;
    }

    setStatus("loading");
    setSubmitError(null);

    const payload = {
      ...values,
      phone: normalizePhone(values.phone),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatus("error");
        setSubmitError("Не удалось отправить заявку. Попробуйте еще раз.");
        return;
      }

      const data: { ok?: boolean } = await response.json();

      if (data.ok) {
        setStatus("success");
        reset(defaultValues);
      } else {
        setStatus("error");
        setSubmitError("Не удалось отправить заявку. Попробуйте еще раз.");
      }
    } catch (error) {
      setStatus("error");
      setSubmitError("Не удалось отправить заявку. Попробуйте еще раз.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Имя
          <input
            type="text"
            className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
            placeholder="Анна"
            {...register("name")}
          />
          {errors.name ? (
            <span className="text-xs text-rose-600">{errors.name.message}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Телефон *
          <input
            type="tel"
            className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
            placeholder="+7 (900) 000-00-00"
            {...register("phone")}
          />
          {errors.phone ? (
            <span className="text-xs text-rose-600">{errors.phone.message}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Дата заезда
          <input
            type="date"
            className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
            {...register("checkIn", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
          />
          {errors.checkIn ? (
            <span className="text-xs text-rose-600">{errors.checkIn.message}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Дата выезда
          <input
            type="date"
            className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
            {...register("checkOut", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
          />
          {errors.checkOut ? (
            <span className="text-xs text-rose-600">
              {errors.checkOut.message}
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Гостей
          <input
            type="number"
            min={1}
            max={10}
            className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
            {...register("guests", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {errors.guests ? (
            <span className="text-xs text-rose-600">{errors.guests.message}</span>
          ) : null}
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm text-slate-700">
        Комментарий
        <textarea
          rows={4}
          className="rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm"
          placeholder="Например, нужен номер с видом на море"
          {...register("comment")}
        />
        {errors.comment ? (
          <span className="text-xs text-rose-600">{errors.comment.message}</span>
        ) : null}
      </label>

      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300"
          {...register("consent")}
        />
        <span>
          Я согласен(а) на обработку персональных данных и получение обратного
          звонка
        </span>
      </label>
      {errors.consent ? (
        <span className="text-xs text-rose-600">{errors.consent.message}</span>
      ) : null}

      {submitError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {submitError}
        </div>
      ) : null}

      {status === "success" ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Спасибо! Мы свяжемся с вами в ближайшее время.
        </div>
      ) : null}

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={status === "loading" || isSubmitting}
      >
        {status === "loading" || isSubmitting
          ? "Отправляем..."
          : status === "success"
            ? "Заявка отправлена"
            : "Оставить заявку"}
      </button>
    </form>
  );
}
