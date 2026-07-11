import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";

import { TApiServiceError } from "../apiService";
import { locationService } from "./location.service";
import {
  TLocationListResponse,
  TLocationDetailResponse,
  TLocationCreateRequest,
  TLocationUpdateRequest,
  TLocationCommonResponse,
} from "./location.types";

// Query key constants
export const locationKeys = {
  all: ["location"] as const,
  list: (params?: { search?: string; page?: number; limit?: number }) =>
    [...locationKeys.all, "list", params] as const,
};

// Hook: Fetch locations
export const useLocationsQuery = (
  params?: { search?: string; page?: number; limit?: number },
  options?: Partial<UseQueryOptions<TLocationListResponse, TApiServiceError>>
) => {
  return useQuery<TLocationListResponse, TApiServiceError>({
    queryKey: locationKeys.list(params),
    queryFn: async () => {
      const { data, error } = await locationService.getLocations(params);
      if (error) throw error;
      return data;
    },
    ...options,
  });
};

// Hook: Create location
export const useCreateLocationMutation = (
  options?: UseMutationOptions<
    TLocationDetailResponse,
    TApiServiceError,
    TLocationCreateRequest
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    TLocationDetailResponse,
    TApiServiceError,
    TLocationCreateRequest
  >({
    mutationFn: async (payload) => {
      const { data, error } = await locationService.createLocation(payload);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
    ...options,
  });
};

// Hook: Update location
export const useUpdateLocationMutation = (
  options?: UseMutationOptions<
    TLocationDetailResponse,
    TApiServiceError,
    { id: string; payload: TLocationUpdateRequest }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    TLocationDetailResponse,
    TApiServiceError,
    { id: string; payload: TLocationUpdateRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const { data, error } = await locationService.updateLocation(id, payload);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
    ...options,
  });
};

// Hook: Delete location
export const useDeleteLocationMutation = (
  options?: UseMutationOptions<
    TLocationCommonResponse,
    TApiServiceError,
    string
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    TLocationCommonResponse,
    TApiServiceError,
    string
  >({
    mutationFn: async (id) => {
      const { data, error } = await locationService.deleteLocation(id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
    ...options,
  });
};
