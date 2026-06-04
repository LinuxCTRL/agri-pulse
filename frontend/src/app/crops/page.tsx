"use client";

import { Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCrops } from "@/hooks/use-crops";

export default function CropsPage() {
  const { data: crops, isLoading, error } = useCrops();

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-500">
          Error loading crops: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Crops
          </h1>
          <p className="text-slate-500">
            Manage and view all agricultural crops.
          </p>
        </div>
        <Sprout className="h-8 w-8 text-green-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crop Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <span className="animate-pulse text-slate-500">
                Loading crops...
              </span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crops?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No crops found.
                    </TableCell>
                  </TableRow>
                ) : (
                  crops?.map((crop) => (
                    <TableRow key={crop.id}>
                      <TableCell className="font-medium">{crop.id}</TableCell>
                      <TableCell>{crop.name}</TableCell>
                      <TableCell className="text-slate-500">
                        {crop.description || "No description available"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
