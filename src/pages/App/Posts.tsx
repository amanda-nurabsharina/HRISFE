import { 
  Users, 
  Clock, 
  AlertTriangle, 
  Check, 
  X, 
  Bell,
  ArrowRight,
  FileSpreadsheet
} from "lucide-react";

export const Posts = () => {

  const stats = [
    { label: "Total Manpower", value: "1,247", change: "+23 from last month", isPositive: true, icon: Users },
    { label: "Attendance Number", value: "94.2%", change: "+2.1% from last week", isPositive: true, icon: Clock },
    { label: "Absent", value: "3", change: "-50% vs last week", isPositive: true, icon: AlertTriangle },
    { label: "Late Check-ins", value: "12", change: "-2.1% vs last week", isPositive: true, icon: Clock },
  ];

  const sites = [
    { id: 1, name: "Site Beta (Balikpapan)", shift: "Morning (06:00 - 18:00)", attendance: "100%", status: "Healthy" },
    { id: 2, name: "Site Alpha (Jakarta)", shift: "Morning (06:00 - 18:00)", attendance: "94.2%", status: "Healthy" },
    { id: 3, name: "Site Gamma (Surabaya)", shift: "Night (18:00 - 06:00)", attendance: "88.5%", status: "Warning" },
  ];

  return (
    <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
      
      {/* Page Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Real-time monitoring of workforce attendance across all sites.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-400">
                <stat.icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
                {stat.label}
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {stat.value}
              </span>
              <span className="text-[10px] font-bold text-emerald-500 ml-1">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Weekly Attendance and Attention Required */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Weekly Attendance Trends Card (col-span-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Weekly Attendance Trends</h2>
              <p className="text-[10px] text-zinc-400">Comparison of On-time, Late, and Absent per day.</p>
            </div>
            <div className="flex items-center gap-2">
              <select className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-xl font-semibold outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
              <button className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm transition-colors">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Bar Chart Graphic */}
          <div className="flex items-end justify-between h-48 px-2 sm:px-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            {[
              { day: "Mon", onTime: 50, late: 30, absent: 20 },
              { day: "Tue", onTime: 65, late: 20, absent: 15 },
              { day: "Wed", onTime: 75, late: 15, absent: 10 },
              { day: "Thu", onTime: 60, late: 25, absent: 15 },
              { day: "Fri", onTime: 70, late: 20, absent: 10 },
              { day: "Sat", onTime: 80, late: 10, absent: 10 },
              { day: "Sun", onTime: 55, late: 30, absent: 15 },
            ].map((dayData) => (
              <div key={dayData.day} className="flex flex-col items-center gap-2 w-full max-w-[40px]">
                {/* Stacked Bar Container */}
                <div className="w-7 sm:w-8 flex flex-col justify-end h-36 rounded-t-lg overflow-hidden gap-[2px]">
                  {/* Absent (Light Grayish Blue) */}
                  <div 
                    style={{ height: `${dayData.absent}%` }} 
                    className="bg-[#c2c5ec] transition-all hover:opacity-90"
                    title={`Absent: ${dayData.absent}%`}
                  />
                  {/* Late (Primary Dark Blue) */}
                  <div 
                    style={{ height: `${dayData.late}%` }} 
                    className="bg-[#282d8d] transition-all hover:opacity-90"
                    title={`Late: ${dayData.late}%`}
                  />
                  {/* On Time (Light Indigo) */}
                  <div 
                    style={{ height: `${dayData.onTime}%` }} 
                    className="bg-[#8280db] transition-all hover:opacity-90"
                    title={`On Time: ${dayData.onTime}%`}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">{dayData.day}</span>
              </div>
            ))}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-[10px] font-bold text-zinc-500">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#8280db]" />
              <span>On Time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#282d8d]" />
              <span>Late</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#c2c5ec]" />
              <span>Absent</span>
            </div>
          </div>
        </div>

        {/* Attention Required Card (col-span-4) */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-zinc-50 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-amber-500" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Attention Required</h2>
              </div>
              <span className="text-[9px] font-extrabold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full uppercase">
                3 Pending
              </span>
            </div>

            <div className="space-y-4">
              {/* Alert 1 */}
              <div className="space-y-2 border-b border-zinc-50 dark:border-zinc-800 pb-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Overtime Approval</h3>
                  <span className="text-[9px] text-zinc-400">10m ago</span>
                </div>
                <p className="text-[10px] leading-relaxed text-zinc-500">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Agus Pratama</span> (Site Beta) Requests 2 hours overtime.
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 bg-[#15803d] hover:bg-green-800 text-white text-[10px] font-bold py-1.5 rounded-xl transition-colors">
                    <Check className="h-3 w-3" />
                    <span>Approved</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 text-[10px] font-bold py-1.5 rounded-xl transition-colors">
                    <X className="h-3 w-3" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Missing Clock-Out</h3>
                  <span className="text-[9px] text-zinc-400">Yesterday</span>
                </div>
                <p className="text-[10px] leading-relaxed text-zinc-500">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">3 Employees</span> at Site Alpha did not clock out.
                </p>
                <button className="w-full flex items-center justify-center gap-1.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-bold py-1.5 rounded-xl transition-colors">
                  <Clock className="h-3 w-3" />
                  <span>Send Reminder</span>
                </button>
              </div>
            </div>
          </div>

          <a href="#" className="text-center text-[10px] font-bold text-[#282d8d] dark:text-indigo-400 hover:underline mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-center gap-1">
            <span>View All Notifications</span>
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Row 3: Month Payroll Cost Trend and Payroll Composition */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Month Payroll Cost Trend (col-span-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Month Payroll Cost Trend</h2>
            <p className="text-[10px] text-zinc-400">Total disbursement analysis</p>
          </div>

          {/* SVG Line Chart */}
          <div className="relative h-44 border-b border-zinc-100 dark:border-zinc-800">
            <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#f4f4f5" strokeWidth="0.5" className="dark:stroke-zinc-800" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="#f4f4f5" strokeWidth="0.5" className="dark:stroke-zinc-800" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f4f4f5" strokeWidth="0.5" className="dark:stroke-zinc-800" />

              {/* Chart Line - Net Pay */}
              <path 
                d="M 0,80 C 100,50 150,75 250,45 C 350,20 400,60 500,35" 
                fill="none" 
                stroke="#8280db" 
                strokeWidth="2.5" 
              />
              {/* Chart Line - Total Gross */}
              <path 
                d="M 0,65 C 100,30 150,55 250,25 C 350,5 400,45 500,20" 
                fill="none" 
                stroke="#282d8d" 
                strokeWidth="3.5" 
              />
            </svg>
            
            {/* Custom Interactive Tooltip Overlay */}
            <div className="absolute top-8 left-[120px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-xl shadow-md text-[9px] font-bold">
              <span className="text-zinc-400">Jan</span>
              <div className="text-indigo-600 mt-0.5">Total cross: <span className="font-black">Rp. 55M</span></div>
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between mt-2 px-1 text-[9px] font-bold text-zinc-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* Payroll Composition (col-span-4) */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Payroll Composition</h2>
            <p className="text-[10px] text-zinc-400">Current month breakdown</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            {/* Conic Gradient Donut */}
            <div 
              style={{
                background: "conic-gradient(#282d8d 0% 70%, #c2c5ec 70% 88%, #f59e0b 88% 100%)"
              }}
              className="relative w-36 h-36 rounded-full flex items-center justify-center shadow-inner"
            >
              <div className="absolute w-24 h-24 rounded-full bg-white dark:bg-zinc-900" />
            </div>

            {/* Legend */}
            <div className="space-y-3 flex-1 text-[10px] font-bold text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#282d8d]" />
                <span>Basic Salary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#c2c5ec]" />
                <span>BPJS/Tax</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                <span>Overtime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Real-Time Site Overview */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Real-Time Site Overview</h2>
          <p className="text-[10px] text-zinc-400">Live status from biometric & geo-fencing systems</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/20 text-zinc-400 text-[10px] font-semibold uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-3">Site Location</th>
                <th className="px-4 py-3">Current Shift</th>
                <th className="px-4 py-3">Attendance Rate</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
              {sites.map((site) => (
                <tr key={site.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-zinc-850 dark:text-zinc-200">{site.name}</td>
                  <td className="px-4 py-3.5 text-zinc-500">{site.shift}</td>
                  <td className="px-4 py-3.5 flex items-center gap-3">
                    <span className="font-extrabold text-zinc-800 dark:text-zinc-200">{site.attendance}</span>
                    <div className="w-24 bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div 
                        style={{ width: site.attendance }} 
                        className={`h-full ${site.status === "Healthy" ? "bg-emerald-600" : "bg-amber-500"}`} 
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      site.status === "Healthy" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {site.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
