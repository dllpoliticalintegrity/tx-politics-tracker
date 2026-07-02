import { type CaCandidate } from "@/hooks/useCandidates";

// ─── number / string formatters ────────────────────────────
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
export function fmtM(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 1)}M`;
  if (n >= 10_000) return `$${Math.round(n / 1000)}K`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  if (n === 0) return "$0";
  return `$${Math.round(n).toLocaleString()}`;
}
export function fmtMSigned(n: number): string {
  if (n === 0) return "$0";
  return `${n >= 0 ? "+" : "−"}${fmtM(Math.abs(n))}`;
}
export function partyTag(p: string | null | undefined): "d" | "r" | "i" {
  const s = (p ?? "").trim().toLowerCase();
  if (s.startsWith("d")) return "d";
  if (s.startsWith("r")) return "r";
  return "i";
}
export function candidateInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name
    .replace(/^(Lt\.|Sen\.|Rep\.|Mayor|Gov\.|Atty\.|Asm\.)\s*/g, "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
export function candidateShort(name: string | null | undefined): string {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1].toUpperCase();
}
export function isWithdrawn(status: string | null | undefined): boolean {
  const s = (status ?? "").toLowerCase();
  return s === "withdrawn" || s === "dropped_out" || s === "dropped out";
}

// ─── shared mini-components ────────────────────────────────
export function CandPhoto({
  candidate,
  className,
}: {
  candidate: CaCandidate;
  className: string;
}) {
  const src = candidate.photo_url_thumb ?? candidate.photo_url ?? null;
  return (
    <div className={className}>
      {src ? <img src={src} alt={candidate.name} /> : <span>{candidateInitials(candidate.name)}</span>}
    </div>
  );
}

export function WithdrewTag() {
  return (
    <span
      style={{
        background: "var(--paper-3)",
        color: "var(--ink-3)",
        fontFamily: "var(--f-mono)",
        fontWeight: 700,
        fontSize: 9,
        letterSpacing: "0.14em",
        padding: "2px 6px",
        marginLeft: 6,
        verticalAlign: "1px",
        textTransform: "uppercase",
      }}
    >
      Withdrew
    </span>
  );
}

// ─── chip components for filter bars / segmented buttons ──
export function TagChip({
  active,
  dot,
  count,
  children,
  onClick,
}: {
  active?: boolean;
  dot?: "d" | "r" | "i" | "yellow" | "green" | "orange" | "red" | "peri";
  count?: number;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const dotStyle =
    dot === "d"
      ? "var(--periwinkle)"
      : dot === "r"
        ? "var(--red)"
        : dot === "i"
          ? "var(--green)"
          : dot === "yellow"
            ? "var(--yellow)"
            : dot === "green"
              ? "var(--green)"
              : dot === "orange"
                ? "var(--orange)"
                : dot === "red"
                  ? "var(--red)"
                  : dot === "peri"
                    ? "var(--periwinkle)"
                    : undefined;
  return (
    <button className={`tag-chip ${active ? "active" : ""}`} onClick={onClick} type="button">
      {dotStyle && <span className="tag-chip__dot" style={{ background: dotStyle }} />}
      {children}
      {count !== undefined && (
        <span style={{ color: active ? "var(--paper)" : "var(--ink-3)", marginLeft: 4 }}>{count}</span>
      )}
    </button>
  );
}
