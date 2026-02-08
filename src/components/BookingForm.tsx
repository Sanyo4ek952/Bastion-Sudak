"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { getOccupancyByGuests } from "../shared/lib/pricing/roomPricing";
import { buttonVariants } from "../shared/ui/button";
import { Stepper } from "./Stepper";

const steps = ["Даты", "Гости", "Услуги", "Оплата"];

const SERVICE_PRICES = {
  breakfast: {
    pricePerPerson: 700
  },
  transfer: {
    priceFixed: 1200
  }
} as const;

type Room = {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
};

type ServicePrices = typeof SERVICE_PRICES;

type PriceState = {
  status: "idle" | "loading" | "ready" | "error";
  pricePerNight: number | null;
  error?: string | null;
};

const baseInputClasses =
  "rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 focus-ring";

const bookingFormSchema = z
  .object({
    checkIn: z.string().min(1, "Укажите дату заезда"),
    checkOut: z.string().min(1, "Укажите дату выезда"),
    roomId: z.string().min(1, "Выберите номер"),
    adults: z.coerce.number().int().min(0),
    children: z.coerce.number().int().min(0),
    services: z.object({
      breakfast: z.boolean(),
      transfer: z.boolean()
    })
  })
  .superRefine((values, ctx) => {
    if (values.checkIn && values.checkOut) {
      const nights = calculateNights(values.checkIn, values.checkOut);
      if (nights !== null && nights <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Дата выезда должна быть позже даты заезда",
          path: ["checkOut"]
        });
      }
      if (nights === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Некорректные даты",
          path: ["checkOut"]
        });
      }
    }
    const peopleCount = values.adults + values.children;
    if (peopleCount < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Укажите хотя бы одного гостя",
        path: ["adults"]
      });
    }
  });

type BookingFormValues = z.input<typeof bookingFormSchema>;

const parseDateInput = (value?: string) => {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  return Number.isNaN(date.getTime()) ? null : date;
};

const calculateNights = (checkIn?: string, checkOut?: string) => {
  const start = parseDateInput(checkIn);
  const end = parseDateInput(checkOut);
  if (!start || !end) {
    return null;
  }
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  return diffDays;
};

