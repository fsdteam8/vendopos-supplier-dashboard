import api from "@/lib/api/api";
import { GetOrdersResponse } from "./types";

export const getOrders = async (): Promise<GetOrdersResponse> => {
  const response = await api.get<GetOrdersResponse>("/order/supplier-orders");
  return response.data;
};
