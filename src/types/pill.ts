export interface PillTheme {
  avatarBg?: string;
  pillBg?: string;
  border?: string;
  glow?: string;
}

export interface Pill {
  _id: string;
  label: string;
  row: number;
  avatarUrl?: string;
  avatar?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  theme?: PillTheme;
  order?: number;
}
