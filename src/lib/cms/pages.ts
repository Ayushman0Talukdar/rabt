"use server";

import { client } from "../sanity";
import { SETTINGS_QUERY, SEO_QUERY } from "../queries/pages";
import { SiteSettings, SEO } from "../../types/pages";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch<SiteSettings | null>(
    SETTINGS_QUERY,
    {},
    { next: { tags: ["siteSettings"] } },
  );
}

export async function getSEO(): Promise<SEO | null> {
  return client.fetch<SEO | null>(SEO_QUERY, {}, { next: { tags: ["seo"] } });
}
