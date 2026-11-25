import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.siteUrl.replace(/\/$/, "");
  const lastModified = new Date();

  return ["", "/demande", "/mentions-legales", "/confidentialite"].map(
    (path) => ({
      url: `${base}${path || "/"}`,
      lastModified,
      changeFrequency: path === "" ? "weekly" : "yearly",
      priority: path === "" ? 1 : 0.6,
    }),
  );
}
