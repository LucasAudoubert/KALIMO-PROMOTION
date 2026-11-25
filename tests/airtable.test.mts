import assert from "node:assert/strict";

process.env.AIRTABLE_TOKEN = "pat_test";
process.env.AIRTABLE_BASE_ID = "app_test";
process.env.AIRTABLE_LOTS_TABLE = "Lots";
process.env.AIRTABLE_DEMANDES_TABLE = "Demandes";

type Captured = { url: string; init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } };
let calls: Captured[] = [];
let postedBody: unknown = null;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const page1 = {
  records: [
    {
      id: "rec1",
      fields: {
        "Référence": "A-101",
        Type: "T2",
        "Surface (m²)": 44,
        Étage: 0,
        "Prix (€)": 238000,
        Statut: "Disponible",
        "Nb demandes": 2,
      },
    },
    {
      id: "recInvalid",
      fields: {
        "Référence": "A-102",
        Type: "T2",
        "Surface (m²)": 46,
        "Prix (€)": 0,
        Statut: "Vendu",
      },
    },
  ],
  offset: "page2",
};

const page2 = {
  records: [
    {
      id: "rec3",
      fields: {
        "Référence": "A-201",
        Type: "T3",
        "Surface (m²)": 65,
        Étage: 1,
        "Prix (€)": 315000,
        Statut: "Optionné",
      },
    },
  ],
};

globalThis.fetch = async (input, init = {}) => {
  const url = String(input);
  calls.push({ url, init: init as Captured["init"] });

  if (url.includes("/Lots?")) {
    if (url.includes("filterByFormula")) {
      return json({ records: [{ id: "rec103", fields: { "Référence": "A-103" } }] });
    }
    if (url.includes("offset=page2")) return json(page2);
    return json(page1);
  }

  if (url.includes("/Demandes") && init.method === "POST") {
    postedBody = JSON.parse(String(init.body));
    return json({ records: [{ id: "recNew" }] }, 201);
  }

  throw new Error(`Appel inattendu : ${url}`);
};

const {
  AirtableError,
  DemandeLotError,
  createDemande,
  getLots,
} = await import("../lib/airtable.ts");

const lots = await getLots();
assert.deepEqual(
  lots.map((lot) => lot.reference),
  ["A-101", "A-201"],
  "pagination, tri et filtrage des enregistrements invalides",
);
assert.equal(lots[0].demandCount, 2, "comptage des demandes");
assert.equal(calls[0].init.next?.revalidate, 60, "cache de 60 secondes");
assert.ok(calls[0].init.next?.tags?.includes("lots"), "tag de cache lots");
assert.equal(calls[0].url.includes("sort%5B0%5D%5Bfield%5D"), true, "tri demandé à Airtable");

const result = await createDemande({
  nom: "Camille Durand",
  email: "camille@example.com",
  lotReference: "A-103",
});
assert.equal(result.demo, false, "écriture réelle");
assert.ok(postedBody, "POST Demandes effectué");
const payload = postedBody as { records: { fields: Record<string, unknown> }[] };
assert.equal(payload.records.length, 1, "une seule demande créée");
assert.deepEqual(
  payload.records[0].fields,
  {
    Nom: "Camille Durand",
    Email: "camille@example.com",
    Message: "",
    Consentement: true,
    "Version du texte de consentement": "2026-11-25",
    Traitement: "Nouveau",
    "Lot concerné": ["rec103"],
  },
  "payload Airtable exact, sans champ supplémentaire",
);

await createDemande({
  nom: "Sans lot",
  email: "sans-lot@example.com",
  telephone: "06 12 34 56 78",
  message: "Une question.",
});
const second = postedBody as { records: { fields: Record<string, unknown> }[] };
assert.equal(second.records[0].fields["Téléphone"], "06 12 34 56 78", "téléphone optionnel");
assert.equal(second.records[0].fields["Lot concerné"], undefined, "pas de lien sans lot");

globalThis.fetch = async () => json({ records: [] });
await assert.rejects(
  () => createDemande({ nom: "Inconnu", email: "inconnu@example.com", lotReference: "Z-999" }),
  DemandeLotError,
  "lot inconnu refusé",
);

globalThis.fetch = async () => json({ error: "AUTHENTICATION_REQUIRED" }, 401);
await assert.rejects(
  () => getLots(),
  (error: unknown) => error instanceof AirtableError && error.status === 401,
  "erreur Airtable propagée sans fuite de données",
);

delete process.env.AIRTABLE_TOKEN;
const demoLots = await getLots();
assert.equal(demoLots.length, 12, "mode démo : 12 lots");
const demoResult = await createDemande({ nom: "Test", email: "test@example.com" });
assert.equal(demoResult.demo, true, "mode démo : aucune écriture");

console.log(
  "Airtable : lecture, pagination, mapping, écriture, erreurs et mode démo validés.",
);
