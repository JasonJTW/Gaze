export interface imageItem {
  id: number;
  photo_id: number;
  category_id: number;
  series_id: number;
  url: string;
  photographer: string | null;
  category: string | null;
  original_name: string;
  exif: object | null;
  created_at: string;
  updated_at: string;
}
