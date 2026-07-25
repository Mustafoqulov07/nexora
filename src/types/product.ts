export type ProductBadge = "hit" | "new" | "sale" | "exclusive";

export interface ProductSeller {
  id: string;
  name: string;
  avatarUrl: string | null;
  rating: number;
  isVerified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  currency: "RUB";
  categorySlug: string;
  categoryName: string;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  inStock: boolean;
  badges: ProductBadge[];
  seller: ProductSeller;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  productsCount: number;
  accentFrom: string;
  accentTo: string;
}
