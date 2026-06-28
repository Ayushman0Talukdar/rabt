import { orderRankField } from "@sanity/orderable-document-list";

export default {
  name: "video",
  title: "Video",
  type: "document",
  validation: (Rule: any) =>
    Rule.custom((fields: any) => {
      if (!fields) return true;
      if (!fields.videoId && !fields.videoUrl) {
        return "You must provide either a YouTube Video ID or a Video URL.";
      }
      return true;
    }),
  fields: [
    orderRankField({ type: "video" }),
    {
      name: "title",
      title: "Section Title",
      type: "string",
    },
    {
      name: "videoId",
      title: "YouTube Video ID",
      type: "string",
    },
    {
      name: "videoUrl",
      title: "Video URL (Cloudinary, etc.)",
      type: "string",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      options: {
        list: [
          { title: "Short-Form", value: "short-form" },
          { title: "Long Form", value: "long-form" },
          { title: "Distribution", value: "distribution" },
          { title: "SaaS", value: "saas" },
        ],
      },
    },
    {
      name: "type",
      title: "Video Format Type",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      options: {
        list: [
          { title: "Normal Video (Horizontal)", value: "video" },
          { title: "Reel / Short / Clip (Vertical)", value: "reel" },
          { title: "Podcast (Horizontal)", value: "podcast" },
        ],
      },
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "videoId",
    },
  },
};
