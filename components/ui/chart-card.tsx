"use client"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { memo, useMemo } from "react"

interface ChartCardProps {
  title: string
  type: "bar" | "line"
  data: Array<{ name: string; value: number }>
}

const ChartCardComponent = ({ title, type, data }: ChartCardProps) => {
  // Memoize chart colors to prevent unnecessary re-renders
  const chartColors = useMemo(
    () => ({
      bar: "#09714E",
      line: "#09714E",
      grid: "#f0f0f0",
      axis: "#9ca3af",
    }),
    [],
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 text-pretty">{title}</h3>
      <div className="h-80" role="img" aria-label={`${title} chart`}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="name" stroke={chartColors.axis} />
              <YAxis stroke={chartColors.axis} />
              <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb" }} />
              <Bar dataKey="value" fill={chartColors.bar} radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="name" stroke={chartColors.axis} />
              <YAxis stroke={chartColors.axis} />
              <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb" }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColors.line}
                strokeWidth={2}
                dot={{ fill: chartColors.line, r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export const ChartCard = memo(ChartCardComponent)
ChartCard.displayName = "ChartCard"
