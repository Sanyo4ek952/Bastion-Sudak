"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import type { BoardType } from "../../data/rooms";
import { bookingRequestSchema } from "./schema";
import type { BookingRequestValues } from "./types";
import { normalizePhone } from "../lead-form/utils";
import { getPriceForDateRange } from "../../shared/lib/pricing/getPriceForDateRange";
import {
  boardDescriptions,
  getOccupancyByGuests,
  getRoomConfigBySlug
} from "../../shared/lib/pricing/roomPricing";

type QuoteState = {
  nights: number;
  total: number;
  nightly: Array<{ date: string; price: number }>;
  currency: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

type LocalQuote = {
  nights: number;
  pricePerNight: number;
  total: number;
};

const defaultValues: BookingRequestValues = {
  name: "",
  phone: "",
  website: "",
  checkIn: "",
  checkOut: "",
  guests: undefined,
  comment: "",
  consent: false
};

const parseDate = (value?: string) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

export function RoomBookingWidget({
  roomId,
  roomSlug
}: {
  roomId: string;
  roomSlug: string;
}) {
  const [quote, setQuote] = useState<QuoteState | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [board, setBoard] = useState<BoardType>("RO");
  const [occupancy, setOccupancy] = useState<"DBL" | "SNGL" | "TRPL">("DBL");

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    control,
    formState: { errors, isSubmitting }
  } = useForm<BookingRequestValues>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues,
    mode: "onBlur"
  });

  const [checkInValue, checkOutValue, guestsValue] = useWatch({
    control,
    name: ["checkIn", "checkOut", "guests"]
  });

  const inferredOccupancy = getOccupancyByGuests(
    typeof guestsValue === "number" ? guestsValue : undefined
  );

  const localQuote = useMemo<LocalQuote | null>(() => {
    const checkIn = parseDate(checkInValue);
    const checkOut = parseDate(checkOutValue);
    if (!checkIn || !checkOut) {
      return null;
    }
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (nights <= 0) {
      return null;
    }
    const config = getRoomConfigBySlug(roomSlug);
    if (!config) {
      return null;
    }
    const occupancyMap = {
      DBL: "dbl",
      SNGL: "sngl",
      TRPL: "trpl"
    } as const;
    const normalizedOccupancy = occupancyMap[occupancy];
    const pricePerNight = getPriceForDateRange(
      config.roomType,
      config.variant,
      normalizedOccupancy,
      checkIn,
      checkOut,
      board
    );
    if (!pricePerNight) {
      return null;
    }
    return {
      nights,
      pricePerNight,
      total: pricePerNight * nights
    };
  }, [board, checkInValue, checkOutValue, occupancy, roomSlug]);

  const handleQuote = async () => {
    setQuoteError(null);
    const isValid = await trigger(["checkIn", "checkOut"]);
    if (!isValid) {
      setQuoteError("Заполните даты заезда и выезда.");
      return;
    }
    const current = getValues();
    if (!current.checkIn || !current.checkOut) {
      setQuoteError("Заполните даты заезда и выезда.");
      return;
    }

    try {
      const params = new URLSearchParams({
        roomId,
        checkIn: current.checkIn,
        checkOut: current.checkOut,
        board,
        occupancy
      });
      const response = await fetch(`/api/quote?${params.toString()}`);
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setQuoteError(data.message ?? "Не удалось рассчитать стоимость.");
        setQuote(null);
        return;
      }
      setQuote({
        nights: data.nights,
        total: data.total,
        nightly: data.nightly,
        currency: data.currency
      });
    } catch (error) {
      setQuoteError("Не удалось рассчитать стоимость.");
      setQuote(null);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (status === "loading") {
      return;
    }

    setStatus("loading");
    setSubmitError(null);

    const payload = {
      ...values,
      roomId,
      phone: normalizePhone(values.phone),
      guests: values.guests ? Number(values.guests) : undefined
    };

    try {
      const response = await fetch("/api/booking-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setStatus("error");
        setSubmitError(data.message ?? "Не удалось отправить запрос.");
        return;
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setSubmitError("Не удалось отправить запрос.");
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-sand-100 bg-white/90 p-6 shadow-[0_16px_40px_-32px_rgba(43,42,40,0.35)]">
        <h3 className="text-lg font-semibold text-stone-900">
          Рассчитать стоимость
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-stone-600">
            Дата заезда
            <input
              type="date"
              className="rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 shadow-sm focus-ring"
              {...register("checkIn")}
            />
            {errors.checkIn ? (
              <span className="text-xs text-rose-600">{errors.checkIn.message}</span>
            ) : null}
          </label>
          <label className="flex flex-col gap-2 text-sm text-stone-600">
            Дата выезда
            <input
              type="date"
              className="rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 shadow-sm focus-ring"
              {...register("checkOut")}
            />
            {errors.checkOut ? (
              <span className="text-xs text-rose-600">{errors.checkOut.message}</span>
            ) : null}
          </label>
          <label className="flex flex-col gap-2 text-sm text-stone-600">
            Гостей
            <input
              type="number"
              min={1}
              max={10}
              className="rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 shadow-sm focus-ring"
              {...register("guests", {
                setValueAs: (value) => (value === "" ? undefined : Number(value))
              })}
            />
            {errors.guests ? (
              <span className="text-xs text-rose-600">{errors.guests.message}</span>
            ) : null}
          </label>
          <label className="flex flex-col gap-2 text-sm text-stone-600">
            План питания
            <select
              value={board}
              onChange={(event) => setBoard(event.target.value as BoardType)}
              className="rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 shadow-sm focus-ring"
            >
              <option value="RO">RO — {boardDescriptions.RO}</option>
              <option value="BB">BB — {boardDescriptions.BB}</option>
              <option value="HB">HB — {boardDescriptions.HB}</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-stone-600">
            Тип размещения
            <select
              value={occupancy}
              onChange={(event) =>
                setOccupancy(event.target.value as "DBL" | "SNGL" | "TRPL")
              }
              className="rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 shadow-sm focus-ring"
            >
              <option value="DBL">DBL — 2 гостя</option>
              <option value="SNGL">SNGL — 1 гость</option>
              <option value="TRPL">TRPL — 3 гостя</option>
            </select>
            {inferredOccupancy ? (
              <span className="text-xs text-stone-400">
                По гостям: {inferredOccupancy.toUpperCase()}
              </span>
            ) : null}
          </label>
        </div>

        {localQuote ? (
          <div className="mt-4 rounded-2xl border border-sand-100 bg-sand-50 px-4 py-3 text-sm text-stone-700">
            <p className="font-semibold">Предварительный расчет</p>
            <p className="mt-1 text-xs text-stone-500">
              {localQuote.nights} ночей · {localQuote.pricePerNight} ₽/ночь
            </p>
            <p className="mt-2 text-base font-semibold text-stone-900">
              Итого: {localQuote.total} ₽
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-sand-100 bg-sand-50 px-4 py-3 text-sm text-stone-500">
            Выберите даты, план питания и тип размещения, чтобы увидеть стоимость.
          </div>
        )}

        <button
          type="button"
          onClick={handleQuote}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-sand-100 px-5 py-2 text-sm font-semibold text-stone-600 transition duration-150 ease-out hover:border-sea-500 hover:text-stone-900"
        >
          Рассчитать стоимость
        </button>
        {quoteError ? (
          <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {quoteError}
          </div>
        ) : null}
        {quote ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">
              {quote.nights} ночей · {quote.total} {quote.currency}
            </p>
            <ul className="mt-2 grid gap-1 text-xs text-emerald-700">
              {quote.nightly.map((item) => (
                <li key={item.date}>
                  {item.date}: {item.price} {quote.currency}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-sand-100 bg-white/90 p-6 shadow-[0_16px_40px_-32px_rgba(43,42,40,0.35)]"
      >
        <h3 className="text-lg font-semibold text-stone-900">
          Запросить бронирование
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label
            className="hidden"
            aria-hidden="true"
          >
            Website
            <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
          <label className="flex flex-col gap-2 text-sm text-stone-600">
            Имя
            <input
              type="text"
              className="rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 shadow-sm focus-ring"
              placeholder="Анна"
              {...register("name")}
            />
            {errors.name ? (
              <span className="text-xs text-rose-600">{errors.name.message}</span>
            ) : null}
          </label>
          <label className="flex flex-col gap-2 text-sm text-stone-600">
            Телефон *
            <input
              type="tel"
              className="rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 shadow-sm focus-ring"
              placeholder="+7 (900) 000-00-00"
              {...register("phone")}
            />
            {errors.phone ? (
              <span className="text-xs text-rose-600">{errors.phone.message}</span>
            ) : null}
          </label>
        </div>
        <label className="mt-4 flex flex-col gap-2 text-sm text-stone-600">
          Комментарий
          <textarea
            rows={4}
            className="rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 shadow-sm focus-ring"
            placeholder="Например, нужна детская кроватка"
            {...register("comment")}
          />
          {errors.comment ? (
            <span className="text-xs text-rose-600">{errors.comment.message}</span>
          ) : null}
        </label>
        <label className="mt-4 flex items-start gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-sand-100 accent-sea-500 focus-ring"
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
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </div>
        ) : null}

        {status === "success" ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Спасибо! Мы свяжемся с вами для подтверждения бронирования.
          </div>
        ) : null}

        <button
          type="submit"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-sea-500 px-6 py-3 text-sm font-semibold text-sand-50 transition duration-150 ease-out hover:bg-sea-600 disabled:cursor-not-allowed disabled:bg-sand-100 disabled:text-stone-600"
          disabled={status === "loading" || isSubmitting}
        >
          {status === "loading" || isSubmitting
            ? "Отправляем..."
            : status === "success"
              ? "Запрос отправлен"
              : "Отправить запрос"}
        </button>
      </form>
    </div>
  );
}
