'use client'

import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartCardProps {
  title: string
  type: 'bar' | 'line'
  data: any[]
  xAxisKey: string
  yAxisKey: string
  barColor?: string
  lineColor?: string
}

export default function ChartCard({
  title,
  type,
  data,
  xAxisKey,
  yAxisKey,
  barColor = '#3b82f6',
  lineColor = '#6366f1'
}: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      {!data || data.length === 0 ? (
        <div className="h-[300px] flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-sm">No data available for this period</p>
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={xAxisKey} stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
              <Bar dataKey={yAxisKey} fill={barColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={xAxisKey} stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey={yAxisKey} stroke={lineColor} strokeWidth={3} dot={{ fill: lineColor, r: 5 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
