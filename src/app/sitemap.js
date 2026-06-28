import { getPosts } from "@/lib/cms/posts";

export default async function sitemap() {
  const posts = await getPosts();
  const blogUrls = posts.map((post) => ({
    url: `https://rabt.com/content-secrets/${post.slug || post._id}`,
    lastModified: post.updatedAt || post.publishedAt || new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://rabt.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://rabt.com/content-secrets",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogUrls,
  ];
}
