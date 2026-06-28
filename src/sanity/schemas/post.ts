export default {
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Hook Strategy", value: "Hook Strategy" },
          { title: "Production Flow", value: "Production Flow" },
          { title: "Audio Engineering", value: "Audio Engineering" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "date",
      title: "Publish Date",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "readTime",
      title: "Read Time",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "image",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Short Description / Excerpt",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "intro",
      title: "Article Introduction",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "content",
      title: "Content Blocks",
      type: "array",
      of: [
        {
          type: "object",
          name: "contentBlock",
          title: "Content Block",
          fields: [
            {
              name: "type",
              title: "Block Type",
              type: "string",
              options: {
                list: [
                  { title: "Heading", value: "heading" },
                  { title: "Paragraph", value: "paragraph" },
                ],
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "text",
              title: "Text",
              type: "text",
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
    },
  },
};
