"use server";

import { client } from "../sanity";
import { WORK_CARDS_QUERY } from "../queries/workCards";
import { WorkCard } from "../../types/workCard";

export async function getWorkCards(): Promise<WorkCard[]> {
  return client.fetch<WorkCard[]>(
    WORK_CARDS_QUERY,
    {},
    { next: { tags: ["workCard"] } },
  );
}
