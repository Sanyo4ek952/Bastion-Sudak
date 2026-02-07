import { z } from "zod";

import { countPhoneDigits, normalizePhone } from "./utils";

const optionalTrimmedString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Максимум ${maxLength} символов`)
    .optional();

const optionalDateString = z.string().optional();

const optionalGuests = z
  .number()
  .int()
  .min(1, "Минимум 1 гость")
  .max(10, "Максимум 10 гостей")
  .optional();

export const leadFormSchema = z
  .object({
    name: optionalTrimmedString(50),
    phone: z
      .string()
      .trim()
      .min(1, "Введите номер телефона")
      .refine(
        (value) => countPhoneDigits(normalizePhone(value)) >= 10,
        "Введите номер телефона не короче 10 цифр"
      ),
    website: optionalTrimmedString(100),
    checkIn: optionalDateString,
    checkOut: optionalDateString,
    guests: optionalGuests,
    comment: optionalTrimmedString(500),
    consent: z
      .boolean()
      .refine((value) => value === true, "Нужно согласие на обработку данных"),
  })
  .superRefine((values, ctx) => {
    if (values.checkIn && values.checkOut && values.checkOut < values.checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Дата выезда должна быть позже даты заезда",
      });
    }
  });
