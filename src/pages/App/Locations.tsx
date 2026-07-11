import * as React from "react";
import { 
  MapPin, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  X, 
  Compass, 
  Navigation,
  Globe
} from "lucide-react";
import { useToast } from "../../components/ui";
import { 
  useLocationsQuery, 
  useCreateLocationMutation, 
  useUpdateLocationMutation, 
  useDeleteLocationMutation 
} from "../../api/location";
import { TLocationRecord } from "../../api/location/location.types";

export const Locations = () => {
  const { toast } = useToast();
  
  // Search & Pagination State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<TLocationRecord | null>(null);

  // Form states
  const [formName, setFormName] = React.useState("");
  const [formDepartment, setFormDepartment] = React.useState("");
  const [formLatitude, setFormLatitude] = React.useState<number | "">("");
  const [formLongitude, setFormLongitude] = React.useState<number | "">("");
  const [formRadius, setFormRadius] = React.useState<number | "">(100);

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 405);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Query Locations
  const { data, isLoading, isError, refetch } = useLocationsQuery({
    search: debouncedSearch,
    page: currentPage,
    limit: itemsPerPage,
  });

  // Mutations
  const createMutation = useCreateLocationMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Location successfully created",
      } as any);
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to create",
        description: error.message || "An error occurred",
      } as any);
    },
  });

  const updateMutation = useUpdateLocationMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Location successfully updated",
      } as any);
      setIsEditModalOpen(false);
      setSelectedLocation(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: error.message || "An error occurred",
      } as any);
    },
  });

  const deleteMutation = useDeleteLocationMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Location successfully deleted",
      } as any);
      setIsDeleteModalOpen(false);
      setSelectedLocation(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: error.message || "An error occurred",
      } as any);
    },
  });

  const resetForm = () => {
    setFormName("");
    setFormDepartment("");
    setFormLatitude("");
    setFormLongitude("");
    setFormRadius(100);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (loc: TLocationRecord) => {
    setSelectedLocation(loc);
    setFormName(loc.name);
    setFormDepartment(loc.department);
    setFormLatitude(loc.latitude);
    setFormLongitude(loc.longitude);
    setFormRadius(loc.radius);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (loc: TLocationRecord) => {
    setSelectedLocation(loc);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDepartment || formLatitude === "" || formLongitude === "" || formRadius === "") {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "All fields are required",
      } as any);
      return;
    }

    createMutation.mutate({
      name: formName,
      department: formDepartment,
      latitude: Number(formLatitude),
      longitude: Number(formLongitude),
      radius: Number(formRadius),
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;
    if (!formName || !formDepartment || formLatitude === "" || formLongitude === "" || formRadius === "") {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "All fields are required",
      } as any);
      return;
    }

    updateMutation.mutate({
      id: selectedLocation.id,
      payload: {
        name: formName,
        department: formDepartment,
        latitude: Number(formLatitude),
        longitude: Number(formLongitude),
        radius: Number(formRadius),
      },
    });
  };

  const handleDeleteSubmit = () => {
    if (!selectedLocation) return;
    deleteMutation.mutate(selectedLocation.id);
  };

  const totalResults = data?.total_results || 0;
  const totalPages = data?.total_pages || 1;
  const locationsList = data?.results || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-zinc-800 text-[#282d8d] dark:text-indigo-400 shadow-sm border border-indigo-100/30">
            <MapPin className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Site Locations</h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Manage office coordinates and geofencing radius validation</p>
          </div>
        </div>
        <div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#282d8d] hover:bg-indigo-900 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-500/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Location</span>
          </button>
        </div>
      </div>

      {/* Filter / Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search site name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800 dark:text-zinc-150"
          />
        </div>
        <button
          onClick={() => void refetch()}
          className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/85 rounded-xl hover:shadow-sm transition-all"
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Site Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Coordinates (Lat / Lng)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider text-center">Geofence Radius</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-450">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-zinc-400" />
                      <span className="text-xs">Loading locations list...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-red-500">
                    <div className="flex flex-col items-center gap-1">
                      <Globe className="h-6 w-6 text-red-400" />
                      <span className="text-xs font-semibold">Failed to fetch locations from backend</span>
                    </div>
                  </td>
                </tr>
              ) : locationsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500">
                    <div className="flex flex-col items-center gap-1.5">
                      <MapPin className="h-7 w-7 text-zinc-300 dark:text-zinc-700" />
                      <span className="text-xs">No registered locations found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                locationsList.map((loc) => (
                  <tr 
                    key={loc.id}
                    className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-[#282d8d] dark:text-indigo-400 font-bold text-xs uppercase shadow-sm">
                          {loc.name.slice(0, 2)}
                        </div>
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{loc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400">
                        {loc.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          <span className="text-zinc-400 dark:text-zinc-600">LAT:</span>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{loc.latitude.toFixed(5)}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <span className="text-zinc-400 dark:text-zinc-600">LNG:</span>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{loc.longitude.toFixed(5)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
                        <Compass className="h-3 w-3" />
                        {loc.radius} m
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-400 dark:text-zinc-500">
                      {new Date(loc.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(loc)}
                          className="p-1.5 text-zinc-500 hover:text-indigo-650 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all"
                          title="Edit Location"
                        >
                          <Edit2 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(loc)}
                          className="p-1.5 text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all"
                          title="Delete Location"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-900">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              Showing <span className="font-bold text-zinc-700 dark:text-zinc-300">{locationsList.length}</span> of <span className="font-bold text-zinc-700 dark:text-zinc-300">{totalResults}</span> sites
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg font-bold text-zinc-600 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-colors ${
                    currentPage === page
                      ? "bg-[#282d8d] text-white"
                      : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-zinc-600 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg font-bold text-zinc-600 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================== ADD LOCATION DIALOG ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] transition-transform duration-200 scale-100">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">Add Location</h2>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Register coordinates for geofence validation</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-zinc-650 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-750 dark:text-zinc-300">Site Name</label>
                <input
                  type="text"
                  placeholder="e.g. Site Alpha"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50/50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-850 dark:text-zinc-150"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-750 dark:text-zinc-300">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Operations"
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50/50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-850 dark:text-zinc-150"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-750 dark:text-zinc-300 flex items-center gap-1">
                    <Navigation className="h-3 w-3 text-zinc-400" />
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. -0.50200"
                    value={formLatitude}
                    onChange={(e) => setFormLatitude(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-zinc-50/50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-850 dark:text-zinc-150"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-750 dark:text-zinc-300 flex items-center gap-1">
                    <Navigation className="h-3 w-3 text-zinc-400 rotate-90" />
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 101.44500"
                    value={formLongitude}
                    onChange={(e) => setFormLongitude(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-zinc-50/50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-850 dark:text-zinc-150"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-750 dark:text-zinc-300">Geofence Radius (meters)</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={formRadius}
                  onChange={(e) => setFormRadius(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50/50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-850 dark:text-zinc-150"
                  required
                  min={1}
                />
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4.5 py-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2.5 bg-[#282d8d] hover:bg-indigo-900 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-500/20 disabled:opacity-50"
                >
                  {createMutation.isPending ? "Saving..." : "Create Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EDIT LOCATION DIALOG ==================== */}
      {isEditModalOpen && selectedLocation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] transition-transform duration-200 scale-100">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">Edit Location</h2>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Modify coordinates and geofence parameters</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-zinc-650 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-750 dark:text-zinc-300">Site Name</label>
                <input
                  type="text"
                  placeholder="e.g. Site Alpha"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50/50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-850 dark:text-zinc-150"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-750 dark:text-zinc-300">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Operations"
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50/50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-850 dark:text-zinc-150"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-750 dark:text-zinc-300 flex items-center gap-1">
                    <Navigation className="h-3 w-3 text-zinc-400" />
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. -0.50200"
                    value={formLatitude}
                    onChange={(e) => setFormLatitude(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-zinc-50/50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-850 dark:text-zinc-150"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-750 dark:text-zinc-300 flex items-center gap-1">
                    <Navigation className="h-3 w-3 text-zinc-400 rotate-90" />
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 101.44500"
                    value={formLongitude}
                    onChange={(e) => setFormLongitude(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-zinc-50/50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-850 dark:text-zinc-150"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-750 dark:text-zinc-300">Geofence Radius (meters)</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={formRadius}
                  onChange={(e) => setFormRadius(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50/50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-850 dark:text-zinc-150"
                  required
                  min={1}
                />
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4.5 py-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-5 py-2.5 bg-[#282d8d] hover:bg-indigo-900 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-500/20 disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE LOCATION CONFIRMATION ==================== */}
      {isDeleteModalOpen && selectedLocation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden flex flex-col transition-transform duration-250 scale-100">
            {/* Icon warning */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-100/50 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Delete Location?</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 leading-relaxed">
              Are you sure you want to delete <span className="font-extrabold text-zinc-800 dark:text-zinc-200">"{selectedLocation.name}"</span>? 
              This action cannot be undone. Geofencing check-in validation for this site will be removed.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4.5 py-2.5 text-xs font-bold text-zinc-550 hover:text-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={deleteMutation.isPending}
                className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-red-500/25 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Location"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
