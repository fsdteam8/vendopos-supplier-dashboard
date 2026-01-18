import { useQuery, useMutation } from "@tanstack/react-query";
import { getProducts, updateProduct } from "../api";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateProduct(id, data),
  });
};
