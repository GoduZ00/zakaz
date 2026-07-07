export interface Product {
  id: number;
  subcategory_id: number | null;
  name: string;
  slug: string;
  article: string | null;
  description: string | null;
  price: number;
  price_wholesale: number | null;
  price_opt: number | null;
  stock_status: string;
  quantity: number;
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
