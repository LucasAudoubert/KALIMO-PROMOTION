import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  AirtableError,
  createDemande,
  DemandeLotError,
  isAirtableConfigured,
} from "@/lib/airtable";
import { rateLimit } from "@/lib/rate-limit";
import { validateDemande } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStore(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "inconnu";
  // L'adresse IP n'est jamais conservée en clair, même en mémoire.
  return createHash("sha256")
    .update(`${ip}:${process.env.RATE_LIMIT_SALT ?? "jardins-de-vauban"}`)
    .digest("hex")
    .slice(0, 24);
}

export async function POST(request: Request) {
  // Protection simple contre les soumissions cross-origin.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin) {
    try {
      if (!host || new URL(origin).host !== host) {
        return noStore(
          { errors: { form: "Requête refusée." } },
          403,
        );
      }
    } catch {
      return noStore({ errors: { form: "Requête refusée." } }, 403);
    }
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 20_000) {
    return noStore(
      { errors: { form: "Le formulaire est trop volumineux." } },
      413,
    );
  }

  const limit = rateLimit(clientKey(request));
  if (!limit.allowed) {
    return NextResponse.json(
      {
        errors: {
          form: "Trop de demandes envoyées récemment. Merci de réessayer dans quelques minutes.",
        },
      },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(limit.retryAfterSeconds),
        },
      },
    );
  }

  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 20_000) {
      return noStore(
        { errors: { form: "Le formulaire est trop volumineux." } },
        413,
      );
    }
    payload = JSON.parse(raw);
  } catch {
    return noStore(
      { errors: { form: "Le formulaire n'a pas pu être lu." } },
      400,
    );
  }

  // Champ piège : réponse identique à un succès pour ne pas guider les robots.
  if (
    payload &&
    typeof payload === "object" &&
    typeof (payload as Record<string, unknown>).site === "string" &&
    String((payload as Record<string, unknown>).site).length > 0
  ) {
    return noStore({ ok: true, demo: !isAirtableConfigured() }, 201);
  }

  const result = validateDemande(payload);
  if (!result.ok) {
    return noStore({ errors: result.errors }, 400);
  }

  try {
    const { demo } = await createDemande(result.data);
    return noStore({ ok: true, demo }, 201);
  } catch (error) {
    if (error instanceof DemandeLotError) {
      return noStore(
        {
          errors: {
            lot: "Ce lot n'est plus référencé. Merci de choisir un autre lot ou « Aucun lot en particulier ».",
          },
        },
        400,
      );
    }

    // Aucune donnée du formulaire n'est journalisée.
    const status = error instanceof AirtableError ? error.status : 500;
    console.error(`[demandes] échec de l'enregistrement (statut ${status})`);

    return noStore(
      {
        errors: {
          form: "Votre demande n'a pas pu être enregistrée. Merci de réessayer dans un instant.",
        },
      },
      502,
    );
  }
}
