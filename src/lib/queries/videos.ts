import { groq } from "next-sanity";
export const VIDEOS_QUERY = groq`*[_type == "video"] | order(orderRank asc)`;
