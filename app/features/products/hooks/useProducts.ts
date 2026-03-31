import { useMutation, useQuery } from "@tanstack/react-query";
import { getProducts, updateProduct } from "../api";
import { ProductParams } from "../types";

export const useProducts = (params: ProductParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateProduct(id, data),
  });
};


