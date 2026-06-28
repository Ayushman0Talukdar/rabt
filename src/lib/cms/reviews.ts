"use server";

import { client } from "../sanity";
import { REVIEWS_QUERY } from "../queries/reviews";
import { Review } from "../../types/review";

export async function getReviews(): Promise<Review[]> {
  try {
    return await client.fetch<Review[]>(
      REVIEWS_QUERY,
      {},
      { next: { tags: ["review"] } },
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}
