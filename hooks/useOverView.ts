import { getAnalytics, getProductsRevenue, getSalesTrend } from "@/lib/api/overview";
import {  useQuery } from "@tanstack/react-query";

export function useProductsRevenue(year: string | number = "2026") {
    return useQuery({
    queryKey :['profile', year],
    queryFn:()=> getProductsRevenue(year)
    })
    
}


export function useSalesTrend(year: string | number = "2026") {
    return useQuery({
        queryKey: ['sales-by-region', year],
        queryFn: () => getSalesTrend(year)
    })
}

export  function useAnalytics() {
    return useQuery({
        queryKey: ['overview-data'],
        queryFn: () => getAnalytics(),
    })
}