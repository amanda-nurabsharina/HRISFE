import { handleAsync } from "../../utils";
import { ApiService, TApiServiceError, TApiServiceOptions } from "../apiService";
import { withAuthHooks } from "../auth/auth.ky.hooks";
import {
  TLocationListResponse,
  TLocationDetailResponse,
  TLocationCreateRequest,
  TLocationUpdateRequest,
  TLocationCommonResponse,
} from "./location.types";

const apiService = new ApiService({
  hooks: withAuthHooks,
});

class LocationService {
  rootEndpoint = `locations` as const;

  async getLocations(
    params?: { search?: string; page?: number; limit?: number },
    options?: TApiServiceOptions
  ): Promise<
    | { data: TLocationListResponse; error: null }
    | { data: null; error: TApiServiceError }
  > {
    const searchParams = new URLSearchParams();
    if (params?.search) {
      searchParams.set("search", params.search);
    }
    if (params?.page) {
      searchParams.set("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.set("limit", params.limit.toString());
    }

    const queryStr = searchParams.toString();
    const url = queryStr ? `${this.rootEndpoint}?${queryStr}` : this.rootEndpoint;

    const result = await handleAsync<TApiServiceError, TLocationListResponse>(() =>
      apiService.get<TLocationListResponse>(url, options)
    );

    if (result.data) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.error! };
  }

  async createLocation(
    payload: TLocationCreateRequest,
    options?: TApiServiceOptions
  ): Promise<
    | { data: TLocationDetailResponse; error: null }
    | { data: null; error: TApiServiceError }
  > {
    const result = await handleAsync<TApiServiceError, TLocationDetailResponse>(() =>
      apiService.post<TLocationDetailResponse, TLocationCreateRequest>(
        this.rootEndpoint,
        payload,
        options
      )
    );

    if (result.data) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.error! };
  }

  async updateLocation(
    id: string,
    payload: TLocationUpdateRequest,
    options?: TApiServiceOptions
  ): Promise<
    | { data: TLocationDetailResponse; error: null }
    | { data: null; error: TApiServiceError }
  > {
    const result = await handleAsync<TApiServiceError, TLocationDetailResponse>(() =>
      apiService.put<TLocationDetailResponse, TLocationUpdateRequest>(
        `${this.rootEndpoint}/${id}`,
        payload,
        options
      )
    );

    if (result.data) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.error! };
  }

  async deleteLocation(
    id: string,
    options?: TApiServiceOptions
  ): Promise<
    | { data: TLocationCommonResponse; error: null }
    | { data: null; error: TApiServiceError }
  > {
    const result = await handleAsync<TApiServiceError, TLocationCommonResponse>(() =>
      apiService.delete<TLocationCommonResponse>(
        `${this.rootEndpoint}/${id}`,
        options
      )
    );

    if (result.data) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.error! };
  }
}

export const locationService = new LocationService();
