'use client'

import React from 'react'
import ChartCard from './ChartCard'
import { useSalesTrend } from '@/hooks/useOverView'
import { ProductAnalyticsApiResponse } from '@/types/overview'

const SalesByRegion = () => {
  const currentYear = "2026"
    
  const { data: salesTrendResult, isLoading: salesTrendLoading } = useSalesTrend(currentYear)
      const salesTrend = salesTrendResult?.data?.chart || []
//   const weeklySalesTrendData = [
//     { month: 'Mon', totalProductSold: 25 },
//     { month: 'Tue', totalProductSold: 35 },
//     { month: 'Wed', totalProductSold: 28 },
//     { month: 'Thu', totalProductSold: 42 },
//     { month: 'Fri', totalProductSold: 50 },
//     { month: 'Sat', totalProductSold: 70 },
//     { month: 'Sun', totalProductSold: 45 }
//   ]
console.log('ddddd',salesTrend)
  return (
    <ChartCard 
      title="Weekly Sales Trend" 
      type="line" 
      data={salesTrend}
      xAxisKey="month"
      yAxisKey="totalProductSold"
      lineColor="#6366f1"
    />
  )
}

export default SalesByRegion
