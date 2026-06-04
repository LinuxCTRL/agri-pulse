"use client";

import { Leaf, Search, Eye, Table as TableIcon, LayoutGrid, Timer, MapPin, Sparkles, Filter, Activity } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useCrops } from "@/hooks/use-crops";
import { useVarieties } from "@/hooks/use-varieties";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 24;

export default function VarietiesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: varieties,
    isLoading: isLoadingVarieties,
    error: errorVarieties,
  } = useVarieties();
  const { data: crops, isLoading: isLoadingCrops } = useCrops();

  const isLoading = isLoadingVarieties || isLoadingCrops;
  const error = errorVarieties;

  const filteredVarieties = useMemo(() => {
    if (!varieties) return [];

    return varieties.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesCrop =
        selectedCrop === "all" || v.crop_id.toString() === selectedCrop;

      return matchesSearch && matchesCrop;
    });
  }, [varieties, searchTerm, selectedCrop]);

  const totalPages = Math.ceil(filteredVarieties.length / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVarieties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVarieties, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3">
           <Activity className="h-5 w-5" />
           Error loading varieties: {(error as Error).message}
        </div>
      </div>
    );
  }

  const getCropName = (cropId: number) => {
    return crops?.find((c) => c.id === cropId)?.name || `ID: ${cropId}`;
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
            <Sparkles className="h-4 w-4" />
            Global Repository
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Plant <span className="text-primary">Catalog</span>
          </h1>
          <p className="text-slate-500 mt-1">
            Discovering <span className="text-slate-900 font-bold">{varieties?.length.toLocaleString() ?? "..."}</span> unique cultivars across the ecosystem.
          </p>
        </div>
        <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border shadow-sm flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn("rounded-xl px-4 h-10", viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-slate-500")}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Visual Grid
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn("rounded-xl px-4 h-10", viewMode === "table" ? "bg-white shadow-sm text-primary" : "text-slate-500")}
            onClick={() => setViewMode("table")}
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Detailed List
          </Button>
        </div>
      </div>

      <div className="mb-10 grid gap-4 md:flex md:items-center bg-white/70 backdrop-blur-sm p-4 rounded-3xl border shadow-sm shadow-slate-100/50">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, origin, or notes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-12 h-14 bg-transparent border-none focus-visible:ring-0 text-lg font-medium placeholder:text-slate-300"
          />
        </div>

        <div className="h-10 w-px bg-slate-100 hidden md:block" />

        <div className="flex items-center gap-3 px-4 min-w-[200px]">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select value={selectedCrop} onValueChange={(val) => {
            setSelectedCrop(val);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="border-none bg-transparent h-14 focus:ring-0 text-slate-700 font-bold shadow-none">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100">
              <SelectItem value="all">All Categories</SelectItem>
              {crops?.map((crop) => (
                <SelectItem key={crop.id} value={crop.id.toString()}>
                  {crop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[380px] bg-white rounded-[2rem] border-2 border-slate-50 border-dashed animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {currentItems.map((variety) => (
                <Card
                  key={variety.id}
                  className="card-hover border-none bg-white rounded-[2rem] overflow-hidden group cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
                  onClick={() => router.push(`/varieties/${variety.id}`)}
                >
                  <div className="h-56 relative overflow-hidden">
                    {variety.image_url ? (
                      <img
                        src={variety.image_url}
                        alt={variety.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/600x600/f8fafc/10b981?text=" + variety.name;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50/50 group-hover:bg-emerald-50 transition-colors">
                        <Leaf className="h-12 w-12 text-emerald-100 group-hover:text-emerald-200 transition-colors" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                       <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-md border-none shadow-sm font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                         {getCropName(variety.crop_id)}
                       </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-black text-slate-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                      {variety.name}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <MapPin className="h-3 w-3 text-slate-300" />
                        <span className="truncate">{variety.origin || "Unknown Heritage"}</span>
                      </div>
                      {variety.season && (
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                          <Timer className="h-3 w-3 text-slate-300" />
                          <span className="truncate">{variety.season}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                       <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Eye className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                       </div>
                       <span className="text-[10px] font-black uppercase text-slate-300 tracking-tighter group-hover:text-primary group-hover:tracking-widest transition-all duration-300">
                          View Details
                       </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100">
                      <TableHead className="w-[80px] font-bold text-slate-400 px-6">ID</TableHead>
                      <TableHead className="w-[100px] font-bold text-slate-400">IMAGE</TableHead>
                      <TableHead className="min-w-[200px] font-bold text-slate-900">VARIETY NAME</TableHead>
                      <TableHead className="font-bold text-slate-400">CATEGORY</TableHead>
                      <TableHead className="font-bold text-slate-400">ORIGIN</TableHead>
                      <TableHead className="font-bold text-slate-400">METADATA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((variety) => (
                      <TableRow
                        key={variety.id}
                        className="border-slate-50 hover:bg-white transition-colors cursor-pointer group"
                        onClick={() => router.push(`/varieties/${variety.id}`)}
                      >
                        <TableCell className="font-mono text-xs text-slate-300 px-6">
                          #{variety.id}
                        </TableCell>
                        <TableCell>
                          <div className="h-12 w-12 overflow-hidden rounded-2xl border-2 border-white shadow-sm bg-slate-100 flex items-center justify-center">
                            {variety.image_url ? (
                              <img
                                src={variety.image_url}
                                alt={variety.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Leaf className="h-5 w-5 text-slate-300" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-black text-slate-900 group-hover:text-primary transition-colors">
                          {variety.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-lg border-emerald-100 bg-emerald-50/30 text-emerald-700 font-bold px-3">
                            {getCropName(variety.crop_id)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate text-slate-500 font-medium italic">
                          {variety.origin || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                            {variety.season || "No Extra Data"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {filteredVarieties.length === 0 && !isLoading && (
            <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-slate-200">
               <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-slate-200" />
               </div>
               <h3 className="text-2xl font-black text-slate-900">No results found</h3>
               <p className="text-slate-500 mt-2">Adjust your filters to discover different varieties.</p>
               <Button variant="outline" className="mt-8 rounded-full border-primary text-primary" onClick={() => { setSearchTerm(""); setSelectedCrop("all"); }}>
                  Clear all filters
               </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center gap-6 pb-20">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                 Explore More Pages
              </div>
              <Pagination>
                <PaginationContent className="gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={cn("h-12 w-12 rounded-2xl border-none bg-white shadow-sm hover:text-primary transition-all", currentPage === 1 ? "pointer-events-none opacity-30" : "cursor-pointer")}
                    />
                  </PaginationItem>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum = currentPage;
                    if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    if (pageNum <= 0 || pageNum > totalPages) return null;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={currentPage === pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={cn(
                            "h-12 w-12 rounded-2xl border-none shadow-sm transition-all font-black cursor-pointer",
                            currentPage === pageNum ? "bg-primary text-white scale-110 shadow-primary/20" : "bg-white text-slate-400 hover:text-slate-900"
                          )}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={cn("h-12 w-12 rounded-2xl border-none bg-white shadow-sm hover:text-primary transition-all", currentPage === totalPages ? "pointer-events-none opacity-30" : "cursor-pointer")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="text-xs font-bold text-slate-300">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
