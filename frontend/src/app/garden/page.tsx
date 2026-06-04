"use client";

import { usePlantings, useDeletePlanting, useUpdatePlanting } from "@/hooks/use-plantings";
import { useVarieties } from "@/hooks/use-varieties";
import { useCrops } from "@/hooks/use-crops";
import { 
  Sprout, 
  Trash2, 
  Calendar, 
  Clock, 
  ChevronRight,
  MoreVertical,
  Plus,
  MessageSquare,
  Info,
  Timer,
  LayoutGrid,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { parseMaturityDays, calculateHarvestInfo, cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  Planned: "bg-slate-100 text-slate-700 border-slate-200",
  Sown: "bg-blue-100 text-blue-700 border-blue-200",
  Seedling: "bg-green-100 text-green-700 border-green-200",
  Vegetative: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Flowering: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Fruiting: "bg-orange-100 text-orange-700 border-orange-200",
  Harvested: "bg-purple-100 text-purple-700 border-purple-200",
  Failed: "bg-red-100 text-red-700 border-red-200",
};

export default function GardenPage() {
  const router = useRouter();
  const { data: plantings, isLoading: isLoadingPlantings } = usePlantings();
  const { data: varieties } = useVarieties();
  const { data: crops } = useCrops();
  
  const deletePlanting = useDeletePlanting();
  const updatePlanting = useUpdatePlanting();

  const isLoading = isLoadingPlantings;

  const handleDelete = async (id: number, name: string) => {
    try {
      await deletePlanting.mutateAsync(id);
      toast.success(`${name} removed from your garden.`);
    } catch (err) {
      toast.error("Failed to remove planting.");
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updatePlanting.mutateAsync({ id, status });
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
            <Sprout className="h-4 w-4" />
            Active Ecosystem
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            My <span className="text-primary">Garden</span>
          </h1>
          <p className="text-slate-500 mt-1">
            Tracking <span className="text-slate-900 font-bold">{plantings?.length ?? 0}</span> active plantings and their growth cycles.
          </p>
        </div>
        <Button 
           className="rounded-full px-6 bg-primary shadow-lg shadow-primary/20"
           onClick={() => router.push("/varieties")}
        >
           <Plus className="mr-2 h-4 w-4" />
           Plant New Variety
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[450px] bg-white rounded-[2.5rem] border-2 border-slate-50 border-dashed animate-pulse" />
          ))}
        </div>
      ) : plantings?.length === 0 ? (
        <div className="text-center py-40 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-slate-200">
          <div className="bg-emerald-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sprout className="h-10 w-10 text-emerald-200" />
          </div>
          <h3 className="text-3xl font-black text-slate-900">Your garden is resting</h3>
          <p className="text-slate-500 mt-4 max-w-sm mx-auto text-lg font-medium leading-relaxed">
            Start your agricultural journey by selecting varieties from our global catalog.
          </p>
          <Button 
            className="mt-10 rounded-full px-8 h-14 bg-primary text-lg font-black"
            onClick={() => router.push("/varieties")}
          >
            Explore Varieties
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plantings?.map((planting) => {
            const variety = varieties?.find((v) => v.id === planting.variety_id);
            const crop = crops?.find((c) => c.id === variety?.crop_id);
            
            const maturityDays = parseMaturityDays(variety?.season || null);
            const harvestInfo = calculateHarvestInfo(planting.planted_at, maturityDays);

            return (
              <Card key={planting.id} className="card-hover border-none bg-white rounded-[2.5rem] overflow-hidden group flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div 
                   className="h-48 bg-slate-100 relative overflow-hidden cursor-pointer" 
                   onClick={() => router.push(`/garden/${planting.id}`)}
                >
                  {variety?.image_url ? (
                    <img 
                      src={variety.image_url} 
                      alt={variety.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/800x400/f8fafc/10b981?text=" + (variety?.name || "Planting");
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50/50">
                      <Leaf className="h-12 w-12 text-emerald-100" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className={cn("backdrop-blur-md border-none shadow-sm font-black text-[10px] uppercase tracking-widest px-4 py-1.5", STATUS_COLORS[planting.status] || "bg-white text-slate-900")}>
                      {planting.status}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Button variant="ghost" className="text-white font-black uppercase text-[10px] tracking-widest bg-white/20 backdrop-blur-md rounded-full border-none">
                        Manage Journal
                     </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-3 px-8 pt-8 flex flex-row items-start justify-between space-y-0 cursor-pointer" onClick={() => router.push(`/garden/${planting.id}`)}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>{crop?.name || "Cultivar"}</span>
                      <ChevronRight className="h-3 w-3 text-slate-300" />
                      <span>{new Date(planting.planted_at).getFullYear()}</span>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">
                      {variety?.name || "Syncing..."}
                    </CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-50 transition-colors">
                        <MoreVertical className="h-5 w-5 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl">
                      <DropdownMenuItem className="rounded-xl font-bold py-3 cursor-pointer" onClick={() => router.push(`/garden/${planting.id}`)}>
                        <MessageSquare className="mr-3 h-4 w-4 text-primary" /> Open Journal
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl font-bold py-3 cursor-pointer" onClick={() => router.push(`/varieties/${variety?.id}`)}>
                        <Info className="mr-3 h-4 w-4 text-primary" /> Variety Specs
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl font-bold py-3 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(planting.id, variety?.name || "Planting")}>
                        <Trash2 className="mr-3 h-4 w-4" /> Remove Entry
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                <CardContent className="flex-1 px-8">
                  <div className="space-y-6">
                    {harvestInfo && planting.status !== "Harvested" && (
                      <div className="bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100/50 space-y-4">
                        <div className="flex justify-between items-end">
                           <div className="space-y-0.5">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</p>
                              <div className="flex items-center gap-2">
                                 <Timer className="h-4 w-4 text-primary" />
                                 <span className="text-sm font-black text-slate-900">{harvestInfo.daysRemaining} days remaining</span>
                              </div>
                           </div>
                           <span className="text-xl font-black text-primary">{harvestInfo.progress}%</span>
                        </div>
                        <Progress value={harvestInfo.progress} className="h-3 bg-white" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-0.5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Planted</p>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                             <Calendar className="h-4 w-4 text-slate-300" />
                             {new Date(planting.planted_at).toLocaleDateString()}
                          </div>
                       </div>
                       <div className="space-y-0.5 text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity</p>
                          <div className="flex items-center justify-end gap-2 text-sm font-bold text-slate-600">
                             <Clock className="h-4 w-4 text-slate-300" />
                             {new Date(planting.updated_at).toLocaleDateString()}
                          </div>
                       </div>
                    </div>
                  </div>
                </CardContent>

                <div className="p-8 pt-4 mt-auto border-t bg-slate-50/30 flex items-center justify-between gap-4">
                    <Button 
                      variant="ghost" 
                      className="rounded-full font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-primary transition-all p-0 h-auto"
                      onClick={() => router.push(`/garden/${planting.id}`)}
                    >
                      Log Activity <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-full font-bold px-4 border-slate-200">
                            Update Status
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-2xl border-slate-100">
                          {Object.keys(STATUS_COLORS).map((status) => (
                            <DropdownMenuItem 
                              key={status}
                              className="rounded-xl font-bold cursor-pointer"
                              onClick={() => handleStatusChange(planting.id, status)}
                            >
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
