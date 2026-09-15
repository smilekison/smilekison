import type { MetadataRoute } from "next";
import { profile, projects } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${profile.domain}`;
  return [
    { url: base, priority: 1 },
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, priority: 0.7 })),
  ];
}
