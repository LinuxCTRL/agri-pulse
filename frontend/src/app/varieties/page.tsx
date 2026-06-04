"use client";

import { Leaf, Search, Eye, Table as TableIcon, LayoutGrid, Timer, MapPin } from "lucide-react";
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
import { parseMaturityDays } from "@/lib/utils";

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

    const filtered = varieties.filter((v) => {
      const matchesSearch = 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesCrop = 
        selectedCrop === "all" || v.crop_id.toString() === selectedCrop;

      return matchesSearch && matchesCrop;
    });

    // Reset to page 1 when filters change
    return filtered;
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
        <div className="text-red-500">
          Error loading varieties: {(error as Error).message}
        </div>
      </div>
    );
  }

  const getCropName = (cropId: number) => {
    return crops?.find((c) => c.id === cropId)?.name || `ID: ${cropId}`;
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Varieties
          </h1>
          <p className="text-slate-500">
            Explore {varieties?.length ?? 0} agricultural varieties across {crops?.length ?? 0} crops.
          </p>
        </div>
        <Leaf className="h-8 w-8 text-green-600" />
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search 3,500+ varieties..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Crop:</span>
            <Select value={selectedCrop} onValueChange={(val) => {
              setSelectedCrop(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[160px] h-11">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                {crops?.map((crop) => (
                  <SelectItem key={crop.id} value={crop.id.toString()}>
                    {crop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-11 border-l mx-2 hidden md:block" />

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <Button 
              variant={viewMode === "grid" ? "white" : "ghost"} 
              size="sm" 
              className={`h-9 px-3 ${viewMode === "grid" ? "shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button 
              variant={viewMode === "table" ? "white" : "ghost"} 
              size="sm" 
              className={`h-9 px-3 ${viewMode === "table" ? "shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              onClick={() => setViewMode("table")}
            >
              <TableIcon className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-slate-500 font-medium">
          Showing {currentItems.length} of {filteredVarieties.length} varieties
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-72 bg-slate-50 animate-pulse rounded-xl border" />
          ))}
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {currentItems.map((variety) => (
                <Card 
                  key={variety.id} 
                  className="overflow-hidden group hover:shadow-lg transition-all cursor-pointer border-slate-200/60"
                  onClick={() => router.push(`/varieties/${variety.id}`)}
                >
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    {variety.image_url ? (
                      <img 
                        src={variety.image_url} 
                        alt={variety.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-50">
                        <Leaf className="h-10 w-10 text-green-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-sm font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4" /> View Details
                      </span>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-green-600 transition-colors line-clamp-1">
                        {variety.name}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="w-fit bg-green-50 text-green-700 hover:bg-green-50 border-green-100 mt-1">
                      {getCropName(variety.crop_id)}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{variety.origin || "Unknown Origin"}</span>
                    </div>
                    {variety.season && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Timer className="h-3 w-3" />
                        <span className="truncate">{variety.season}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead className="w-[60px]">Image</TableHead>
                      <TableHead className="min-w-[200px]">Name</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead>Origin / Description</TableHead>
                      <TableHead>Maturity / Heat</TableHead>
                      <TableHead>Fruit Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((variety) => (
                      <TableRow
                        key={variety.id}
                        className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                        onClick={() => router.push(`/varieties/${variety.id}`)}
                      >
                        <TableCell className="font-mono text-xs text-slate-400">
                          #{variety.id}
                        </TableCell>
                        <TableCell>
                          <div className="h-10 w-10 overflow-hidden rounded-md border bg-slate-100 flex items-center justify-center">
                            {variety.image_url ? (
                              <img 
                                src={variety.image_url} 
                                alt={variety.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=No+Image";
                                }}
                              />
                            ) : (
                              <Leaf className="h-5 w-5 text-slate-300" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 group-hover:text-green-600 transition-colors">
                          {variety.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          >
                            {getCropName(variety.crop_id)}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="max-w-[300px] truncate text-slate-600 text-sm"
                          title={variety.origin || ""}
                        >
                          {variety.origin || (
                            <span className="text-slate-300 italic">No data</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {variety.season ? (
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {variety.season}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic text-sm">
                              N/A
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          <div className="flex items-center justify-between">
                            <span>{variety.fruit_size || <span className="text-slate-300 italic">Unknown</span>}</span>
                            <Eye className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all mr-2" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {filteredVarieties.length === 0 && !isLoading && (
            <div className="text-center py-24 bg-white rounded-xl border border-dashed border-slate-200">
               <Search className="h-12 w-12 text-slate-200 mx-auto mb-4" />
               <h3 className="text-lg font-semibold text-slate-900">No varieties found</h3>
               <p className="text-slate-500">Try adjusting your filters or search terms.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center pb-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {/* Simple pagination logic for 3,500 items */}
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
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
