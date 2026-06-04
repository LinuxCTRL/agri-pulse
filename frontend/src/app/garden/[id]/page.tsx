"use client";

import { useVariety } from "@/hooks/use-variety";
import { usePlantings, useUpdatePlanting } from "@/hooks/use-plantings";
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
  Timer
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
import { useState } from "react";
import { parseMaturityDays, calculateHarvestInfo } from "@/lib/utils";

const ACTIVITY_ICONS: Record<string, any> = {
  Watering: Droplets,
  Fertilizing: Zap,
  Pruning: Scissors,
  Observation: MessageSquare,
  Harvest: CheckCircle2,
};

const ACTIVITY_COLORS: Record<string, string> = {
  Watering: "text-blue-500 bg-blue-50",
  Fertilizing: "text-purple-500 bg-purple-50",
  Pruning: "text-orange-500 bg-orange-50",
  Observation: "text-slate-500 bg-slate-50",
  Harvest: "text-green-500 bg-green-50",
};

export default function PlantingJournalPage() {
  const params = useParams();
  const router = useRouter();
  const plantingId = Number(params.id);

  const [newNote, setNewNote] = useState("");
  const [activityType, setActivityType] = useState("Observation");

  const { data: plantings } = usePlantings();
  const planting = plantings?.find(p => p.id === plantingId);
  
  const { data: variety } = useVariety(planting?.variety_id || 0);
  const { data: activities, isLoading: isLoadingActivities } = useActivities(plantingId);
  
  const maturityDays = parseMaturityDays(variety?.season || null);
  const harvestInfo = calculateHarvestInfo(planting?.planted_at || "", maturityDays);

  const addActivity = useAddActivity();
  const deleteActivity = useDeleteActivity();

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

  if (!planting) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse text-slate-500">Loading journal...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Button 
        variant="ghost" 
        onClick={() => router.push("/garden")} 
        className="mb-6 hover:bg-slate-100 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Garden
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Planting Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-48 bg-slate-100 relative">
              {variety?.image_url ? (
                <img 
                  src={variety.image_url} 
                  alt={variety.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-50">
                  <Plus className="h-12 w-12 text-green-200" />
                </div>
              )}
              <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 backdrop-blur-sm border-none shadow-sm">
                {planting.status}
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>My Garden</span>
                <ChevronRight className="h-3 w-3" />
                <span>Journal</span>
              </div>
              <CardTitle className="text-2xl font-bold">{variety?.name || "Loading..."}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {harvestInfo && planting.status !== "Harvested" && (
                <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                  <div className="flex justify-between items-center text-xs uppercase tracking-wider font-bold">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      Harvest Countdown
                    </span>
                    <span className="text-green-600">{harvestInfo.daysRemaining} days left</span>
                  </div>
                  <Progress value={harvestInfo.progress} className="h-2 bg-white" />
                  <p className="text-[10px] text-center text-slate-400">
                    Expected: {harvestInfo.harvestDate.toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-slate-500 text-xs">Planted On</p>
                  <p className="font-medium text-slate-900">{new Date(planting.planted_at).toLocaleDateString()}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push(`/varieties/${variety?.id}`)}
              >
                <Info className="mr-2 h-4 w-4" /> View Variety Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Log New Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddActivity} className="space-y-4">
                <div className="space-y-2">
                  <Label>Activity Type</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(ACTIVITY_ICONS).map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Note / Observation</Label>
                  <Input 
                    placeholder="e.g. First sprouts appearing!" 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" /> Log Activity
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Planting Journal
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingActivities ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full" />
                </div>
              ) : !activities || activities.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
                  <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No activities logged yet.</p>
                  <p className="text-xs text-slate-400">Start by adding your first observation.</p>
                </div>
              ) : (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {activities.map((activity) => {
                    const Icon = ACTIVITY_ICONS[activity.type] || MessageSquare;
                    return (
                      <div key={activity.id} className="relative flex items-start group">
                        <div className={`absolute left-0 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white z-10 ${ACTIVITY_COLORS[activity.type] || "bg-slate-100 text-slate-500"}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="ml-14 flex-1 bg-white border rounded-xl p-4 shadow-sm group-hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-900">{activity.type}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-slate-400">
                                {new Date(activity.activity_at).toLocaleDateString()}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600"
                                onClick={() => handleDeleteActivity(activity.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-slate-600 text-sm">{activity.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
