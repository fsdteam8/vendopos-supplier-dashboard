import { useQuery } from "@tanstack/react-query";
import { getAllCategories, getAllRegions } from "../api";
import { CategoryParams, CategoryResponse } from "../types";

export const useAllCategories = (params?: CategoryParams) => {
  return useQuery<CategoryResponse>({
    queryKey: ["all-categories", params],
    queryFn: () => getAllCategories(params),
  });
};

export const useGetAllRegions = () => {
  return useQuery({
    queryKey: ["all-regions"],
    queryFn: () => getAllRegions(),
  });
};