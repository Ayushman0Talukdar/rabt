export interface SiteSettings {
  _id: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText?: string;
  contactEmail?: string;
}

export interface SEO {
  _id: string;
  title: string;
  description: string;
  ogImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
}
