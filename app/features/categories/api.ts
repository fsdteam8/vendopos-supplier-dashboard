import api from "@/lib/api/api";
import {
  CategoryParams,
  GetCategoriesResponse,
  GetRegionsResponse,
} from "./types";

export const getAllCategories = async (
  params?: CategoryParams,
): Promise<GetCategoriesResponse> => {
  const response = await api.get<GetCategoriesResponse>("/category/get-all", {
    params,
  });
  return response.data;
};

export const getAllRegions = async (): Promise<GetRegionsResponse> => {
  try {
    const response = await api.get<GetRegionsResponse>("category/get-region");
    return response.data;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
};
