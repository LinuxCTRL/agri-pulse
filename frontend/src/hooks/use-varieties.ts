import { useQuery } from "@tanstack/react-query"

export interface Variety {
  id: number
  name: string
  origin: string | null
  season: string | null
  crop_id: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function useVarieties() {
  return useQuery<Variety[]>({
    queryKey: ["varieties"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/varieties/`)
      if (!response.ok) {
        throw new Error("Failed to fetch varieties")
      }
      return response.json()
    },
  })
}
