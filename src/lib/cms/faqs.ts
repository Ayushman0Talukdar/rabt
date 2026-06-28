"use server";

import { client } from "../sanity";
import { FAQS_QUERY } from "../queries/faqs";
import { FAQ } from "../../types/faq";

export async function getFAQs(): Promise<FAQ[]> {
  try {
    return await client.fetch<FAQ[]>(FAQS_QUERY, {}, { next: { tags: ["faq"] } });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}
