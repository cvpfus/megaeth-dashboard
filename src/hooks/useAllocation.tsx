import { useQuery } from "@tanstack/react-query";

interface AllocationResponse {
  clearing_price: string;
  token_allocation: string;
  usdt_allocation: string;
}

export function useAllocation(entityId?: string) {
  return useQuery({
    queryKey: ["allocation", entityId],
    queryFn: async (): Promise<AllocationResponse> => {
      if (!entityId) {
        throw new Error("Entity ID is required");
      }

      const response = await fetch(
        `https://token-api.megaeth.com/api/allocation?entityId=${entityId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch allocation: ${response.statusText}`);
      }

      const data = await response.json();

      // Check if the API returned an error in the response body
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    },
    enabled: !!entityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on errors, just show the error message once
  });
}
