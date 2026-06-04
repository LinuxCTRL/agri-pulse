"use client";

import { useVariety } from "@/hooks/use-variety";
import { usePlantings, useUploadImage } from "@/hooks/use-plantings";
import { useActivities, useAddActivity, useDeleteActivity } from "@/hooks/use-activities";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  MessageSquare,
  Droplets,
  Zap,
  Scissors,
  CheckCircle2,
  ChevronRight,
  Info,
  Timer,
  Camera,
  ImageIcon,
  ArrowUpRight,
  TrendingUp,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { parseMaturityDays, calculateHarvestInfo, cn } from "@/lib/utils";

const ACTIVITY_ICONS: Record<string, any> = {
  Watering: Droplets,
  Fertilizing: Zap,
  Pruning: Scissors,
  Observation: MessageSquare,
  Harvest: CheckCircle2,
};

const ACTIVITY_COLORS: Record<string, string> = {
  Watering: "text-blue-500 bg-blue-50 border-blue-100",
  Fertilizing: "text-purple-500 bg-purple-50 border-purple-100",
  Pruning: "text-orange-500 bg-orange-50 border-orange-100",
  Observation: "text-slate-500 bg-slate-50 border-slate-100",
  Harvest: "text-green-500 bg-green-50 border-green-100",
};

