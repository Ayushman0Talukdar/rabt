"use server";

import { client } from "../sanity";
import { VIDEOS_QUERY } from "../queries/videos";
import { Video } from "../../types/video";

export async function getVideos(): Promise<Video[]> {
  return client.fetch<Video[]>(VIDEOS_QUERY, {}, { next: { tags: ["video"] } });
}
