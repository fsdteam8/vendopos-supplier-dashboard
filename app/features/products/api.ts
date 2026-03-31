import api from "@/lib/api/api";
import { CreateProductResponse, GetProductsResponse } from "./types";

export const getProducts = async (params?: {
  page?: number;
  limit?: number;
}): Promise<GetProductsResponse> => {
  const response = await api.get<GetProductsResponse>("/product/my-added", {
    params,
  });
  return response.data;
};

export const createProduct = async (
  data: FormData,
): Promise<CreateProductResponse> => {
  const response = await api.post<CreateProductResponse>(
    "/product/create-product",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: FormData,
): Promise<CreateProductResponse> => {
  const response = await api.put<CreateProductResponse>(
    `/product/update-product/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