export default function PlantingJournalPage() {
  const params = useParams();
  const router = useRouter();
  const plantingId = Number(params.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newNote, setNewNote] = useState("");
  const [activityType, setActivityType] = useState("Observation");
  const [isUploading, setIsUploading] = useState(false);

  const { data: plantings } = usePlantings();
  const planting = plantings?.find(p => p.id === plantingId);
  
  const { data: variety } = useVariety(planting?.variety_id || 0);
  const { data: activities, isLoading: isLoadingActivities } = useActivities(plantingId);
  
  const maturityDays = parseMaturityDays(variety?.season || null);
  const harvestInfo = calculateHarvestInfo(planting?.planted_at || "", maturityDays);

  const addActivity = useAddActivity();
  const deleteActivity = useDeleteActivity();
  const uploadImage = useUploadImage();

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await addActivity.mutateAsync({
        planting_id: plantingId,
        type: activityType,
        note: newNote,
      });
      setNewNote("");
      toast.success("Activity logged!");
    } catch (err) {
      toast.error("Failed to log activity.");
    }
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await deleteActivity.mutateAsync({ id, plantingId });
      toast.success("Activity deleted.");
    } catch (err) {
      toast.error("Failed to delete activity.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadImage.mutateAsync({ id: plantingId, file });
      toast.success("Photo added to collection!");
    } catch (err) {
      toast.error("Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!planting) {
    return (
      <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-4" />
        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Journal...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Button 
        variant="ghost" 
        onClick={() => router.push("/garden")} 
        className="mb-8 hover:bg-white rounded-full text-slate-400 hover:text-primary transition-all group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
        Back to Garden
      </Button>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Column: Core Planting Stats */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="overflow-hidden border-none shadow-xl rounded-[3rem] bg-white group">
            <div className="h-64 bg-slate-100 relative overflow-hidden">
              {variety?.image_url ? (
                <img 
                  src={variety.image_url} 
                  alt={variety.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                  <ImageIcon className="h-20 w-20 text-emerald-100" />
                </div>
              )}
              <div className="absolute top-6 right-6">
                 <Badge className="bg-white/90 text-slate-900 backdrop-blur-md border-none shadow-sm font-black text-[10px] uppercase tracking-widest px-4 py-2">
                   {planting.status}
                 </Badge>
              </div>
            </div>
            <CardHeader className="px-8 pt-8">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                <Sprout className="h-3 w-3" />
                Planting Identity
              </div>
              <CardTitle className="text-3xl font-black text-slate-900 leading-none">
                {variety?.name || "Loading..."}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <div className="flex items-center gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded-2xl">
                   <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-tighter">Established On</p>
                  <p className="font-black text-slate-900 text-lg">{new Date(planting.planted_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl justify-between px-6 border-slate-200 hover:border-primary hover:text-primary transition-all font-bold"
                onClick={() => router.push(`/varieties/${variety?.id}`)}
              >
                <span>Full Botanical Specs</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="bg-white/10 p-2 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                   </div>
                   <h3 className="text-xl font-black">Pulse Insights</h3>
                </div>
                
                {harvestInfo && planting.status !== "Harvested" ? (
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Growth Score</p>
                           <p className="text-2xl font-black">{harvestInfo.progress}% Complete</p>
                        </div>
                        <Timer className="h-8 w-8 text-emerald-400/20" />
                     </div>
                     <Progress value={harvestInfo.progress} className="h-2 bg-white/10" />
                     <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-sm font-medium text-slate-300 italic">
                           "Expected harvest in approximately <strong>{harvestInfo.daysRemaining} days</strong> ({harvestInfo.harvestDate.toLocaleDateString()})."
                        </p>
                     </div>
                  </div>
                ) : (
                  <p className="text-slate-400 font-medium italic">Status: {planting.status}. Observations currently being processed.</p>
                )}
             </div>
          </Card>

          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                 <Camera className="h-5 w-5 text-primary" />
                 Visual Collection
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all text-slate-400 hover:text-primary font-bold"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Add Progress Photo"}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                {planting.images?.map((img) => (
                  <div key={img.id} className="aspect-square rounded-2xl overflow-hidden border-4 border-slate-50 relative group shadow-sm">
                    <img src={img.image_url} alt="Planting Progress" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Button variant="ghost" size="icon" className="text-white hover:text-red-400">
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                ))}
                {(!planting.images || planting.images.length === 0) && (
                  <div className="col-span-2 py-10 text-center flex flex-col items-center justify-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-100">
                    <ImageIcon className="h-8 w-8 text-slate-200 mb-2" />
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Photos Yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Timeline & Logger */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-sm rounded-[3rem] bg-white p-8">
            <CardHeader className="px-0 pt-0 pb-6 flex flex-row items-center justify-between border-b border-slate-50 mb-8">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <History className="h-6 w-6 text-primary" />
                Growth Journal
              </CardTitle>
              <Badge variant="outline" className="rounded-full px-4 border-primary/20 text-primary font-bold">
                 {activities?.length ?? 0} LOGS
              </Badge>
            </CardHeader>
            <CardContent className="px-0">
               <div className="grid gap-8">
                  {/* Logger Form */}
                  <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner mb-4">
                     <form onSubmit={handleAddActivity} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Category</Label>
                              <Select value={activityType} onValueChange={setActivityType}>
                                <SelectTrigger className="h-14 rounded-2xl border-none shadow-sm bg-white font-bold text-slate-700">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100">
                                  {Object.keys(ACTIVITY_ICONS).map(type => (
                                    <SelectItem key={type} value={type} className="rounded-xl font-bold py-3">{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Daily Observation</Label>
                              <Input 
                                placeholder="What did you notice today?" 
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                className="h-14 rounded-2xl border-none shadow-sm bg-white font-medium text-slate-700 placeholder:text-slate-300"
                              />
                           </div>
                        </div>
                        <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform">
                          <Plus className="mr-2 h-5 w-5" /> Commit Entry
                        </Button>
                     </form>
                  </div>

                  {/* Activity Timeline */}
                  {isLoadingActivities ? (
                    <div className="flex justify-center py-20">
                      <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : !activities || activities.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-slate-50 border-dotted">
                      <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                         <MessageSquare className="h-8 w-8 text-slate-200" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Your journal is waiting</h3>
                      <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Record your first agricultural insight</p>
                    </div>
                  ) : (
                    <div className="relative space-y-10 pl-4 before:absolute before:inset-0 before:ml-9 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-50">
                      {activities.map((activity) => {
                        const Icon = ACTIVITY_ICONS[activity.type] || MessageSquare;
                        return (
                          <div key={activity.id} className="relative flex items-start group">
                            <div className={cn(
                               "absolute left-0 flex items-center justify-center w-10 h-10 rounded-2xl border-4 border-white z-10 shadow-sm transition-transform group-hover:scale-110",
                               ACTIVITY_COLORS[activity.type] || "bg-slate-100 text-slate-500"
                            )}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="ml-16 flex-1 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.01)] group-hover:shadow-md transition-all">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                   <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{activity.type}</span>
                                   <div className="h-1 w-1 rounded-full bg-slate-200" />
                                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                      {new Date(activity.activity_at).toLocaleDateString()}
                                   </span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500 hover:bg-red-50"
                                  onClick={() => handleDeleteActivity(activity.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-slate-600 text-lg font-medium leading-relaxed">{activity.note}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
