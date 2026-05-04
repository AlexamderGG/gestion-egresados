// components/dashboard/KpiCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; positive: boolean }
  className?: string
}

export function KpiCard({ title, value, icon, trend, className }: KpiCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 text-primary-500">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1", trend.positive ? "text-success" : "text-error")}>
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% respecto al mes anterior
          </p>
        )}
      </CardContent>
    </Card>
  )
}