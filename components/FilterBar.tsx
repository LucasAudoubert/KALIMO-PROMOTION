import Link from "next/link";
import { LOT_TYPES, type Lot, type LotType } from "@/lib/lots";

type Filter = LotType | "Tous";

const FILTERS: Filter[] = ["Tous", ...LOT_TYPES];

export function FilterBar({
  lots,
  active,
}: {
  lots: Lot[];
  active: Filter;
}) {
  return (
    <nav className="filters" aria-label="Filtrer les lots par typologie">
      {FILTERS.map((filter) => {
        const count =
          filter === "Tous"
            ? lots.length
            : lots.filter((lot) => lot.type === filter).length;
        const isActive = filter === active;
        const href =
          filter === "Tous" ? "/#lots" : `/?type=${filter}#lots`;

        return (
          <Link
            key={filter}
            href={href}
            className={`filter${isActive ? " is-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {filter === "Tous" ? "Tous les lots" : filter}
            <span className="filter-count">{count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
