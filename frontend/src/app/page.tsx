"use client";

import { Activity, Leaf, Sprout, HomeIcon, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCrops } from "@/hooks/use-crops";
import { useVarieties } from "@/hooks/use-varieties";
import { usePlantings } from "@/hooks/use-plantings";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: crops, isLoading: isLoadingCrops } = useCrops();
  const { data: varieties, isLoading: isLoadingVarieties } = useVarieties();
  const { data: plantings, isLoading: isLoadingPlantings } = usePlantings();

  const stats = [
    {
      label: "My Garden",
      value: plantings?.length ?? 0,
      icon: HomeIcon,
      loading: isLoadingPlantings,
      description: "Active plantings tracking",
      color: "bg-blue-500",
      link: "/garden"
    },
    {
      label: "Total Crops",
      value: crops?.length ?? 0,
      icon: Sprout,
      loading: isLoadingCrops,
      description: "Botanical species",
      color: "bg-emerald-500",
      link: "/crops"
    },
    {
      label: "Varieties",
      value: varieties?.length ?? 0,
      icon: Leaf,
      loading: isLoadingVarieties,
      description: "Unique cultivars",
      color: "bg-green-600",
      link: "/varieties"
    },
    {
      label: "Intelligence",
      value: "98%",
      icon: TrendingUp,
      loading: false,
      description: "Data accuracy",
      color: "bg-orange-500",
      link: "/"
    },
  ];

  return (
    <div className="container mx-auto p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            Pulse <span className="text-primary">Overview</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Welcome back. Your agricultural ecosystem is currently thriving with 
            <span className="font-bold text-slate-900"> {varieties?.length.toLocaleString() ?? "..."} </span> 
            cataloged varieties.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="rounded-full px-6 shadow-xl shadow-primary/20 bg-primary hover:scale-105 transition-transform"
            onClick={() => router.push("/varieties")}
          >
            Explore Catalog
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full px-6 bg-white/50 backdrop-blur-sm hover:bg-white"
            onClick={() => router.push("/garden")}
          >
            My Garden
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {stats.map((stat) => (
          <Card 
            key={stat.label} 
            className="card-hover border-none shadow-sm bg-white cursor-pointer group relative overflow-hidden"
            onClick={() => router.push(stat.link)}
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.color}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black text-slate-900">
                  {stat.loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    stat.value
                  )}
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
           <CardHeader className="border-b bg-white/30 px-6 py-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Ecosystem Health
              </CardTitle>
           </CardHeader>
           <CardContent className="p-8">
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="bg-primary/5 p-6 rounded-full">
                    <Sprout className="h-12 w-12 text-primary/40" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-900">Your Data is Ready</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">
                       All 3,547 varieties are synced and available for analysis. Start planting to see real-time growth tracking.
                    </p>
                 </div>
                 <Button variant="link" className="text-primary font-bold">
                    Learn about growth cycles
                 </Button>
              </div>
           </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-primary to-emerald-600 text-white">
           <CardHeader>
              <CardTitle className="text-xl font-black">Pulse Pro Tips</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              <div className="space-y-2">
                 <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest">Season Focus</p>
                 <h4 className="text-lg font-bold leading-tight">Best time to plant Heirloom Tomatoes</h4>
                 <p className="text-emerald-50/80 text-sm">
                    Most varieties we cataloged require 70-80 days. Start them now for a late summer harvest.
                 </p>
              </div>
              <div className="h-px bg-white/20 w-full" />
              <div className="space-y-2">
                 <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest">Latest Data</p>
                 <h4 className="text-lg font-bold leading-tight">833 Grape varieties added</h4>
                 <p className="text-emerald-50/80 text-sm">
                    Our latest expansion includes detailed wine and table grape data from regions globally.
                 </p>
              </div>
              <Button className="w-full bg-white text-primary hover:bg-emerald-50 font-bold">
                 View Expansion Notes
              </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
