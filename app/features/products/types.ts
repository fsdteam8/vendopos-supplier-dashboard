export interface ProductImage {
  public_id: string;
  url: string;
  _id: string;
}

export interface ProductVariant {
  discount: number;
  label: string;
  price: number;
  stock: number;
  unit: string;
  _id: string;
  discountPrice?: number;
}

export interface ProductVariantInput {
  label: string;
  price: number;
  stock: number;
  unit: string;
  discount: number;
}

export interface Category {
  _id: string;
  region: string;
}

export interface Product {
  _id: string;
  userId: string;
  categoryId: Category;
  supplierId: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: ProductImage[];
  productType: string;
  productName: string;
  variants: ProductVariant[];
  priceFrom: number;
  shelfLife: string;
  originCountry: string;
  isHalal: boolean;
  isOrganic: boolean;
  isFrozen: boolean;
  isKosher: boolean;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  isAvailable: boolean;
  quantity: number;
  sales?: number; // Kept as optional if not in API but used in UI
  revenue?: number | string; // Kept as optional if not in API but used in UI
}

export interface GetProductsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Product[];
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Product;
}
