"use client";

import { useCrops } from "@/hooks/use-crops";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, ChevronRight, ArrowUpRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CropsPage() {
  const router = useRouter();
  const { data: crops, isLoading, error } = useCrops();

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-500 bg-red-50 p-6 rounded-3xl border border-red-100 font-bold">
           Error loading species: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
            <Sprout className="h-4 w-4" />
            Biological Hierarchy
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Crop <span className="text-primary">Species</span>
          </h1>
          <p className="text-slate-500 mt-1">
            Managing <span className="text-slate-900 font-bold">{crops?.length ?? 0}</span> primary botanical categories in our ecosystem.
          </p>
        </div>
        <Button 
           variant="outline"
           className="rounded-full px-6 border-slate-200 bg-white/50 backdrop-blur-sm"
           onClick={() => router.push("/varieties")}
        >
           View All Varieties
           <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-8">
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
            <CardTitle className="text-lg font-black flex items-center gap-2">
               Inventory Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="border-slate-100">
                    <TableHead className="w-[100px] px-8 font-bold text-slate-400">ID</TableHead>
                    <TableHead className="font-bold text-slate-900">COMMON NAME</TableHead>
                    <TableHead className="font-bold text-slate-400">BIOLOGICAL DESCRIPTION</TableHead>
                    <TableHead className="text-right px-8 font-bold text-slate-400">ACTION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crops?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-48 text-center text-slate-400 font-medium">
                        No species found in the database.
                      </TableCell>
                    </TableRow>
                  ) : (
                    crops?.map((crop) => (
                      <TableRow key={crop.id} className="border-slate-50 hover:bg-white transition-colors group">
                        <TableCell className="font-mono text-xs text-slate-300 px-8">#{crop.id}</TableCell>
                        <TableCell className="font-black text-slate-900 text-lg py-6">
                           <div className="flex items-center gap-3">
                              <div className="bg-emerald-50 p-2 rounded-xl text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Sprout className="h-4 w-4" />
                              </div>
                              {crop.name}
                           </div>
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium max-w-md italic">
                          {crop.description || "No biological description available"}
                        </TableCell>
                        <TableCell className="text-right px-8">
                           <Button 
                              variant="ghost" 
                              className="rounded-full font-black uppercase text-[10px] tracking-widest text-primary hover:bg-primary/10"
                              onClick={() => {
                                 // We could filter varieties by this crop
                                 router.push(`/varieties?crop=${crop.id}`);
                              }}
                           >
                              Filter Varieties
                              <ChevronRight className="ml-1 h-3 w-3" />
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="bg-primary/5 p-8 rounded-[3rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
           <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 leading-tight">Need a new species?</h3>
              <p className="text-slate-600 font-medium">Add a new botanical category to expand your agricultural database.</p>
           </div>
           <Button className="rounded-full px-8 h-14 bg-primary shadow-xl shadow-primary/20 text-lg font-black">
              Register New Crop
           </Button>
        </div>
      </div>
    </div>
  );
}
