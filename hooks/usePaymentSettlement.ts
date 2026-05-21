import { getPaymentSettlement, requestForTransfer } from '@/lib/api/paymentSttlement';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAllSettlements = () => {
  return useQuery({
    queryKey: ['all-settlements'],
    queryFn: () => getPaymentSettlement(),
  });
};

export const useRequestForTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settlementId: string) => requestForTransfer(settlementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-settlements'] });
    },
  });
};
