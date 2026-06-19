import { groq } from "next-sanity";
export const PILLS_QUERY = groq`*[_type == "pill"] | order(orderRank asc)`;
