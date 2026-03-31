import { useMutation, useQuery } from "@tanstack/react-query";
import { getProducts, updateProduct } from "../api";

export const useProducts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => getProducts({ page, limit }),
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateProduct(id, data),
  });
};


