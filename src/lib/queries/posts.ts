import { groq } from "next-sanity";

export const POSTS_QUERY = groq`*[_type == "post"] {
  _id,
  title,
  "slug": slug.current,
  category,
  date,
  readTime,
  image,
  description,
  intro,
  content
}`;
