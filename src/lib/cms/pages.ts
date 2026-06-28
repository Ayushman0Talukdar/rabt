"use server";

import { client } from "../sanity";
import { SETTINGS_QUERY, SEO_QUERY } from "../queries/pages";
import { SiteSettings, SEO } from "../../types/pages";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch<SiteSettings | null>(
      SETTINGS_QUERY,
      {},
      { next: { tags: ["siteSettings"] } },
    );
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

export async function getSEO(): Promise<SEO | null> {
  try {
    return await client.fetch<SEO | null>(SEO_QUERY, {}, { next: { tags: ["seo"] } });
  } catch (error) {
    console.error("Error fetching SEO settings:", error);
    return null;
  }
}
