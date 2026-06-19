import { groq } from "next-sanity";
export const REVIEWS_QUERY = groq`*[_type == "review"] | order(orderRank asc)`;
