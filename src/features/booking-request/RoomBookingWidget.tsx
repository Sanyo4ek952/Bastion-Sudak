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
import { Button, Card, CardContent, Checkbox, Field, Input, Select, Text, Textarea } from "../../shared/ui";

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
      <Card>
        <CardContent className="pt-6">
          <Text className="text-lg font-semibold">Рассчитать стоимость</Text>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Дата заезда" error={errors.checkIn?.message}>
              <Input type="date" {...register("checkIn")} />
            </Field>
            <Field label="Дата выезда" error={errors.checkOut?.message}>
              <Input type="date" {...register("checkOut")} />
            </Field>
            <Field label="Гостей" error={errors.guests?.message}>
              <Input
                type="number"
                min={1}
                max={10}
                {...register("guests", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value))
                })}
              />
            </Field>
            <Field label="План питания">
              <Select
                value={board}
                onChange={(event) => setBoard(event.target.value as BoardType)}
              >
                <option value="RO">RO — {boardDescriptions.RO}</option>
                <option value="BB">BB — {boardDescriptions.BB}</option>
                <option value="HB">HB — {boardDescriptions.HB}</option>
              </Select>
            </Field>
            <Field label="Тип размещения">
              <Select
                value={occupancy}
                onChange={(event) =>
                  setOccupancy(event.target.value as "DBL" | "SNGL" | "TRPL")
                }
              >
                <option value="DBL">DBL — 2 гостя</option>
                <option value="SNGL">SNGL — 1 гость</option>
                <option value="TRPL">TRPL — 3 гостя</option>
              </Select>
              {inferredOccupancy ? (
                <span className="text-xs text-stone-400">
                  По гостям: {inferredOccupancy.toUpperCase()}
                </span>
              ) : null}
            </Field>
          </div>

          {localQuote ? (
            <div className="mt-4 rounded-2xl border border-sand-100 bg-sand-50 px-4 py-3 text-sm text-stone-700">
              <Text className="font-semibold">Предварительный расчет</Text>
              <Text className="mt-1 text-xs text-stone-500">
                {localQuote.nights} ночей · {localQuote.pricePerNight} ₽/ночь
              </Text>
              <Text className="mt-2 text-base font-semibold text-stone-900">
                Итого: {localQuote.total} ₽
              </Text>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-sand-100 bg-sand-50 px-4 py-3 text-sm text-stone-500">
              Выберите даты, план питания и тип размещения, чтобы увидеть стоимость.
            </div>
          )}

          <Button type="button" onClick={handleQuote} variant="secondary" className="mt-4">
            Рассчитать стоимость
          </Button>
          {quoteError ? (
            <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {quoteError}
            </div>
          ) : null}
          {quote ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <Text className="font-semibold">
                {quote.nights} ночей · {quote.total} {quote.currency}
              </Text>
              <ul className="mt-2 grid gap-1 text-xs text-emerald-700">
                {quote.nightly.map((item) => (
                  <li key={item.date}>
                    {item.date}: {item.price} {quote.currency}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit}>
            <Text className="text-lg font-semibold">Запросить бронирование</Text>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="hidden" aria-hidden="true">
                Website
                <Input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </label>
              <Field label="Имя" error={errors.name?.message}>
                <Input type="text" placeholder="Анна" {...register("name")} />
              </Field>
              <Field label="Телефон" required error={errors.phone?.message}>
                <Input
                  type="tel"
                  placeholder="+7 (900) 000-00-00"
                  {...register("phone")}
                />
              </Field>
            </div>
            <Field
              label="Комментарий"
              error={errors.comment?.message}
              className="mt-4"
            >
              <Textarea
                rows={4}
                placeholder="Например, нужна детская кроватка"
                {...register("comment")}
              />
            </Field>
            <label className="mt-4 flex items-start gap-2 text-sm text-stone-600">
              <Checkbox {...register("consent")} />
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

            <Button
              type="submit"
              className="mt-6"
              disabled={status === "loading" || isSubmitting}
              size="l"
            >
              {status === "loading" || isSubmitting
                ? "Отправляем..."
                : status === "success"
                  ? "Запрос отправлен"
                  : "Отправить запрос"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
