import { groq } from "next-sanity";
export const WORK_CARDS_QUERY = groq`*[_type == "workCard"] | order(orderRank asc)`;
