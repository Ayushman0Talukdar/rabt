import { orderRankField } from "@sanity/orderable-document-list";

export default {
  name: "workCard",
  title: "Work Card",
  type: "document",
  fields: [
    orderRankField({ type: "workCard" }),
    {
      name: "name",
      title: "Creator/Project Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "role",
      title: "Role / Subtitle",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "metric",
      title: "Main Metric",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "highlight",
      title: "Growth Highlight",
      type: "string",
    },
    {
      name: "growth",
      title: "Growth Percentage",
      type: "string",
      initialValue: "305%",
    },
    {
      name: "platform",
      title: "Platform",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      options: {
        list: [
          { title: "YouTube", value: "YouTube" },
          { title: "Instagram", value: "Instagram" },
          { title: "TikTok", value: "TikTok" },
          { title: "LinkedIn", value: "LinkedIn" },
        ],
      },
    },
    {
      name: "image",
      title: "Project Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "image",
    },
  },
};
