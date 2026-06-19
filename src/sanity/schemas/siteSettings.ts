export default {
  name: "siteSettings",
  title: "Global Settings",
  type: "document",
  fields: [
    {
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "ctaText",
      title: "Call to Action Text",
      type: "string",
    },
    {
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
    },
  ],
};
