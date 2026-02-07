import { leadFormSchema } from "../../../features/lead-form/schema";
import { normalizePhone } from "../../../features/lead-form/utils";
import { prisma } from "../../../lib/prisma";

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
  const lines = [
    "Новая заявка с сайта Bastion Sudak",
    `Телефон: ${data.phone}`,
    data.name ? `Имя: ${data.name}` : null,
    data.checkIn ? `Заезд: ${data.checkIn.toISOString().slice(0, 10)}` : null,
    data.checkOut ? `Выезд: ${data.checkOut.toISOString().slice(0, 10)}` : null,
    data.guests ? `Гостей: ${data.guests}` : null,
    data.comment ? `Комментарий: ${data.comment}` : null,
    data.pageUrl ? `Страница: ${data.pageUrl}` : null,
    data.utm ? `UTM: ${JSON.stringify(data.utm)}` : null,
  ].filter(Boolean);

  return lines.join("\n");
};

const notifyTelegram = async (message: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram уведомления отключены: не заданы переменные окружения");
    return;
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram API error: ${response.status} ${body}`);
  }
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

  try {
    const lead = await prisma.lead.create({
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

    const message = buildTelegramMessage({
      phone: normalizedPhone,
      name: lead.name ?? undefined,
      checkIn: lead.checkIn ?? undefined,
      checkOut: lead.checkOut ?? undefined,
      guests: lead.guests ?? undefined,
      comment: lead.comment ?? undefined,
      pageUrl: lead.pageUrl,
      utm: lead.utm as UtmPayload | null,
    });

    try {
      await notifyTelegram(message);
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
