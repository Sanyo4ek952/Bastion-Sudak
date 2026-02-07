"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { leadFormSchema } from "./schema";
import type { LeadFormValues } from "./types";
import { normalizePhone } from "./utils";
import { Button } from "../../shared/ui/Button";

type SubmitStatus = "idle" | "loading" | "success" | "error";

const defaultValues: LeadFormValues = {
  name: "",
  phone: "",
  website: "",
  checkIn: undefined,
  checkOut: undefined,
  guests: undefined,
  comment: "",
  consent: false,
};

export function LeadForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const baseInputClasses =
    "h-11 w-full rounded-2xl border border-sand-100 bg-sand-50 px-3 text-base text-stone-900 shadow-sm transition duration-150 ease-out focus-ring";

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
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="lead-website">Website</label>
          <input
            id="lead-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>
        <div className="flex flex-col gap-2 text-sm font-medium text-stone-600">
          <label htmlFor="lead-name">Имя</label>
          <input
            id="lead-name"
            type="text"
            aria-invalid={Boolean(errors.name)}
            className={[
              baseInputClasses,
              errors.name ? "border-rose-400 focus-visible:ring-rose-200" : "",
            ].join(" ")}
            placeholder="Анна"
            {...register("name")}
          />
          {errors.name ? (
            <span className="text-xs text-rose-600">{errors.name.message}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 text-sm font-medium text-stone-600">
          <label htmlFor="lead-phone">Телефон *</label>
          <input
            id="lead-phone"
            type="tel"
            aria-invalid={Boolean(errors.phone)}
            className={[
              baseInputClasses,
              errors.phone ? "border-rose-400 focus-visible:ring-rose-200" : "",
            ].join(" ")}
            placeholder="+7 (900) 000-00-00"
            {...register("phone")}
          />
          {errors.phone ? (
            <span className="text-xs text-rose-600">{errors.phone.message}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 text-sm font-medium text-stone-600">
          <label htmlFor="lead-checkin">Дата заезда</label>
          <input
            id="lead-checkin"
            type="date"
            aria-invalid={Boolean(errors.checkIn)}
            className={[
              baseInputClasses,
              errors.checkIn
                ? "border-rose-400 focus-visible:ring-rose-200"
                : "",
            ].join(" ")}
            {...register("checkIn", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
          />
          {errors.checkIn ? (
            <span className="text-xs text-rose-600">
              {errors.checkIn.message}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 text-sm font-medium text-stone-600">
          <label htmlFor="lead-checkout">Дата выезда</label>
          <input
            id="lead-checkout"
            type="date"
            aria-invalid={Boolean(errors.checkOut)}
            className={[
              baseInputClasses,
              errors.checkOut
                ? "border-rose-400 focus-visible:ring-rose-200"
                : "",
            ].join(" ")}
            {...register("checkOut", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
          />
          {errors.checkOut ? (
            <span className="text-xs text-rose-600">
              {errors.checkOut.message}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 text-sm font-medium text-stone-600">
          <label htmlFor="lead-guests">Гостей</label>
          <input
            id="lead-guests"
            type="number"
            min={1}
            max={10}
            aria-invalid={Boolean(errors.guests)}
            className={[
              baseInputClasses,
              errors.guests ? "border-rose-400 focus-visible:ring-rose-200" : "",
            ].join(" ")}
            {...register("guests", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {errors.guests ? (
            <span className="text-xs text-rose-600">{errors.guests.message}</span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm font-medium text-stone-600">
        <label htmlFor="lead-comment">Комментарий</label>
        <textarea
          id="lead-comment"
          rows={4}
          aria-invalid={Boolean(errors.comment)}
          className={[
            "min-h-[120px] w-full rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 shadow-sm transition duration-150 ease-out focus-ring",
            errors.comment ? "border-rose-400 focus-visible:ring-rose-200" : ""
          ].join(" ")}
          placeholder="Например, нужен номер с видом на море"
          {...register("comment")}
        />
        {errors.comment ? (
          <span className="text-xs text-rose-600">{errors.comment.message}</span>
        ) : null}
      </div>

      <div className="flex items-start gap-3 text-sm text-stone-600">
        <input
          id="lead-consent"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-sand-100 accent-sea-500 focus-ring"
          {...register("consent")}
        />
        <label htmlFor="lead-consent">
          Я согласен(а) на обработку персональных данных и получение обратного
          звонка
        </label>
      </div>
      {errors.consent ? (
        <span className="text-xs text-rose-600">{errors.consent.message}</span>
      ) : null}

      {submitError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
          {submitError}
        </div>
      ) : null}

      {status === "success" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700">
          Спасибо! Мы свяжемся с вами в ближайшее время.
        </div>
      ) : null}

      <Button type="submit" disabled={status === "loading" || isSubmitting} size="l">
        {status === "loading" || isSubmitting
          ? "Отправляем..."
          : status === "success"
            ? "Заявка отправлена"
            : "Оставить заявку"}
      </Button>
    </form>
  );
}
