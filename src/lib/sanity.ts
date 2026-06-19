import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { env } from "./env";

export const client = createClient({
  projectId: env.projectId,
  dataset: env.dataset,
  apiVersion: "2026-01-01",
  useCdn: process.env.NODE_ENV === "production", // Enable CDN in production for better cache hits
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  if (!source) {
    return {
      url: () => "",
      width: () => ({ url: () => "" }),
      height: () => ({ url: () => "" }),
    };
  }
  return builder.image(source);
}

export function resolveImageUrl(image: any): string {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object" && image.asset) {
    return urlFor(image).url();
  }
  return "";
}

