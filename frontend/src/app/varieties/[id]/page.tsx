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
  MapPin,
  Clock,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-4" />
        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Plant Data...</div>
      </div>
    );
  }

  if (error || !variety) {
    return (
      <div className="container mx-auto p-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-red-500 bg-red-50 p-6 rounded-3xl border border-red-100 font-bold">
           Variety not found or error loading data.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl animate-in fade-in zoom-in-95 duration-500">
      <Button
        variant="ghost"
        onClick={() => router.push("/varieties")}
        className="mb-8 hover:bg-white rounded-full text-slate-400 hover:text-primary transition-all group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
        Back to Catalog
      </Button>

      <div className="grid gap-12 lg:grid-cols-12">
        {/* Left Column: Visuals & Identity */}
        <div className="lg:col-span-4 space-y-8">
           <div className="relative group">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/10 border-8 border-white bg-white">
                 {variety.image_url ? (
                    <img 
                      src={variety.image_url} 
                      alt={variety.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/800x800/f8fafc/10b981?text=" + variety.name;
                      }}
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                      <Leaf className="h-24 w-24 text-emerald-100" />
                    </div>
                 )}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-3xl shadow-xl border flex items-center gap-3">
                 <div className="bg-primary/10 p-2 rounded-xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter leading-none">Status</p>
                    <p className="text-sm font-bold text-slate-900">Verified Species</p>
                 </div>
              </div>
           </div>

           <Card className="border-none shadow-sm rounded-[2rem] bg-white">
              <CardHeader className="pb-2">
                 <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Info className="h-3 w-3 text-primary" />
                    Quick Reference
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Maturity</span>
                    <Badge variant="outline" className="rounded-lg border-emerald-100 text-emerald-700 bg-emerald-50/50 font-bold px-3">
                       {variety.season || "N/A"}
                    </Badge>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Fruit Size</span>
                    <span className="text-sm font-bold text-slate-900">{variety.fruit_size || "Standard"}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Parent Crop</span>
                    <span className="text-sm font-bold text-slate-900">{crop?.name || "Unknown"}</span>
                 </div>
              </CardContent>
           </Card>

           <Button
              className="w-full h-16 rounded-[2rem] bg-primary hover:bg-emerald-600 text-white shadow-xl shadow-primary/20 text-lg font-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              onClick={handleAddToGarden}
              disabled={isAdding}
            >
              {isAdding ? (
                <div className="flex items-center gap-2">
                   <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                   Processing...
                </div>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-6 w-6" />
                  Add to My Garden
                </>
              )}
            </Button>
        </div>

        {/* Right Column: Narrative & Details */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em]">
              {crop?.name || "Category"}
              <ChevronRight className="h-3 w-3 text-slate-300" />
              Cultivar Profile
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">
              {variety.name}
            </h1>
            <div className="flex items-center gap-4 text-slate-400 font-bold">
               <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {variety.origin || "Origin Unknown"}
               </div>
               <div className="h-4 w-px bg-slate-200" />
               <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Last Updated 2026
               </div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
             <div className="bg-white/40 backdrop-blur-sm p-10 rounded-[3rem] border border-white/60 shadow-sm relative">
                <div className="absolute top-8 left-10 text-primary opacity-20">
                   <Info className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 relative z-10">Botanical Description</h3>
                <p className="text-xl text-slate-600 leading-relaxed font-medium relative z-10">
                  {variety.origin || "We are currently compiling the comprehensive narrative for this cultivar. This variety represents an essential part of the " + crop?.name + " lineage."}
                </p>
                <Button variant="link" className="mt-8 p-0 text-primary h-auto font-black flex items-center gap-2">
                   Research on Wikipedia
                   <ExternalLink className="h-4 w-4" />
                </Button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-none shadow-sm rounded-[2.5rem] bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
                <div className="bg-blue-500/10 p-3 w-fit rounded-2xl mb-6">
                   <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Growth Cycle</h4>
                <p className="text-slate-600 font-medium">
                   Optimized for <strong>{variety.season || "standard"}</strong> environments. Expect vigorous growth under monitored conditions.
                </p>
             </Card>

             <Card className="border-none shadow-sm rounded-[2.5rem] bg-gradient-to-br from-orange-50 to-amber-50 p-8">
                <div className="bg-orange-500/10 p-3 w-fit rounded-2xl mb-6">
                   <Sprout className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Planting Tip</h4>
                <p className="text-slate-600 font-medium">
                   Ensure well-draining soil and consistent hydration. This variety thrives with regular organic fertilization.
                </p>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
