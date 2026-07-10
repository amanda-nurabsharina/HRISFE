import * as React from "react";
import { 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  Eye, 
  X, 
  Camera, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Map,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useAttendanceQuery } from "../../api/attendance";
import type { TAttendanceRecord } from "../../api/attendance";
import workerSelfie from "../../assets/indonesian_worker_selfie.png";

export const Attendance = () => {
  // Filters State
  const [selectedPeriod, setSelectedPeriod] = React.useState("Jan 01 - Jan 31, 2026");
  const [selectedSite, setSelectedSite] = React.useState("All Sites");
  const [selectedDept, setSelectedDept] = React.useState("All Departments");
  const [activeTab, setActiveTab] = React.useState<"ALL" | "Late" | "Absent" | "Leaves" | "Overtime">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const recordsPerPage = 10;

  // Fetch attendance data from real backend API (READ-ONLY)
  const { 
    data: attendanceData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useAttendanceQuery({
    site: selectedSite,
    department: selectedDept,
    search: debouncedSearch,
  });

  // Records from API
  const records: TAttendanceRecord[] = attendanceData?.results ?? [];

  // Modal State (view-only)
  const [selectedRecord, setSelectedRecord] = React.useState<TAttendanceRecord | null>(null);

  // Open Verification Modal (read-only view)
  const handleOpenVerification = (record: TAttendanceRecord) => {
    setSelectedRecord(record);
  };

  // Close Modal
  const handleCloseModal = () => {
    setSelectedRecord(null);
  };

  // Client-side tab filtering (API already handles site/dept/search)
  const filteredRecords = records.filter(rec => {
    if (activeTab === "Late" && rec.status !== "Late") return false;
    if (activeTab === "Absent" && rec.status !== "Absent") return false;
    if (activeTab === "Leaves" && rec.status !== "On Leave") return false;
    if (activeTab === "Overtime" && !rec.hasOvertime) return false;
    return true;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / recordsPerPage));
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedSite, selectedDept, debouncedSearch]);

  // Metrics computed from real data
  const totalPresent = records.filter(r => r.status === "Present").length;
  const totalLate = records.filter(r => r.status === "Late").length;
  const totalAbsent = records.filter(r => r.status === "Absent").length;

  return (
    <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            Attendance & Tracking
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Monitor daily attendance across all sites. Data is synced from mobile check-ins.
          </p>
        </div>
        <button 
          onClick={() => void refetch()}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-[#282d8d] border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Dropdowns */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-4 rounded-2xl shadow-sm grid gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Period</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 pl-9 pr-3 py-2 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>Jan 01 - Jan 31, 2026</option>
              <option>Feb 01 - Feb 28, 2026</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Site Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <select 
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 pl-9 pr-3 py-2 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>All Sites</option>
              <option>Site Alpha</option>
              <option>Site Beta</option>
              <option>Head Office</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Department</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 pl-9 pr-3 py-2 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>All Departments</option>
              <option>Operations</option>
              <option>Logistics</option>
              <option>Engineering</option>
              <option>HR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Row - Computed from real data */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase">On-Time</h3>
            <p className="text-xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : totalPresent} 
              <span className="text-xs font-semibold text-zinc-400 ml-1">Users</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase">Late</h3>
            <p className="text-xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : totalLate} 
              <span className="text-xs font-semibold text-zinc-400 ml-1">Users</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase">Absent</h3>
            <p className="text-xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : totalAbsent} 
              <span className="text-xs font-semibold text-zinc-400 ml-1">Users</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Table Header Bar */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tab Selection */}
          <div className="flex flex-wrap gap-1">
            {(["ALL", "Late", "Absent", "Leaves", "Overtime"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all duration-150 ${
                  activeTab === tab 
                    ? "bg-[#282d8d] text-white shadow-md shadow-indigo-900/10" 
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                }`}
              >
                {tab === "ALL" ? "ALL" : tab === "Leaves" ? "Leaves/Cuti" : tab}
              </button>
            ))}
          </div>

          {/* Search & Custom Actions */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search Employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-850 w-full sm:w-[220px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <button className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#282d8d]" />
              <span className="text-xs font-semibold text-zinc-400">Loading attendance records...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <span className="text-xs font-semibold text-red-500">
                {error?.message || "Failed to load attendance data"}
              </span>
              <button 
                onClick={() => void refetch()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#282d8d] border border-[#282d8d]/30 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-800/20 text-zinc-400 text-[10px] font-semibold uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Shift Info</th>
                  <th className="px-6 py-3.5">Clock In</th>
                  <th className="px-6 py-3.5">Clock Out</th>
                  <th className="px-6 py-3.5">Site Location</th>
                  <th className="px-6 py-3.5">Evidence</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                      
                      {/* Employee Profile */}
                      <td className="px-6 py-3.5 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center font-extrabold text-[#282d8d] dark:text-indigo-400 text-xs shadow-inner">
                          {row.avatarInitials}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-850 dark:text-zinc-200">{row.name}</p>
                          <p className="text-[10px] text-zinc-400">{row.role}</p>
                        </div>
                      </td>

                      {/* Shift */}
                      <td className="px-6 py-3.5 text-zinc-500 dark:text-zinc-400 font-medium">
                        {row.shift}
                      </td>

                      {/* Clock In */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${row.status === "Late" ? "text-red-500" : "text-zinc-850 dark:text-zinc-200"}`}>
                            {row.clockIn}
                          </span>
                          {row.status === "Late" && (
                            <span className="text-[9px] font-extrabold uppercase bg-red-50 dark:bg-red-950/20 text-red-600 px-2 py-0.5 rounded-full">
                              Late
                            </span>
                          )}
                          {row.status === "Absent" && (
                            <span className="text-[9px] font-extrabold uppercase bg-red-100 dark:bg-red-950/40 text-red-700 px-2 py-0.5 rounded-full">
                              Absent
                            </span>
                          )}
                          {row.status === "On Leave" && (
                            <span className="text-[9px] font-extrabold uppercase bg-blue-50 dark:bg-blue-950/20 text-blue-600 px-2 py-0.5 rounded-full">
                              On Leave
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Clock Out */}
                      <td className="px-6 py-3.5 font-bold text-zinc-850 dark:text-zinc-200">
                        {row.clockOut}
                      </td>

                      {/* Site */}
                      <td className="px-6 py-3.5">
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">{row.site}</span>
                        <p className="text-[9px] text-zinc-400 uppercase tracking-wider font-semibold">{row.department}</p>
                      </td>

                      {/* Evidence Photo */}
                      <td className="px-6 py-3.5">
                        {row.latitude ? (
                          <button 
                            onClick={() => handleOpenVerification(row)}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 hover:text-[#282d8d] dark:text-zinc-400 dark:hover:text-white transition-colors"
                          >
                            <Camera className="h-3.5 w-3.5" />
                            <span className="underline">View Photo</span>
                          </button>
                        ) : (
                          <span className="text-zinc-400 font-medium">-</span>
                        )}
                      </td>

                      {/* Eye Action */}
                      <td className="px-6 py-3.5 text-center">
                        <button 
                          onClick={() => handleOpenVerification(row)}
                          className="p-1.5 border border-zinc-100 hover:border-zinc-250 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-all duration-150"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-14 w-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
                          <Clock className="h-7 w-7 text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">No Records Found</p>
                          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                            Attendance data will appear here when employees check in via the mobile app.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {!isLoading && !isError && filteredRecords.length > 0 && (
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-bold text-zinc-400">
            <span>
              Page {currentPage} of {totalPages} 
              <span className="text-zinc-300 dark:text-zinc-600 ml-2">
                ({filteredRecords.length} records)
              </span>
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1 px-3 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 text-zinc-500 disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-7 w-7 flex items-center justify-center rounded-xl ${
                      currentPage === pageNum 
                        ? "bg-[#282d8d] text-white" 
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 px-3 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 text-zinc-500 disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* View Detail Modal (Read-Only) */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          
          {/* Modal Container */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] transition-transform duration-200 scale-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-5">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                  Attendance Verification
                </h2>
                <p className="text-[10px] text-zinc-400">
                  ID: {selectedRecord.id} &bull; {selectedRecord.clockIn}
                </p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-1.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-850 mb-5">
              <div className="h-11 w-11 rounded-full bg-indigo-100 dark:bg-zinc-800 text-[#282d8d] dark:text-indigo-400 font-extrabold flex items-center justify-center shadow-inner text-sm shrink-0">
                {selectedRecord.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white truncate">
                  {selectedRecord.name}
                </h4>
                <p className="text-[10px] text-zinc-400 truncate">{selectedRecord.role}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  selectedRecord.status === "Present" ? "bg-emerald-50 text-emerald-600" :
                  selectedRecord.status === "Late" ? "bg-amber-50 text-amber-600" :
                  selectedRecord.status === "Absent" ? "bg-red-50 text-red-600" :
                  "bg-blue-50 text-blue-600"
                }`}>
                  {selectedRecord.status}
                </span>
                <span className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full truncate max-w-[130px]">
                  {selectedRecord.shift}
                </span>
              </div>
            </div>

            {/* Modal Body — Verification Details (Read-Only) */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* Live Capture (Selfie) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Live Capture</span>
                    {selectedRecord.latitude && (
                      <span className="text-[9px] font-semibold text-emerald-500">Selfie Verified</span>
                    )}
                  </div>
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-850 h-56 bg-zinc-100 dark:bg-zinc-800">
                    {selectedRecord.latitude ? (
                      <img 
                        src={workerSelfie} 
                        alt="Employee Check-in Selfie" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-400">
                        <Camera className="h-8 w-8 text-zinc-350" />
                        <span className="text-xs font-semibold">No Selfie Captured</span>
                      </div>
                    )}
                    
                    {selectedRecord.latitude && (
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-[9px] font-bold text-white border border-white/10">
                        Captured at {selectedRecord.clockIn}
                      </div>
                    )}
                  </div>
                </div>

                {/* Geotagging Map View */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Geotag</span>
                    {selectedRecord.latitude ? (
                      <span className="text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                        Inside Radius
                      </span>
                    ) : null}
                  </div>

                  {/* Styled Mock Map */}
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-850 h-56 bg-indigo-50/20 dark:bg-zinc-850/50 flex flex-col justify-between p-4">
                    {/* Grid background lines to mimic map grid */}
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.06] dark:opacity-[0.02] pointer-events-none">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div key={i} className="border border-zinc-900" />
                      ))}
                    </div>

                    {selectedRecord.latitude ? (
                      <>
                        {/* Radius circle and pin marker */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-28 w-28 rounded-full border-2 border-dashed border-indigo-400 bg-indigo-400/5 animate-pulse flex items-center justify-center">
                            <div className="h-16 w-16 rounded-full border border-indigo-400 bg-indigo-400/10 flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-[#282d8d] dark:text-indigo-400 animate-bounce" />
                            </div>
                          </div>
                        </div>

                        {/* Coordinates Box */}
                        <div className="mt-auto z-10 mx-auto bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-xl shadow-sm text-[9px] font-bold text-zinc-500">
                          Lat: {selectedRecord.latitude}, Long: {selectedRecord.longitude}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-400">
                        <Map className="h-8 w-8 text-zinc-350" />
                        <span className="text-xs font-semibold">No GPS Data</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Attendance Details Summary */}
                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase">Clock In</span>
                    <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200 mt-0.5">{selectedRecord.clockIn}</p>
                  </div>
                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase">Clock Out</span>
                    <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200 mt-0.5">{selectedRecord.clockOut}</p>
                  </div>
                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase">Site</span>
                    <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200 mt-0.5">{selectedRecord.site}</p>
                  </div>
                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase">Department</span>
                    <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200 mt-0.5">{selectedRecord.department}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Actions (Read-Only) */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-5 flex items-center justify-end">
              <button 
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-xs font-bold text-zinc-600 hover:text-zinc-800 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
