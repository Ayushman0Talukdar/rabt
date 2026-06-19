export const env = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiToken: process.env.SANITY_API_TOKEN!,
  previewSecret: process.env.SANITY_PREVIEW_SECRET || "rabt-preview-secret",
};

const missing = Object.entries(env)
  .filter(([key, value]) => !value && key !== "apiToken" && typeof window === "undefined")
  .map(([key]) => key);

if (missing.length > 0) {
  console.warn(`[Warning] Missing environment variables: ${missing.join(", ")}`);
}
export default env;
