export interface Video {
  _id: string;
  videoId?: string;
  videoUrl?: string;
  category: "short-form" | "long-form" | "distribution" | "saas";
  type: "reel" | "video" | "podcast";
  title?: string;
  description?: string;
  tags?: string[];
  order?: number;
}
