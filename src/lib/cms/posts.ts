"use server";

import { client } from "../sanity";
import { POSTS_QUERY } from "../queries/posts";
import { groq } from "next-sanity";

export async function getPosts(): Promise<any[]> {
  try {
    return await client.fetch<any[]>(
      POSTS_QUERY,
      {},
      { next: { tags: ["post"] } },
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getArticleById(id: string): Promise<any | null> {
  try {
    const query = groq`*[_type == "post" && (slug.current == $id || _id == $id)][0] {
      _id,
      title,
      "slug": slug.current,
      category,
      date,
      readTime,
      image,
      description,
      intro,
      content,
      publishedAt,
      updatedAt,
      author-> {
        name,
        image
      }
    }`;
    return await client.fetch<any | null>(
      query,
      { id },
      { next: { tags: ["post"] } }
    );
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
}
