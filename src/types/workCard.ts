export interface WorkCard {
  _id: string;
  name: string;
  role: string;
  metric: string;
  highlight?: string;
  growth: string;
  platform: string;
  image:
    | string
    | {
        asset: {
          _ref: string;
        };
        alt?: string;
      };
  order?: number;
}
