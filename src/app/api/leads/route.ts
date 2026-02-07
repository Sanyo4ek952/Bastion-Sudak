import { leadFormSchema } from "../../../features/lead-form/schema";
import { normalizePhone } from "../../../features/lead-form/utils";
import { prisma } from "../../../lib/prisma";
import { sendTelegramMessage } from "../../../shared/lib/telegram/sendTelegramMessage";

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

const buildTelegramMessage = (data: {
  phone: string;
  name?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  comment?: string;
  pageUrl?: string | null;
  utm?: UtmPayload | null;
}) => {
  const formatDate = (value?: Date) =>
    value ? value.toISOString().slice(0, 10) : null;

  const lines = [
    "<b>Новая заявка (перезвонить)</b>",
    `Телефон: ${data.phone}`,
    data.name ? `Имя: ${data.name}` : null,
    data.checkIn ? `Заезд: ${formatDate(data.checkIn)}` : null,
    data.checkOut ? `Выезд: ${formatDate(data.checkOut)}` : null,
    data.guests ? `Гостей: ${data.guests}` : null,
    data.comment ? `Комментарий: ${data.comment}` : null,
    data.pageUrl ? `Страница: ${data.pageUrl}` : null,
    data.utm ? `UTM: ${JSON.stringify(data.utm)}` : null,
  ].filter(Boolean);

  return lines.join("\n");
};

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    return Response.json(
      { ok: false, message: "Некорректный JSON" },
      { status: 400 }
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
  const message = buildTelegramMessage({
    phone: normalizedPhone,
    name: result.data.name,
    checkIn: checkIn ?? undefined,
    checkOut: checkOut ?? undefined,
    guests: result.data.guests,
    comment: result.data.comment,
    pageUrl,
    utm,
  });

  try {
    await prisma.lead.create({
      data: {
        name: result.data.name,
        phone: normalizedPhone,
        checkIn,
        checkOut,
        guests: result.data.guests,
        comment: result.data.comment,
        source,
        pageUrl,
        userAgent,
        utm: utm ?? undefined,
      },
    });

    try {
      await sendTelegramMessage(message);
    } catch (error) {
      console.error("Telegram notification failed", error);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to save lead", error);
    return Response.json(
      { ok: false, message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
