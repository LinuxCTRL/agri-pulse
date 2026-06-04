import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface PlantingActivity {
  id: number
  planting_id: number
  type: string
  note: string
  activity_at: string
  created_at: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function useActivities(plantingId: number) {
  return useQuery<PlantingActivity[]>({
    queryKey: ["activities", plantingId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/activities/${plantingId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch activities")
      }
      return response.json()
    },
    enabled: !!plantingId,
  })
}

export function useAddActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newActivity: Partial<PlantingActivity>) => {
      const response = await fetch(`${API_URL}/api/v1/activities/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newActivity),
      })
      if (!response.ok) {
        throw new Error("Failed to add activity")
      }
      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activities", variables.planting_id] })
    },
  })
}

export function useDeleteActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, plantingId }: { id: number, plantingId: number }) => {
      const response = await fetch(`${API_URL}/api/v1/activities/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete activity")
      }
      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activities", variables.plantingId] })
    },
  })
}
