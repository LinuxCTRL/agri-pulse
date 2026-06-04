import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface Planting {
  id: number
  variety_id: number
  status: string
  planted_at: string
  expected_harvest_at: string | null
  notes: string | null
  quantity: number
  created_at: string
  updated_at: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function usePlantings() {
  return useQuery<Planting[]>({
    queryKey: ["plantings"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/plantings/`)
      if (!response.ok) {
        throw new Error("Failed to fetch plantings")
      }
      return response.json()
    },
  })
}

export function useAddPlanting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newPlanting: Partial<Planting>) => {
      const response = await fetch(`${API_URL}/api/v1/plantings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlanting),
      })
      if (!response.ok) {
        throw new Error("Failed to add planting")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plantings"] })
    },
  })
}

export function useUpdatePlanting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Planting> & { id: number }) => {
      const response = await fetch(`${API_URL}/api/v1/plantings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error("Failed to update planting")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plantings"] })
    },
  })
}

export function useDeletePlanting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_URL}/api/v1/plantings/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete planting")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plantings"] })
    },
  })
}
