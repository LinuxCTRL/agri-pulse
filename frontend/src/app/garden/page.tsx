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
  Timer
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
import { parseMaturityDays, calculateHarvestInfo } from "@/lib/utils";

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
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Garden
          </h1>
          <p className="text-slate-500">
            Track and manage your active plantings.
          </p>
        </div>
        <div className="bg-green-100 p-3 rounded-full">
          <Sprout className="h-6 w-6 text-green-600" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-slate-100" />
            </Card>
          ))}
        </div>
      ) : plantings?.length === 0 ? (
        <Card className="border-dashed border-2 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Plus className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Your garden is empty</h3>
            <p className="text-slate-500 mb-6 text-center max-w-xs">
              Start by browsing the varieties and adding them to your garden schedule.
            </p>
            <Button onClick={() => router.push("/varieties")}>
              Browse Varieties
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plantings?.map((planting) => {
            const variety = varieties?.find((v) => v.id === planting.variety_id);
            const crop = crops?.find((c) => c.id === variety?.crop_id);
            
            const maturityDays = parseMaturityDays(variety?.season || null);
            const harvestInfo = calculateHarvestInfo(planting.planted_at, maturityDays);

            return (
              <Card key={planting.id} className="overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
                <div className="h-32 bg-slate-100 relative overflow-hidden cursor-pointer" onClick={() => router.push(`/garden/${planting.id}`)}>
                  {variety?.image_url ? (
                    <img 
                      src={variety.image_url} 
                      alt={variety.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x200?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-50">
                      <Leaf className="h-8 w-8 text-green-200" />
                    </div>
                  )}
                  <Badge className={`absolute top-3 right-3 ${STATUS_COLORS[planting.status]} border font-medium shadow-sm`}>
                    {planting.status}
                  </Badge>
                </div>
                <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0 cursor-pointer" onClick={() => router.push(`/garden/${planting.id}`)}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>{crop?.name || "Unknown Crop"}</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                      {variety?.name || "Loading..."}
                    </CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => router.push(`/garden/${planting.id}`)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" /> Open Journal
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => router.push(`/varieties/${variety?.id}`)}
                      >
                        <Info className="mr-2 h-4 w-4" /> View Variety Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDelete(planting.id, variety?.name || "Planting")}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    {harvestInfo && planting.status !== "Harvested" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1">
                          <span className="text-slate-500 flex items-center gap-1 font-semibold">
                            <Timer className="h-3 w-3" />
                            {harvestInfo.daysRemaining} days left
                          </span>
                          <span className="font-bold text-green-600">{harvestInfo.progress}%</span>
                        </div>
                        <Progress value={harvestInfo.progress} className="h-2 bg-slate-100" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-slate-400 gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {new Date(planting.updated_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Planted: {new Date(planting.planted_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-8"
                      onClick={() => router.push(`/garden/${planting.id}`)}
                    >
                      <MessageSquare className="mr-2 h-3 w-3" /> Journal
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          Update Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {Object.keys(STATUS_COLORS).map((status) => (
                          <DropdownMenuItem 
                            key={status}
                            onClick={() => handleStatusChange(planting.id, status)}
                          >
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
