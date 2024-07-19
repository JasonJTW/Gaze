export interface imageItem {
  id: number;
  photo_id: number;
  category_id: number;
  series_id: number;
  url: string;
  photographer: string | null;
  category: string | null;
  original_name: string;
  exif: ExifData | null;
  created_at: string;
  updated_at: string;
  blurhash: string | null;
}

export interface ExifData extends Record<string, unknown> {
  XDimension?: number;
  YDimension?: number;
  // 添加你知道的其他属性
}
