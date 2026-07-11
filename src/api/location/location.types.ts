export interface TLocationRecord {
  id: string;
  name: string;
  department: string;
  latitude: number;
  longitude: number;
  radius: number;
  createdAt: string;
  updatedAt: string;
}

export interface TLocationListResponse {
  code: number;
  status: string;
  results: TLocationRecord[];
  page: number;
  limit: number;
  total_pages: number;
  total_results: number;
}

export interface TLocationDetailResponse {
  code: number;
  status: string;
  message: string;
  data: TLocationRecord;
}

export interface TLocationCreateRequest {
  name: string;
  department: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface TLocationUpdateRequest {
  name: string;
  department: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface TLocationCommonResponse {
  code: number;
  status: string;
  message: string;
}
