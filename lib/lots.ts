export type LotType = "T2" | "T3" | "T4";
export type LotStatus = "Disponible" | "Optionné" | "Vendu";

export type Lot = {
  id: string;
  reference: string;
  type: LotType;
  surface: number;
  floor: number;
  price: number;
  status: LotStatus;
  demandCount?: number;
};

export const LOT_TYPES: LotType[] = ["T2", "T3", "T4"];
export const LOT_STATUSES: LotStatus[] = ["Disponible", "Optionné", "Vendu"];

/**
 * Jeu de données fictif utilisé tant que les variables Airtable ne sont pas
 * renseignées. Il permet de présenter et tester le site sans base.
 */
export const DEMO_LOTS: Lot[] = [
  {
    id: "demo-a101",
    reference: "A-101",
    type: "T2",
    surface: 44,
    floor: 0,
    price: 238_000,
    status: "Disponible",
  },
  {
    id: "demo-a102",
    reference: "A-102",
    type: "T2",
    surface: 46,
    floor: 0,
    price: 249_000,
    status: "Vendu",
  },
  {
    id: "demo-a103",
    reference: "A-103",
    type: "T3",
    surface: 64,
    floor: 0,
    price: 318_000,
    status: "Disponible",
  },
  {
    id: "demo-a104",
    reference: "A-104",
    type: "T3",
    surface: 67,
    floor: 0,
    price: 332_000,
    status: "Optionné",
  },
  {
    id: "demo-a201",
    reference: "A-201",
    type: "T2",
    surface: 45,
    floor: 1,
    price: 252_000,
    status: "Disponible",
  },
  {
    id: "demo-a202",
    reference: "A-202",
    type: "T3",
    surface: 66,
    floor: 1,
    price: 329_000,
    status: "Disponible",
  },
  {
    id: "demo-a203",
    reference: "A-203",
    type: "T4",
    surface: 88,
    floor: 1,
    price: 421_000,
    status: "Disponible",
  },
  {
    id: "demo-a204",
    reference: "A-204",
    type: "T4",
    surface: 91,
    floor: 1,
    price: 438_000,
    status: "Optionné",
  },
  {
    id: "demo-a301",
    reference: "A-301",
    type: "T3",
    surface: 68,
    floor: 2,
    price: 341_000,
    status: "Disponible",
  },
  {
    id: "demo-a302",
    reference: "A-302",
    type: "T3",
    surface: 70,
    floor: 2,
    price: 352_000,
    status: "Vendu",
  },
  {
    id: "demo-a303",
    reference: "A-303",
    type: "T4",
    surface: 93,
    floor: 2,
    price: 449_000,
    status: "Disponible",
  },
  {
    id: "demo-a401",
    reference: "A-401",
    type: "T4",
    surface: 96,
    floor: 3,
    price: 468_000,
    status: "Optionné",
  },
];

export function isLotType(value: unknown): value is LotType {
  return value === "T2" || value === "T3" || value === "T4";
}

export function isLotStatus(value: unknown): value is LotStatus {
  return value === "Disponible" || value === "Optionné" || value === "Vendu";
}

export function sortLots(lots: Lot[]): Lot[] {
  return [...lots].sort((a, b) =>
    a.reference.localeCompare(b.reference, "fr", { numeric: true }),
  );
}

export function lotTypeLabel(type: LotType): string {
  if (type === "T2") return "2 pièces";
  if (type === "T3") return "3 pièces";
  return "4 pièces";
}

export function floorLabel(floor: number): string {
  if (floor <= 0) return "Rez-de-jardin";
  if (floor === 1) return "1er étage";
  return `${floor}e étage`;
}

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const surfaceFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

export function formatSurface(surface: number): string {
  return `${surfaceFormatter.format(surface)} m²`;
}
