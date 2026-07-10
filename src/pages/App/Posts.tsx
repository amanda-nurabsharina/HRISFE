import { useStore } from "../../store/store";
import { 
  Users, 
  FileText, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar, 
  UserPlus, 
  UserCheck 
} from "lucide-react";
import { format } from "date-fns";

export const Posts = () => {
  const user = useStore((state) => state.user);
  const currentDate = format(new Date(), "EEEE, d MMMM yyyy");

  const stats = [
    { label: "Total Employees", value: "1,248", change: "+12.3% this month", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Attendance Rate", value: "98.4%", change: "Within target range", icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Leave Requests", value: "14", change: "4 require urgent review", icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Open Positions", value: "8", change: "2 positions filled", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const recentAttendance = [
    { id: 1, name: "Jessica Alba", role: "Product Designer", dept: "Design", time: "08:52 AM", status: "Present" },
    { id: 2, name: "David Miller", role: "Backend Engineer", dept: "Engineering", time: "09:05 AM", status: "Late" },
    { id: 3, name: "Sarah Connor", role: "HR Manager", dept: "Human Resources", time: "08:30 AM", status: "Present" },
    { id: 4, name: "Tony Stark", role: "DevOps Engineer", dept: "Engineering", time: "-", status: "On Leave" },
    { id: 5, name: "Bruce Wayne", role: "Security Director", dept: "Operations", time: "08:15 AM", status: "Present" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Company Townhall", time: "Tomorrow, 10:00 AM", type: "meeting" },
    { id: 2, title: "Jessica Alba's Birthday", time: "14 July", type: "birthday" },
    { id: 3, title: "New Employee Orientation", time: "18 July, 09:00 AM", type: "event" },
  ];

  return (
    <div className="grid gap-6">
      {/* Welcome banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-6 rounded-2xl border border-emerald-500/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
            Welcome back, {user?.name ?? "Administrator"}!
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Here's what is happening with your organization today.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 shadow-sm">
          <Calendar className="h-4 w-4 text-emerald-500" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {stat.label}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">
                {stat.value}
              </span>
            </div>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Main panels */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Attendance panel */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Recent Attendance Logs</h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Latest employee activity reports</p>
            </div>
            <button className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold flex items-center gap-1 hover:underline">
              View All <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-800/20 text-zinc-400 dark:text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Check-in</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                {recentAttendance.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-600 text-xs">
                        {row.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-700 dark:text-zinc-200">{row.name}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">{row.role}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{row.dept}</td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{row.time}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        row.status === "Present" ? "bg-emerald-500/10 text-emerald-600" :
                        row.status === "Late" ? "bg-amber-500/10 text-amber-600" :
                        "bg-blue-500/10 text-blue-600"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="grid gap-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-6 rounded-2xl shadow-sm">
            <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-4">Quick Administrator Actions</h2>
            <div className="grid gap-2">
              <button className="w-full flex items-center justify-center gap-2 h-10 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 active:scale-[0.98]">
                <UserPlus className="h-4 w-4 text-emerald-500" />
                Add New Employee
              </button>
              <button className="w-full flex items-center justify-center gap-2 h-10 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 active:scale-[0.98]">
                <FileText className="h-4 w-4 text-emerald-500" />
                Request Leave Review
              </button>
              <button className="w-full flex items-center justify-center gap-2 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/10 transition-colors active:scale-[0.98]">
                <Clock className="h-4 w-4" />
                Clock-In Attendance
              </button>
            </div>
          </div>

          {/* Upcoming events */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-6 rounded-2xl shadow-sm">
            <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-4">Upcoming Schedule</h2>
            <div className="grid gap-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-500">
                    <Clock className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{event.title}</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
