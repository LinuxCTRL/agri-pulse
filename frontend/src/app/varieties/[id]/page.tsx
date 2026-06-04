"use client";

import { useVariety } from "@/hooks/use-variety";
import { useCrops } from "@/hooks/use-crops";
import { useAddPlanting } from "@/hooks/use-plantings";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Info,
  Scale,
  Sprout,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";

export default function VarietyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isAdding, setIsAdding] = useState(false);

  const { data: variety, isLoading: isLoadingVariety, error } = useVariety(id);
  const { data: crops } = useCrops();
  const addPlanting = useAddPlanting();

  const crop = crops?.find((c) => c.id === variety?.crop_id);

  const handleAddToGarden = async () => {
    if (!variety) return;
    setIsAdding(true);
    try {
      await addPlanting.mutateAsync({
        variety_id: variety.id,
        status: "Planned",
      });
      toast.success(`${variety.name} added to your garden!`, {
        description: "You can track its progress in the My Garden section.",
        action: {
          label: "View Garden",
          onClick: () => router.push("/garden"),
        },
      });
    } catch (err) {
      toast.error("Failed to add to garden. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoadingVariety) {
    return (
      <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-slate-500">
          Loading variety details...
        </div>
      </div>
    );
  }

  if (error || !variety) {
    return (
      <div className="container mx-auto p-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Varieties
        </Button>
        <div className="text-red-500">
          Variety not found or error loading data.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        onClick={() => router.push("/varieties")}
        className="mb-6 hover:bg-slate-100 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Varieties
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-50 flex-shrink-0">
              {variety.image_url ? (
                <img 
                  src={variety.image_url} 
                  alt={variety.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-50">
                  <Leaf className="h-16 w-16 text-green-200" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span>Varieties</span>
                <ChevronRight className="h-3 w-3" />
                <span>{crop?.name || "Crop"}</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                {variety.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-600">{crop?.name}</Badge>
                {variety.season && (
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200 bg-blue-50"
                  >
                    {variety.season}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Card className="border-none shadow-none bg-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5 text-blue-600" />
                About this Variety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed text-lg">
                {variety.origin ||
                  "No detailed description available for this variety yet."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Growth Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-orange-100 p-2 rounded-md">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Maturity / Heat
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {variety.season || "Not specified"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <div className="mt-1 bg-blue-100 p-2 rounded-md">
                  <Scale className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Fruit Size
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {variety.fruit_size || "Standard"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 p-2 rounded-md">
                  <Sprout className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Parent Crop
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {crop?.name || "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 text-white overflow-hidden relative">
            <CardContent className="pt-6">
              <Sprout className="absolute -right-4 -bottom-4 h-24 w-24 text-green-500/30 rotate-12" />
              <h3 className="font-bold text-lg mb-2 relative z-10">
                Start Growing
              </h3>
              <p className="text-green-50 text-sm mb-4 relative z-10">
                Add this variety to your planting schedule to track its
                progress.
              </p>
              <Button
                className="w-full bg-white text-green-700 hover:bg-green-50 relative z-10 font-bold"
                onClick={handleAddToGarden}
                disabled={isAdding}
              >
                {isAdding ? (
                  "Adding..."
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Add to My Garden
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
