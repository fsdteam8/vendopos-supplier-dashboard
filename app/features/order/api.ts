import api from "@/lib/api/api";
import { GetOrdersResponse } from "./types";

import { GetOrdersParams } from "./types";

export const getOrders = async (params: GetOrdersParams = {}): Promise<GetOrdersResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.orderStatus && params.orderStatus !== "all") queryParams.append("orderStatus", params.orderStatus);
  if (params.paymentStatus && params.paymentStatus !== "all") queryParams.append("paymentStatus", params.paymentStatus);
  if (params.paymentType && params.paymentType !== "all") queryParams.append("paymentType", params.paymentType);
  if (params.sort) queryParams.append("sort", params.sort);

  const response = await api.get<GetOrdersResponse>(`/order/supplier-orders?${queryParams.toString()}`);
  return response.data;
};
