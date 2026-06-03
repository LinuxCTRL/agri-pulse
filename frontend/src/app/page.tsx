"use client"

import { useCrops } from "@/hooks/use-crops"
import { useVarieties } from "@/hooks/use-varieties"
import { Sprout, Leaf, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const { data: crops, isLoading: isLoadingCrops } = useCrops()
  const { data: varieties, isLoading: isLoadingVarieties } = useVarieties()

  const stats = [
    {
      label: "Total Crops",
      value: crops?.length ?? 0,
      icon: Sprout,
      loading: isLoadingCrops,
      description: "Available crop species"
    },
    {
      label: "Total Varieties",
      value: varieties?.length ?? 0,
      icon: Leaf,
      loading: isLoadingVarieties,
      description: "Total unique varieties"
    },
    {
      label: "System Status",
      value: "Online",
      icon: Activity,
      loading: false,
      description: "API Connectivity"
    },
  ]

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome to your agricultural intelligence platform.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stat.loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
