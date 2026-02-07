import { Prisma } from "@prisma/client";

import { leadFormSchema } from "../../../features/lead-form/schema";
import { normalizePhone } from "../../../features/lead-form/utils";
import { prisma } from "../../../shared/lib/prisma";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimitBuckets = new Map<string, number[]>();

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
      "utm_content",
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
    console.info("Lead honeypot triggered", { ip });
    return Response.json({ ok: true });
  }

  if (isRateLimited(ip)) {
    return Response.json(
      { ok: false, message: "Слишком много запросов. Попробуйте позже." },
      { status: 429 }
    );
  }

  const result = leadFormSchema.safeParse(payload);

  if (!result.success) {
    return Response.json(
      {
        ok: false,
        message: "Ошибка валидации",
        issues: result.error.issues,
      },
      { status: 400 }
    );
  }

  const normalizedPhone = normalizePhone(result.data.phone);
  const checkIn = parseOptionalDate(result.data.checkIn);
  const checkOut = parseOptionalDate(result.data.checkOut);

  if (checkIn === null || checkOut === null) {
    return Response.json(
      { ok: false, message: "Некорректный формат дат" },
      { status: 400 }
    );
  }

  const pageUrl = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");
  const utm = extractUtm(pageUrl);
  const source = utm?.utm_source ?? undefined;

  try {
    const createdLead = await prisma.lead.create({
      data: {
        name: result.data.name,
        phone: normalizedPhone,
        checkIn,
        checkOut,
        guests:
          typeof result.data.guests === "number"
            ? result.data.guests
            : undefined,
        comment: result.data.comment,
        source,
        pageUrl,
        userAgent,
        utm: utm ?? Prisma.JsonNull,
      },
    });

    // TODO: add Telegram notification after successful lead persistence.

    return Response.json({ ok: true, id: createdLead.id });
  } catch (error) {
    console.error("Failed to save lead", { ip, error });
    return Response.json(
      { ok: false, message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
