export interface Review {
  _id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
  avatar?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  order?: number;
}
