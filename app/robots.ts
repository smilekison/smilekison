import type { MetadataRoute } from "next";
import { profile } from "@/lib/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${profile.domain}/sitemap.xml`,
  };
}
