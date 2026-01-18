import type { LucideIcon } from "lucide-react"
import { memo } from "react"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  bgColor: string
  iconColor: string
}

const StatCardComponent = ({ label, value, icon: Icon, bgColor, iconColor }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2 text-pretty">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`${iconColor} w-6 h-6`} aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export const StatCard = memo(StatCardComponent)
StatCard.displayName = "StatCard"
