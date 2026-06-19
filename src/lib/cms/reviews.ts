"use server";

import { client } from "../sanity";
import { REVIEWS_QUERY } from "../queries/reviews";
import { Review } from "../../types/review";

export async function getReviews(): Promise<Review[]> {
  return client.fetch<Review[]>(
    REVIEWS_QUERY,
    {},
    { next: { tags: ["review"] } },
  );
}
