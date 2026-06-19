import { orderRankField } from "@sanity/orderable-document-list";

export default {
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    orderRankField({ type: "review" }),
    {
      name: "name",
      title: "Client Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "role",
      title: "Client Role",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "quote",
      title: "Quote",
      type: "text",
      validation: (Rule: any) => Rule.required().max(500),
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
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "avatar",
    },
  },
};
