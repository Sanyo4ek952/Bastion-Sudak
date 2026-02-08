"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { leadFormSchema } from "./schema";
import type { LeadFormValues } from "./types";
import { normalizePhone } from "./utils";
import { Button, Checkbox, Field, Input, Textarea } from "../../shared/ui";

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
          <Input
            id="lead-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>
        <Field
          label="Имя"
          htmlFor="lead-name"
          error={errors.name?.message}
        >
          <Input
            id="lead-name"
            type="text"
            placeholder="Анна"
            invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </Field>

        <Field
          label="Телефон"
          htmlFor="lead-phone"
          required
          error={errors.phone?.message}
        >
          <Input
            id="lead-phone"
            type="tel"
            placeholder="+7 (900) 000-00-00"
            invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
        </Field>

        <Field
          label="Дата заезда"
          htmlFor="lead-checkin"
          error={errors.checkIn?.message}
        >
          <Input
            id="lead-checkin"
            type="date"
            invalid={Boolean(errors.checkIn)}
            {...register("checkIn", {
              setValueAs: (value) => (value === "" ? undefined : value)
            })}
          />
        </Field>

        <Field
          label="Дата выезда"
          htmlFor="lead-checkout"
          error={errors.checkOut?.message}
        >
          <Input
            id="lead-checkout"
            type="date"
            invalid={Boolean(errors.checkOut)}
            {...register("checkOut", {
              setValueAs: (value) => (value === "" ? undefined : value)
            })}
          />
        </Field>

        <Field
          label="Гостей"
          htmlFor="lead-guests"
          error={errors.guests?.message}
        >
          <Input
            id="lead-guests"
            type="number"
            min={1}
            max={10}
            invalid={Boolean(errors.guests)}
            {...register("guests", {
              setValueAs: (value) => (value === "" ? undefined : Number(value))
            })}
          />
        </Field>
      </div>

      <Field
        label="Комментарий"
        htmlFor="lead-comment"
        error={errors.comment?.message}
      >
        <Textarea
          id="lead-comment"
          rows={4}
          placeholder="Например, нужен номер с видом на море"
          invalid={Boolean(errors.comment)}
          {...register("comment")}
        />
      </Field>

      <div className="flex items-start gap-3 text-sm text-stone-600">
        <Checkbox
          id="lead-consent"
          className="mt-1"
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
