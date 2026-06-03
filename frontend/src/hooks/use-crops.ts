import { useQuery } from "@tanstack/react-query"

export interface Crop {
  id: number
  name: string
  description: string | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function useCrops() {
  return useQuery<Crop[]>({
    queryKey: ["crops"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/crops/`)
      if (!response.ok) {
        throw new Error("Failed to fetch crops")
      }
      return response.json()
    },
  })
}
