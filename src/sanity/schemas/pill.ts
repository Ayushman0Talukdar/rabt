import { orderRankField } from "@sanity/orderable-document-list";

export default {
  name: "pill",
  title: "Creator Tag",
  type: "document",
  fields: [
    orderRankField({ type: "pill" }),
    {
      name: "label",
      title: "Tag Label",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "row",
      title: "Row",
      type: "number",
      validation: (Rule: any) => Rule.required().min(1).max(3),
    },
    {
      name: "avatar",
      title: "Avatar Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    },
    {
      name: "theme",
      title: "Theme Colors",
      type: "object",
      fields: [
        { name: "avatarBg", title: "Avatar Background Color", type: "string" },
        { name: "pillBg", title: "Pill Background Color", type: "string" },
        { name: "border", title: "Border Color", type: "string" },
        { name: "glow", title: "Glow Color", type: "string" },
      ],
    },
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "row",
      media: "avatar",
    },
  },
};
