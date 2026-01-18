import api from "@/lib/api/api";
import { GetCategoriesResponse } from "./types";

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const response = await api.get<GetCategoriesResponse>("/category/get-all");
  return response.data;
};
