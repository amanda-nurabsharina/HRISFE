export interface TAttendanceRecord {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  shift: string;
  clockIn: string;
  clockOut: string;
  site: string;
  department: string;
  latitude: number | null;
  longitude: number | null;
  status: "Present" | "Late" | "Absent" | "On Leave";
  hasOvertime: boolean;
  correctionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TAttendanceListResponse {
  code: number;
  status: string;
  results: TAttendanceRecord[];
}

export interface TAttendanceCorrectionRequest {
  status: string;
  clockIn: string;
  clockOut: string;
  reason: string;
}

export interface TAttendanceCorrectionResponse {
  code: number;
  status: string;
  message: string;
  result: TAttendanceRecord;
}
