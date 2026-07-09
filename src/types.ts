export interface Characteristic {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  subcategory_id: number | null;
  name: string;
  slug: string;
  article: string | null;
  description: string | null;
  characteristics: Characteristic[];
  price: number;
  price_wholesale: number | null;
  price_opt: number | null;
  price_large_wholesale: number | null;
  stock_status: string;
  quantity: number;
  box_quantity?: number;
  box_label?: string;
  images: string[];
  sku_variants: SkuVariant[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkuVariant {
  article: string;
  label: string;
  price?: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  sku?: SkuVariant;
}
