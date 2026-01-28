'use client'

import React from 'react'
import ChartCard from './ChartCard'
import { ProductAnalyticsApiResponse } from '@/types/overview'
import { useProductsRevenue } from '@/hooks/useOverView'

const Revenue = () => {
  const currentYear = "2026"
    
      const { data: revenueResult, isLoading: revenueLoading } = useProductsRevenue(currentYear)
      const productsRevenue = revenueResult?.data?.chart || []
  console.log('product',productsRevenue)
  return (
    <ChartCard 
      title="Sales by Product" 
      type="bar" 
      data={productsRevenue}
      xAxisKey="month"
      yAxisKey="totalRevenue"
      barColor="#3b82f6"
    />
  )
}

export default Revenue
