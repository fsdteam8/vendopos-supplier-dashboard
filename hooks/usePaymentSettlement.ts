import { getPaymentSettlement } from "@/lib/api/paymentSttlement";
import { useQuery } from "@tanstack/react-query";

export const useAllSettlements = () => {
  return useQuery({
    queryKey: ["all-settlements",],
    queryFn: () => getPaymentSettlement(),
  });
};


