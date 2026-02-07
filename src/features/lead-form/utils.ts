export const normalizePhone = (value: string): string => {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith("+");
  const cleaned = trimmed.replace(/[()\s-]/g, "");

  if (hasPlus && !cleaned.startsWith("+")) {
    return `+${cleaned}`;
  }

  return cleaned;
};

export const countPhoneDigits = (value: string): number => {
  return value.replace(/\D/g, "").length;
};
