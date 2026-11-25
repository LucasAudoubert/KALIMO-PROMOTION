import {
  DEMO_LOTS,
  isLotStatus,
  isLotType,
  sortLots,
  type Lot,
} from "@/lib/lots";
import { SITE } from "@/lib/site";

const AIRTABLE_API = "https://api.airtable.com/v0";

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

type AirtableListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

export class AirtableError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Airtable a répondu ${status}`);
    this.name = "AirtableError";
    this.status = status;
  }
}

export type DemandeInput = {
  nom: string;
  email: string;
  telephone?: string;
  message?: string;
  lotReference?: string;
};

function getConfig() {
  const token = process.env.AIRTABLE_TOKEN?.trim();
  const baseId = process.env.AIRTABLE_BASE_ID?.trim();
  if (!token || !baseId) return null;
  return {
    token,
    baseId,
    lotsTable: process.env.AIRTABLE_LOTS_TABLE?.trim() || "Lots",
    demandesTable:
      process.env.AIRTABLE_DEMANDES_TABLE?.trim() || "Demandes",
  };
}

/** Le site bascule en mode démonstration si Airtable n'est pas configuré. */
export function isAirtableConfigured(): boolean {
  return getConfig() !== null;
}

function tableUrl(baseId: string, table: string): string {
  return `${AIRTABLE_API}/${encodeURIComponent(baseId)}/${encodeURIComponent(table)}`;
}

async function airtableFetch(
  url: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
): Promise<Response> {
  const config = getConfig();
  if (!config) throw new AirtableError(503);

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    // On ne journalise jamais le corps de la réponse : il peut contenir des
    // données personnelles. Le statut suffit au diagnostic.
    throw new AirtableError(response.status);
  }

  return response;
}

function mapLot(record: AirtableRecord): Lot | null {
  const f = record.fields;
  const reference = typeof f["Référence"] === "string" ? f["Référence"].trim() : "";
  const type = f["Type"];
  const status = f["Statut"];
  const surface = Number(f["Surface (m²)"]);
  const floor = Number(f["Étage"] ?? 0);
  const price = Number(f["Prix (€)"]);

  if (
    !reference ||
    !isLotType(type) ||
    !isLotStatus(status) ||
    !Number.isFinite(surface) ||
    surface <= 0 ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    return null;
  }

  const demandCount = Number(f["Nb demandes"]);

  return {
    id: record.id,
    reference,
    type,
    surface,
    floor: Number.isFinite(floor) ? floor : 0,
    price,
    status,
    demandCount:
      Number.isFinite(demandCount) && demandCount >= 0 ? demandCount : undefined,
  };
}

/**
 * Liste les lots. Le cache Next est revalidé toutes les 60 s : un changement
 * de statut dans Airtable apparaît sans redéploiement.
 */
export async function getLots(): Promise<Lot[]> {
  const config = getConfig();
  if (!config) return sortLots(DEMO_LOTS);

  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  for (let page = 0; page < 10; page += 1) {
    const params = new URLSearchParams({
      pageSize: "100",
      "sort[0][field]": "Référence",
      "sort[0][direction]": "asc",
    });
    if (offset) params.set("offset", offset);

    const response = await airtableFetch(
      `${tableUrl(config.baseId, config.lotsTable)}?${params.toString()}`,
      { method: "GET", next: { revalidate: 60, tags: ["lots"] } },
    );
    const data = (await response.json()) as AirtableListResponse;
    records.push(...data.records);
    offset = data.offset;
    if (!offset) break;
  }

  return sortLots(
    records
      .map(mapLot)
      .filter((lot): lot is Lot => lot !== null),
  );
}

/** Échappe une valeur pour une formule Airtable (chaîne entre guillemets). */
function escapeFormulaValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function findLotRecordId(reference: string): Promise<string | null> {
  const config = getConfig();
  if (!config) return null;

  const params = new URLSearchParams({
    maxRecords: "1",
    filterByFormula: `{Référence}="${escapeFormulaValue(reference)}"`,
    "fields[0]": "Référence",
  });

  const response = await airtableFetch(
    `${tableUrl(config.baseId, config.lotsTable)}?${params.toString()}`,
    { method: "GET", next: { revalidate: 60, tags: ["lots"] } },
  );
  const data = (await response.json()) as AirtableListResponse;
  return data.records[0]?.id ?? null;
}

export type CreateDemandeResult = { demo: boolean };

/**
 * Écrit uniquement dans la table Demandes. Le statut de traitement et la
 * version du consentement sont imposés côté serveur.
 */
export async function createDemande(
  input: DemandeInput,
): Promise<CreateDemandeResult> {
  const config = getConfig();
  if (!config) {
    // Mode démonstration : aucune donnée n'est conservée.
    return { demo: true };
  }

  let lotRecordId: string | null = null;
  if (input.lotReference) {
    lotRecordId = await findLotRecordId(input.lotReference);
    if (!lotRecordId) {
      throw new DemandeLotError();
    }
  }

  const fields: Record<string, unknown> = {
    Nom: input.nom,
    Email: input.email,
    Message: input.message || "",
    Consentement: true,
    "Version du texte de consentement": SITE.consentVersion,
    Traitement: "Nouveau",
  };
  if (input.telephone) fields["Téléphone"] = input.telephone;
  if (lotRecordId) fields["Lot concerné"] = [lotRecordId];

  await airtableFetch(tableUrl(config.baseId, config.demandesTable), {
    method: "POST",
    body: JSON.stringify({
      records: [{ fields }],
      typecast: false,
    }),
    cache: "no-store",
  });

  return { demo: false };
}

/** Le lot transmis par le formulaire n'existe pas (ou plus) dans la base. */
export class DemandeLotError extends Error {
  constructor() {
    super("Lot introuvable");
    this.name = "DemandeLotError";
  }
}
