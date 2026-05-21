import { useMutation, useQuery } from '@tanstack/react-query';
import { getOrders, updateOrderStatus } from '../api';

import { GetOrdersParams } from '../types';

export const useOrders = (params: GetOrdersParams = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
  });
};

export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      itemId,
      status,
    }: {
      orderId: string;
      itemId: string;
      status: string;
    }) => updateOrderStatus(orderId, itemId, status),
  });
};
