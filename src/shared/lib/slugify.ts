const slugReplacements: Array<[RegExp, string]> = [
  [/[\s_]+/g, "-"],
  [/[^a-z0-9-]+/g, ""],
  [/-{2,}/g, "-"]
];

const transliterationMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ы: "y",
  э: "e",
  ю: "yu",
  я: "ya",
  ь: "",
  ъ: ""
};

export const slugify = (value: string): string => {
  const base = value
    .toLowerCase()
    .trim()
    .split("")
    .map((char) => transliterationMap[char] ?? char)
    .join("");

  return slugReplacements
    .reduce((acc, [regex, replacement]) => acc.replace(regex, replacement), base)
    .replace(/^-+|-+$/g, "");
};
