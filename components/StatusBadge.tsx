import type { LotStatus } from "@/lib/lots";

const LABELS: Record<LotStatus, { label: string; className: string }> = {
  Disponible: { label: "Disponible", className: "status-available" },
  Optionné: { label: "Optionné", className: "status-option" },
  Vendu: { label: "Vendu", className: "status-sold" },
};

export function StatusBadge({ status }: { status: LotStatus }) {
  const { label, className } = LABELS[status];
  return (
    <span className={`status ${className}`}>
      <span className="status-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
