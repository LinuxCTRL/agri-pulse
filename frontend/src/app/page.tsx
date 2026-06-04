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
          <h1 className="text-4xl font-black tracking-tight text-slate-950 mb-2">
            Pulse <span className="text-primary">Overview</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl font-medium leading-relaxed">
            Welcome back. Your agricultural ecosystem is currently thriving with 
            <span className="font-black text-slate-900 underline decoration-primary/30 decoration-4 underline-offset-4"> {varieties?.length.toLocaleString() ?? "..."} </span> 
            cataloged varieties.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="rounded-full px-8 h-12 shadow-xl shadow-primary/30 bg-primary hover:scale-105 transition-all text-white font-black"
            onClick={() => router.push("/varieties")}
          >
            Explore Catalog
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full px-8 h-12 bg-white shadow-sm hover:bg-slate-50 border-slate-200 text-slate-900 font-bold transition-all"
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
            className="card-hover border border-slate-100 shadow-sm bg-white cursor-pointer group relative overflow-hidden"
            onClick={() => router.push(stat.link)}
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${stat.color}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {stat.loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    stat.value
                  )}
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="text-xs font-bold text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm overflow-hidden bg-white/70 backdrop-blur-md">
           <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
              <CardTitle className="text-lg font-black flex items-center gap-3 text-slate-900">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                Ecosystem Performance
              </CardTitle>
           </CardHeader>
           <CardContent className="p-10">
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-6">
                 <div className="bg-emerald-50 p-8 rounded-[2.5rem] shadow-inner border border-emerald-100/50">
                    <Sprout className="h-16 w-16 text-primary/40" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-none italic">Intelligence Feed Active</h3>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                       Your biological datasets are fully synchronized. Real-time growth modeling is now available.
                    </p>
                 </div>
                 <Button variant="link" className="text-primary font-black hover:no-underline text-lg">
                    Access Insights <ArrowUpRight className="ml-1 h-5 w-5" />
                 </Button>
              </div>
           </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-gradient-to-br from-slate-900 to-primary text-white overflow-hidden relative">
           <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-white/5 rounded-full blur-3xl" />
           <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-black tracking-tight">Pulse Pro Tips</CardTitle>
           </CardHeader>
           <CardContent className="p-8 pt-0 space-y-8">
              <div className="space-y-3">
                 <p className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em]">Season Focus</p>
                 <h4 className="text-xl font-bold leading-tight">Heirloom Tomato Cycles</h4>
                 <p className="text-slate-300 font-medium leading-relaxed">
                    Most varieties in the catalog require 70-80 days. Start them now for late summer harvest.
                 </p>
              </div>
              <div className="h-px bg-white/10 w-full" />
              <div className="space-y-3">
                 <p className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em]">Recent Trends</p>
                 <h4 className="text-xl font-bold leading-tight">833 New Grapes</h4>
                 <p className="text-slate-300 font-medium leading-relaxed">
                    Latest data includes detailed species origin and production hectares for wine cultivars.
                 </p>
              </div>
              <Button className="w-full h-14 bg-white text-slate-900 hover:bg-emerald-50 font-black rounded-2xl shadow-lg shadow-black/20">
                 Expansion Journal
              </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
