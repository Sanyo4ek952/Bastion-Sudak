import { leadFormSchema } from "../../../features/lead-form/schema";
import { normalizePhone } from "../../../features/lead-form/utils";

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

  console.info("Lead form received", { phone: normalizedPhone });

  return Response.json({ ok: true });
}
