import { useQuery } from "@tanstack/react-query";
import type { Variety } from "./use-varieties";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useVariety(id: string | number) {
  return useQuery<Variety>({
    queryKey: ["variety", id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/varieties/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch variety");
      }
      return response.json();
    },
    enabled: !!id,
  });
}
