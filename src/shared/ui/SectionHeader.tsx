type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  align = "left"
}: SectionHeaderProps) {
  return (
    <div
      className={[
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start"
      ].join(" ")}
    >
      {eyebrow ? (
        <span className="text-caption uppercase tracking-[0.3em] text-stone-600">
          {eyebrow}
        </span>
      ) : null}
      <h2>{title}</h2>
      {subtitle ? (
        <p
          className={[
            "text-body-large text-stone-600",
            align === "center" ? "max-w-2xl" : "max-w-xl"
          ].join(" ")}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
