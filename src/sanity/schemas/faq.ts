import { orderRankField } from "@sanity/orderable-document-list";

export default {
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    orderRankField({ type: "faq" }),
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text", // Using text for FAQ answers as they are normally short plain text, but customizable
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer",
    },
  },
};
