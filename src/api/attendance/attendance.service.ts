import { handleAsync } from "../../utils";
import { ApiService, TApiServiceError, TApiServiceOptions } from "../apiService";
import { withAuthHooks } from "../auth/auth.ky.hooks";
import {
  TAttendanceListResponse,
  TAttendanceCorrectionRequest,
  TAttendanceCorrectionResponse,
} from "./attendance.types";

const apiService = new ApiService({
  hooks: withAuthHooks,
});

class AttendanceService {
  rootEndpoint = `attendance` as const;

  async getAttendances(
    params?: { site?: string; department?: string; search?: string },
    options?: TApiServiceOptions
  ): Promise<
    | { data: TAttendanceListResponse; error: null }
    | { data: null; error: TApiServiceError }
  > {
    // Build query string
    const searchParams = new URLSearchParams();
    if (params?.site && params.site !== "All Sites") {
      searchParams.set("site", params.site);
    }
    if (params?.department && params.department !== "All Departments") {
      searchParams.set("department", params.department);
    }
    if (params?.search) {
      searchParams.set("search", params.search);
    }

    const queryStr = searchParams.toString();
    const url = queryStr ? `${this.rootEndpoint}?${queryStr}` : this.rootEndpoint;

    const result = await handleAsync<TApiServiceError, TAttendanceListResponse>(() =>
      apiService.get<TAttendanceListResponse>(url, options)
    );

    if (result.data) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.error! };
  }

  async updateCorrection(
    id: string,
    payload: TAttendanceCorrectionRequest,
    options?: TApiServiceOptions
  ): Promise<
    | { data: TAttendanceCorrectionResponse; error: null }
    | { data: null; error: TApiServiceError }
  > {
    const result = await handleAsync<TApiServiceError, TAttendanceCorrectionResponse>(() =>
      apiService.put<TAttendanceCorrectionResponse, TAttendanceCorrectionRequest>(
        `${this.rootEndpoint}/${id}/correction`,
        payload,
        options
      )
    );

    if (result.data) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.error! };
  }
}

export const attendanceService = new AttendanceService();
