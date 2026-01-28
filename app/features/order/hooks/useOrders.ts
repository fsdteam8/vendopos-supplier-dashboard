import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api";

import { GetOrdersParams } from "../types";

export const useOrders = (params: GetOrdersParams = {}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
  });
};
