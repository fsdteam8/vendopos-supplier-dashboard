export interface Category {
  _id: string;
  region: string;
  slug: string;
  productType: string;
  productName: string[];
  country: string[];
  createdAt: string;
  updatedAt: string;
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
