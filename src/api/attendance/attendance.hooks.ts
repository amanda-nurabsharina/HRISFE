import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";

import { TApiServiceError } from "../apiService";
import { attendanceService } from "./attendance.service";
import {
  TAttendanceListResponse,
  TAttendanceCorrectionRequest,
  TAttendanceCorrectionResponse,
} from "./attendance.types";

// Query key constants
export const attendanceKeys = {
  all: ["attendance"] as const,
  list: (params?: { site?: string; department?: string; search?: string }) =>
    [...attendanceKeys.all, "list", params] as const,
};

// Hook: Fetch attendance records
export const useAttendanceQuery = (
  params?: { site?: string; department?: string; search?: string },
  options?: Partial<UseQueryOptions<TAttendanceListResponse, TApiServiceError>>
) => {
  return useQuery<TAttendanceListResponse, TApiServiceError>({
    queryKey: attendanceKeys.list(params),
    queryFn: async () => {
      const { data, error } = await attendanceService.getAttendances(params);
      if (error) throw error;
      return data;
    },
    ...options,
  });
};

// Hook: Submit attendance correction
export const useAttendanceCorrectionMutation = (
  options?: UseMutationOptions<
    TAttendanceCorrectionResponse,
    TApiServiceError,
    { id: string; payload: TAttendanceCorrectionRequest }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    TAttendanceCorrectionResponse,
    TApiServiceError,
    { id: string; payload: TAttendanceCorrectionRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const { data, error } = await attendanceService.updateCorrection(id, payload);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate attendance queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
    ...options,
  });
};
