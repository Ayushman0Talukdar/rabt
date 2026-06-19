import { orderRankField } from "@sanity/orderable-document-list";

export default {
  name: "video",
  title: "Video",
  type: "document",
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
      validation: (Rule: any) => Rule.required(),
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