const calculateTotal = ({
  nights,
  pricePerNight,
  peopleCount,
  services,
  servicePrices
}: {
  nights: number | null;
  pricePerNight: number | null;
  peopleCount: number;
  services: BookingFormValues["services"];
  servicePrices: ServicePrices;
}) => {
  if (!nights || nights <= 0) {
    return 0;
  }
  if (!pricePerNight) {
    return 0;
  }
  if (peopleCount < 1) {
    return 0;
  }

  const roomBaseTotal = nights * pricePerNight;
  const breakfastTotal = services.breakfast
    ? servicePrices.breakfast.pricePerPerson * peopleCount * nights
    : 0; // if breakfast pricing changes, adjust multiplier here
  const transferTotal = services.transfer ? servicePrices.transfer.priceFixed : 0;

  return roomBaseTotal + breakfastTotal + transferTotal;
};

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsStatus, setRoomsStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [priceState, setPriceState] = useState<PriceState>({
    status: "idle",
    pricePerNight: null,
    error: null
  });

  const {
    register,
    control,
    formState: { errors }
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      checkIn: "",
      checkOut: "",
      roomId: "",
      adults: 2,
      children: 0,
      services: {
        breakfast: true,
        transfer: false
      }
    },
    mode: "onBlur"
  });

  const [checkInValue, checkOutValue, roomIdValue, adultsValue, childrenValue] =
    useWatch({
      control,
      name: ["checkIn", "checkOut", "roomId", "adults", "children"]
    });
  const servicesValue = useWatch({ control, name: "services" });
  const normalizedServices = useMemo(
    () =>
      servicesValue ?? {
        breakfast: false,
        transfer: false
      },
    [servicesValue]
  );

  const adultsCount = Number(adultsValue ?? 0);
  const childrenCount = Number(childrenValue ?? 0);
  const peopleCount = adultsCount + childrenCount;
  const nights = useMemo(
    () => calculateNights(checkInValue, checkOutValue),
    [checkInValue, checkOutValue]
  );

  useEffect(() => {
    let isMounted = true;
    const loadRooms = async () => {
      setRoomsStatus("loading");
      setRoomsError(null);
      try {
        const response = await fetch("/api/rooms");
        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.message ?? "Не удалось загрузить номера");
        }
        if (isMounted) {
          setRooms(data.rooms ?? []);
          setRoomsStatus("ready");
        }
      } catch (error) {
        if (isMounted) {
          setRoomsStatus("error");
          setRoomsError(
            error instanceof Error ? error.message : "Не удалось загрузить номера"
          );
        }
      }
    };

    loadRooms();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!roomIdValue) {
        setPriceState({ status: "idle", pricePerNight: null, error: null });
        return;
      }
      if (!checkInValue || !checkOutValue) {
        setPriceState({ status: "idle", pricePerNight: null, error: null });
        return;
      }
      if (!nights || nights <= 0) {
        setPriceState({ status: "idle", pricePerNight: null, error: null });
        return;
      }
      if (peopleCount < 1) {
        setPriceState({ status: "idle", pricePerNight: null, error: null });
        return;
      }

      const occupancy = getOccupancyByGuests(peopleCount);
      const occupancyMap = {
        sngl: "SNGL",
        dbl: "DBL",
        trpl: "TRPL"
      } as const;

      setPriceState({ status: "loading", pricePerNight: null, error: null });
      try {
        const params = new URLSearchParams({
          roomId: roomIdValue,
          checkIn: checkInValue,
          checkOut: checkOutValue,
          board: "RO",
          occupancy: occupancyMap[occupancy]
        });
        const response = await fetch(`/api/quote?${params.toString()}`);
        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.message ?? "Цена недоступна");
        }
        const computed =
          typeof data.total === "number" && typeof data.nights === "number"
            ? Math.round(data.total / data.nights)
            : null;
        if (!computed) {
          throw new Error("Цена недоступна");
        }
        setPriceState({ status: "ready", pricePerNight: computed, error: null });
      } catch (error) {
        setPriceState({
          status: "error",
          pricePerNight: null,
          error: error instanceof Error ? error.message : "Цена недоступна"
        });
      }
    };

    fetchPrice();
  }, [checkInValue, checkOutValue, nights, peopleCount, roomIdValue]);

  const total = useMemo(
    () =>
      calculateTotal({
        nights,
        pricePerNight: priceState.pricePerNight,
        peopleCount,
        services: normalizedServices,
        servicePrices: SERVICE_PRICES
      }),
    [nights, peopleCount, priceState.pricePerNight, normalizedServices]
  );

  const priceUnavailable = Boolean(
    priceState.status === "error" ||
      (roomIdValue && checkInValue && checkOutValue && !priceState.pricePerNight)
  );

  return (
    <div className="space-y-8">
      <Stepper steps={steps} currentStep={step} />

      <div className="rounded-3xl border border-sand-100 bg-white/90 p-6 shadow-[0_16px_40px_-32px_rgba(43,42,40,0.35)]">
        {step === 0 ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-stone-600">
                Заезд
                <input
                  type="date"
                  className={baseInputClasses}
                  aria-invalid={Boolean(errors.checkIn)}
                  {...register("checkIn")}
                />
                {errors.checkIn ? (
                  <span className="text-xs text-rose-600">
                    {errors.checkIn.message}
                  </span>
                ) : null}
              </label>
              <label className="flex flex-col gap-2 text-sm text-stone-600">
                Выезд
                <input
                  type="date"
                  className={baseInputClasses}
                  aria-invalid={Boolean(errors.checkOut)}
                  {...register("checkOut")}
                />
                {errors.checkOut ? (
                  <span className="text-xs text-rose-600">
                    {errors.checkOut.message}
                  </span>
                ) : null}
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm text-stone-600">
              Номер
              <select
                className={baseInputClasses}
                aria-invalid={Boolean(errors.roomId)}
                disabled={roomsStatus === "loading"}
                {...register("roomId")}
              >
                <option value="">
                  {roomsStatus === "loading"
                    ? "Загрузка номеров..."
                    : "Выберите номер"}
                </option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} · от {room.basePrice.toLocaleString("ru-RU")} ₽
                    /ночь
                  </option>
                ))}
              </select>
              {roomsStatus === "error" ? (
                <span className="text-xs text-rose-600">{roomsError}</span>
              ) : null}
              {errors.roomId ? (
                <span className="text-xs text-rose-600">
                  {errors.roomId.message}
                </span>
              ) : null}
            </label>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-stone-600">
              Взрослых
              <input
                type="number"
                min={0}
                max={6}
                className={baseInputClasses}
                aria-invalid={Boolean(errors.adults)}
                {...register("adults")}
              />
              {errors.adults ? (
                <span className="text-xs text-rose-600">
                  {errors.adults.message}
                </span>
              ) : null}
            </label>
            <label className="flex flex-col gap-2 text-sm text-stone-600">
              Детей
              <input
                type="number"
                min={0}
                max={6}
                className={baseInputClasses}
                aria-invalid={Boolean(errors.children)}
                {...register("children")}
              />
              {errors.children ? (
                <span className="text-xs text-rose-600">
                  {errors.children.message}
                </span>
              ) : null}
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-stone-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-sand-100 accent-sea-500"
                {...register("services.breakfast")}
              />
              Завтрак (+{SERVICE_PRICES.breakfast.pricePerPerson} ₽/чел/ночь)
            </label>
            <label className="flex items-center gap-3 text-sm text-stone-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-sand-100 accent-sea-500"
                {...register("services.transfer")}
              />
              Трансфер (+{SERVICE_PRICES.transfer.priceFixed} ₽)
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <p className="text-sm text-stone-600">
              Оплата будет подтверждена менеджером. Мы свяжемся для уточнения
              деталей.
            </p>
            {priceUnavailable ? (
              <p className="text-sm text-rose-600">
                Цена недоступна. Проверьте даты или выберите другой номер.
              </p>
            ) : null}
            <button
              className={buttonVariants({ size: "l" })}
              type="button"
              disabled={priceUnavailable}
            >
              Отправить заявку
            </button>
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-sand-100 bg-sand-100/70 p-6">
        <p className="text-caption uppercase tracking-[0.2em] text-stone-600">
          Расчет
        </p>
        <div className="mt-4 space-y-2 text-sm text-stone-600">
          <div className="flex items-center justify-between">
            <span>Ночей</span>
            <span>{nights && nights > 0 ? nights : "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Цена за ночь</span>
            <span>
              {priceState.status === "loading"
                ? "Загрузка..."
                : priceState.pricePerNight
                  ? `${priceState.pricePerNight.toLocaleString("ru-RU")} ₽`
                  : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Завтрак</span>
            <span>
              {normalizedServices.breakfast
                ? `${(
                    SERVICE_PRICES.breakfast.pricePerPerson *
                    peopleCount *
                    (nights ?? 0)
                  ).toLocaleString("ru-RU")} ₽`
                : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Трансфер</span>
            <span>
              {normalizedServices.transfer
                ? `${SERVICE_PRICES.transfer.priceFixed.toLocaleString("ru-RU")} ₽`
                : "—"}
            </span>
          </div>
        </div>

        <p className="mt-4 text-caption uppercase tracking-[0.2em] text-stone-600">
          Итого
        </p>
        <p className="mt-2 text-2xl font-semibold text-stone-900">
          {total.toLocaleString("ru-RU")} ₽
        </p>
        <p className="mt-1 text-sm text-stone-600">
          {nights && nights > 0 ? nights : "—"} ночи ·{" "}
          {peopleCount > 0 ? peopleCount : "—"} гостей
        </p>
        {priceState.error ? (
          <p className="mt-2 text-xs text-rose-600">{priceState.error}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={buttonVariants({ variant: "secondary", size: "s" })}
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          disabled={step === 0}
        >
          Назад
        </button>
        <button
          type="button"
          className={buttonVariants({ size: "s" })}
          onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}
          disabled={step === steps.length - 1}
        >
          Далее
        </button>
      </div>
    </div>
  );
}
