import { z } from "zod";

import { buildQuote } from "../../../shared/lib/pricing/quote";
import { prisma } from "../../../shared/lib/prisma";
import { normalizePhone } from "../../../features/lead-form/utils";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimitBuckets = new Map<string, number[]>();

const payloadSchema = z.object({
  roomId: z.string().optional(),
  name: z.string().trim().max(50).optional(),
  phone: z.string().min(1),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().int().min(1).max(10).optional(),
  comment: z.string().trim().max(500).optional(),
  consent: z.boolean(),
  website: z.string().optional()
});

type UtmPayload = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

const parseOptionalDate = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
};

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const existing = rateLimitBuckets.get(ip) ?? [];
  const recent = existing.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitBuckets.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitBuckets.set(ip, recent);
  return false;
};

const hasHoneypotValue = (payload: unknown) => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  if (!("website" in payload)) {
    return false;
  }

  const value = (payload as { website?: unknown }).website;
  if (typeof value !== "string") {
    return false;
  }

  return value.trim().length > 0;
};

const extractUtm = (rawUrl?: string | null): UtmPayload | null => {
  if (!rawUrl) {
    return null;
  }

  try {
    const url = new URL(rawUrl);
    const keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content"
    ] as const;
    const payload: UtmPayload = {};

    keys.forEach((key) => {
      const value = url.searchParams.get(key);
      if (value) {
        payload[key] = value;
      }
    });

    return Object.keys(payload).length > 0 ? payload : null;
  } catch (error) {
    console.warn("Failed to parse UTM parameters", error);
    return null;
  }
};

export async function POST(request: Request) {
  let payload: unknown;
  const ip = getClientIp(request);

  try {
    payload = await request.json();
  } catch (error) {
    return Response.json(
      { ok: false, message: "Некорректный JSON" },
      { status: 400 }
    );
  }

  if (hasHoneypotValue(payload)) {
    console.info("BookingRequest honeypot triggered", { ip });
    return Response.json({ ok: true });
  }

  if (isRateLimited(ip)) {
    return Response.json(
      { ok: false, message: "Слишком много запросов. Попробуйте позже." },
      { status: 429 }
    );
  }

  const result = payloadSchema.safeParse(payload);

  if (!result.success) {
    return Response.json(
      { ok: false, message: "Ошибка валидации", issues: result.error.issues },
      { status: 400 }
    );
  }

  if (!result.data.consent) {
    return Response.json(
      { ok: false, message: "Необходимо согласие" },
      { status: 400 }
    );
  }

  const checkIn = parseOptionalDate(result.data.checkIn);
  const checkOut = parseOptionalDate(result.data.checkOut);

  if (checkIn === null || checkOut === null) {
    return Response.json(
      { ok: false, message: "Некорректный формат дат" },
      { status: 400 }
    );
  }
  if (checkIn && checkOut && checkOut < checkIn) {
    return Response.json(
      { ok: false, message: "Дата выезда должна быть позже даты заезда" },
      { status: 400 }
    );
  }

  const pageUrl = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");
  const utm = extractUtm(pageUrl);
  const source = utm?.utm_source ?? undefined;
  const normalizedPhone = normalizePhone(result.data.phone);

  let totalPrice: number | undefined;
  if (result.data.roomId) {
    const room = await prisma.room.findUnique({
      where: { id: result.data.roomId },
      select: { id: true }
    });
    if (!room) {
      return Response.json(
        { ok: false, message: "Номер не найден" },
        { status: 400 }
      );
    }

    if (checkIn && checkOut) {
      try {
        const quote = await buildQuote({
          roomId: result.data.roomId,
          checkIn,
          checkOut
        });
        totalPrice = quote.total;
      } catch (error) {
        totalPrice = undefined;
      }
    }
  }

  try {
    const created = await prisma.bookingRequest.create({
      data: {
        roomId: result.data.roomId,
        name: result.data.name,
        phone: normalizedPhone,
        checkIn,
        checkOut,
        guests: result.data.guests,
        comment: result.data.comment,
        totalPrice,
        source,
        pageUrl,
        userAgent,
        utm: utm ?? undefined
      }
    });

    return Response.json({ ok: true, id: created.id });
  } catch (error) {
    console.error("Failed to save booking request", { ip, error });
    return Response.json(
      { ok: false, message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
