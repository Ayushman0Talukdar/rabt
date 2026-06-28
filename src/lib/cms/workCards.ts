"use server";

import { client } from "../sanity";
import { WORK_CARDS_QUERY } from "../queries/workCards";
import { WorkCard } from "../../types/workCard";

export async function getWorkCards(): Promise<WorkCard[]> {
  try {
    return await client.fetch<WorkCard[]>(
      WORK_CARDS_QUERY,
      {},
      { next: { tags: ["workCard"] } },
    );
  } catch (error) {
    console.error("Error fetching work cards:", error);
    return [];
  }
}
