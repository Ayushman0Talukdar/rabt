export default {
  name: "seo",
  title: "Global SEO",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Meta Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Meta Description",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "ogImage",
      title: "Open Graph Image",
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
};
