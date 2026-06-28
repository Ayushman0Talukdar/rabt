"use server";

import { client } from "../sanity";
import { PILLS_QUERY } from "../queries/pills";
import { Pill } from "../../types/pill";

export async function getPills(): Promise<Pill[]> {
  try {
    return await client.fetch<Pill[]>(PILLS_QUERY, {}, { next: { tags: ["pill"] } });
  } catch (error) {
    console.error("Error fetching pills:", error);
    return [];
  }
}
