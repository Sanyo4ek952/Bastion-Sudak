"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { getOccupancyByGuests } from "../shared/lib/pricing/roomPricing";
import { Button, Card, CardContent, Checkbox, Field, Input, Muted, Select, Text, useToast } from "../shared/ui";
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
  const { notify } = useToast();
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

      <Card className="shadow-[0_16px_40px_-32px_rgba(43,42,40,0.35)]">
        <CardContent className="pt-6">
          {step === 0 ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Заезд" error={errors.checkIn?.message}>
                  <Input type="date" invalid={Boolean(errors.checkIn)} {...register("checkIn")} />
                </Field>
                <Field label="Выезд" error={errors.checkOut?.message}>
                  <Input type="date" invalid={Boolean(errors.checkOut)} {...register("checkOut")} />
                </Field>
              </div>
              <Field label="Номер" error={errors.roomId?.message}>
                <Select
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
                </Select>
                {roomsStatus === "error" ? (
                  <span className="text-xs text-rose-600">{roomsError}</span>
                ) : null}
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Взрослых" error={errors.adults?.message}>
                <Input
                  type="number"
                  min={0}
                  max={6}
                  invalid={Boolean(errors.adults)}
                  {...register("adults")}
                />
              </Field>
              <Field label="Детей" error={errors.children?.message}>
                <Input
                  type="number"
                  min={0}
                  max={6}
                  invalid={Boolean(errors.children)}
                  {...register("children")}
                />
              </Field>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-stone-600">
                <Checkbox {...register("services.breakfast")} />
                Завтрак (+{SERVICE_PRICES.breakfast.pricePerPerson} ₽/чел/ночь)
              </label>
              <label className="flex items-center gap-3 text-sm text-stone-600">
                <Checkbox {...register("services.transfer")} />
                Трансфер (+{SERVICE_PRICES.transfer.priceFixed} ₽)
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <Muted>
                Оплата будет подтверждена менеджером. Мы свяжемся для уточнения
                деталей.
              </Muted>
              {priceUnavailable ? (
                <Text className="text-rose-600">
                  Цена недоступна. Проверьте даты или выберите другой номер.
                </Text>
              ) : null}
              <Button
                type="button"
                size="l"
                disabled={priceUnavailable}
                onClick={() =>
                  notify({
                    title: "Заявка отправлена",
                    description: "Менеджер свяжется с вами в ближайшее время.",
                    variant: "success"
                  })
                }
              >
                Отправить заявку
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card variant="soft">
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          size="s"
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          disabled={step === 0}
        >
          Назад
        </Button>
        <Button
          type="button"
          size="s"
          onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}
          disabled={step === steps.length - 1}
        >
          Далее
        </Button>
      </div>
    </div>
  );
}
