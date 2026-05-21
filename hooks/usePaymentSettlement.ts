import { getPaymentSettlement, requestForTransfer } from '@/lib/api/paymentSttlement';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useAllSettlements = () => {
  return useQuery({
    queryKey: ['all-settlements'],
    queryFn: () => getPaymentSettlement(),
  });
};

export const useRequestForTransfer = () => {
  return useMutation({
    mutationFn: (settlementId: string) => requestForTransfer(settlementId),
  });
};
