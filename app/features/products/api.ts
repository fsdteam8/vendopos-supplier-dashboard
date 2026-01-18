import api from "@/lib/api/api";
import { GetProductsResponse, CreateProductResponse } from "./types";

export const getProducts = async (): Promise<GetProductsResponse> => {
  const response = await api.get<GetProductsResponse>("/product/my-added");
  return response.data;
};

export const createProduct = async (data: FormData): Promise<CreateProductResponse> => {
  const response = await api.post<CreateProductResponse>("/product/create-product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
