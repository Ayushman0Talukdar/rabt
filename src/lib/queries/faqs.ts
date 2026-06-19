import { groq } from "next-sanity";
export const FAQS_QUERY = groq`*[_type == "faq"] | order(orderRank asc)`;
