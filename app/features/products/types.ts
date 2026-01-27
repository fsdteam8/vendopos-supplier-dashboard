export interface ProductImage {
  public_id: string;
  url: string;
  _id: string;
}

export interface ProductVariant {
  label: string;
  price: number;
  stock: number;
  unit: string;
  discount: number;
  discountPrice: number;
  _id: string;
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

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
}

export interface Product {
  _id: string;
  userId: string;
  categoryId: string | null; // Updated: API returns null, not Category object
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
  discountPriceFrom?: number; 
  showOnlyDiscount?: number; 
  shelfLife: string;
  originCountry?: string;
  isHalal?: boolean;
  isOrganic?: boolean;
  isFrozen?: boolean;
  isKosher?: boolean;
  isVendorBrand?: boolean; 
  isPallet?: boolean; 
  seo?: ProductSEO; 
  averageRating?: number;
  totalRatings: number;
  status: string;
  isFeatured: boolean;
  isAvailable: boolean;
  addBy: string;
  wholesaleId?: string[];
  createdAt: string;
  updatedAt: string;
  // UI-only properties (not from API)
  quantity?: number;
  sales?: number;
  revenue?: number | string;
}

export interface ProductsMeta {
  page: number;
  limit: number;
  totalProducts: number;
  totalPage: number;
}

export interface ProductsAnalytics {
  totalProducts: number;
  totalOrder: number;
}

export interface ProductsData {
  data: Product[];
  meta: ProductsMeta;
  analytics: ProductsAnalytics;
}

export interface GetProductsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ProductsData; // Updated: Should be ProductsData, not Product[]
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Product;
}