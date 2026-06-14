type IslamicOrnamentProps = {
  className?: string;
  tone?: "primary" | "gold";
};

export const IslamicOrnament = ({
  className = "",
  tone = "primary",
}: IslamicOrnamentProps) => (
  <div
    className={`w-full h-2 bg-gradient-to-r from-transparent ${
      tone === "gold" ? "via-[var(--gold)]" : "via-primary"
    } to-transparent opacity-60 ${className}`}
  />
);
