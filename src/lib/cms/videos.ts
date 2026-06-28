"use server";

import { client } from "../sanity";
import { VIDEOS_QUERY } from "../queries/videos";
import { Video } from "../../types/video";

export async function getVideos(): Promise<Video[]> {
  try {
    return await client.fetch<Video[]>(VIDEOS_QUERY, {}, { next: { tags: ["video"] } });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}
