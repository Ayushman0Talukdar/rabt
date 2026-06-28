import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import schemaTypes from "./src/sanity/schemas";
import { env } from "./src/lib/env";

export default defineConfig({
  name: "default",
  title: "Rabt Content Hub",
  projectId: env.projectId || "mock_project_id",
  dataset: env.dataset || "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Content Manager")
          .items([
            // Singleton: Site Settings
            S.listItem()
              .title("Global Settings")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            
            // Singleton: Global SEO
            S.listItem()
              .title("Global SEO")
              .id("seo")
              .child(S.document().schemaType("seo").documentId("seo")),

            S.divider(),

            // Drag-and-drop Orderable Lists
            orderableDocumentListDeskItem({ type: "faq", title: "Order FAQs", S, context }),
            orderableDocumentListDeskItem({ type: "review", title: "Order Reviews", S, context }),
            orderableDocumentListDeskItem({ type: "workCard", title: "Order Work Cards", S, context }),
            orderableDocumentListDeskItem({ type: "video", title: "Order Videos", S, context }),
            orderableDocumentListDeskItem({ type: "pill", title: "Order Creator Tags", S, context }),
            orderableDocumentListDeskItem({ type: "post", title: "Order Blog Posts", S, context }),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
