export interface ProductCategory {
  productType: string;
  productName: string[];
}

export interface Category {
  categories: ProductCategory[];
  _id: string;
  region: string;
  slug?: string;
  country: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRegion {
  _id: string;
  region: string;
}

export interface GetRegionsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: CategoryRegion[];
}

export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Category[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface CategoryParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
  productType?: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  statusCode: number;
  filters?: {
    productNames: string[];
    productTypes: string[];
  };
  data: Category[];
  meta: CategoryMeta;
}

export interface CategoryMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}
