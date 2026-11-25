import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import {
  floorLabel,
  formatPrice,
  formatSurface,
  lotTypeLabel,
  type Lot,
} from "@/lib/lots";

export function LotCard({ lot }: { lot: Lot }) {
  const sold = lot.status === "Vendu";

  return (
    <article className={`lot-card${sold ? " is-sold" : ""}`}>
      <div className="lot-card-head">
        <span className="lot-reference">Lot {lot.reference}</span>
        <StatusBadge status={lot.status} />
      </div>

      <div className="lot-card-title">
        <h3>{lot.type}</h3>
        <p>{lotTypeLabel(lot.type)}</p>
      </div>

      <dl className="lot-details">
        <div>
          <dt>Surface</dt>
          <dd>{formatSurface(lot.surface)}</dd>
        </div>
        <div>
          <dt>Étage</dt>
          <dd>{floorLabel(lot.floor)}</dd>
        </div>
      </dl>

      <div className="lot-card-foot">
        <div>
          <span className="lot-price-label">Prix</span>
          <p className="lot-price">{formatPrice(lot.price)}</p>
        </div>
        {sold ? (
          <span className="lot-cta-disabled">Commercialisé</span>
        ) : (
          <Link
            className="btn btn-primary lot-cta"
            href={`/demande?lot=${encodeURIComponent(lot.reference)}`}
            aria-label={`Faire une demande pour le lot ${lot.reference}`}
          >
            Ça m&apos;intéresse
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {lot.status === "Optionné" ? (
        <p className="lot-option-note">
          Une option est en cours sur ce lot. Votre demande reste possible.
        </p>
      ) : null}
    </article>
  );
}
