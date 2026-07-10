import { RouteLink } from "../../components/ui";
import { useStore } from "../../store/store";
import { useAppLayout } from "./useAppLayout";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  FileText,
  CalendarRange,
  CreditCard,
  Briefcase,
  DollarSign,
  TrendingUp,
  BarChart3,
  Megaphone,
  Settings,
  LogOut,
  ChevronsLeftRight,
} from "lucide-react";

export const Sidebar = () => {
  const user = useStore((state) => state.user);
  const { handleLogout } = useAppLayout();

  const menuSections = [
    {
      title: "Main Menu",
      items: [
        { to: "/app" as any, label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "WORKFORCE MANAGEMENT",
      items: [
        { to: "/app/attendance" as any, label: "Attendance", icon: Clock },
        { to: "/app/timesheets" as any, label: "Timesheets", icon: Calendar },
        { to: "/app/overtime" as any, label: "Overtime", icon: FileText },
        { to: "/app/roster" as any, label: "Shift Roster", icon: CalendarRange },
      ],
    },
    {
      title: "FINANCE",
      items: [
        { to: "/app/payroll" as any, label: "Payroll", icon: CreditCard },
        { to: "/app/travel" as any, label: "Business Travel", icon: Briefcase },
        { to: "/app/claims" as any, label: "Cash Advance & Claims", icon: DollarSign },
      ],
    },
    {
      title: "HR & TALENT",
      items: [
        { to: "/app/employees" as any, label: "Employee Directory", icon: Users },
        { to: "/app/recruitment" as any, label: "Recruitment", icon: Users },
        { to: "/app/kpi" as any, label: "Performance (KPI)", icon: TrendingUp },
        { to: "/app/leaves" as any, label: "Leave Management", icon: CalendarRange },
      ],
    },
    {
      title: "GENERAL",
      items: [
        { to: "/app/analytics" as any, label: "Reports & Analytics", icon: BarChart3 },
        { to: "/app/announcements" as any, label: "Announcements", icon: Megaphone },
        { to: "/app/settings" as any, label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-[--z-navbar] hidden w-64 flex-col border-r bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 sm:flex shadow-sm transition-all duration-300">
      
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#282d8d] text-white">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-sm tracking-wide text-[#282d8d] dark:text-indigo-400">
            HRIS MANAGEMENT
          </span>
        </div>
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          <ChevronsLeftRight className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <h3 className="px-3 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <RouteLink
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: true }}
                  className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-[#282d8d] dark:hover:text-white [&.active]:bg-[#282d8d] [&.active]:text-white [&.active]:shadow-md [&.active]:shadow-indigo-900/10"
                >
                  <item.icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </RouteLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dashed border-[#282d8d]/30 bg-indigo-50/20 dark:bg-zinc-800/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-zinc-800 text-[#282d8d] dark:text-indigo-400 font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                {user.name}
              </h4>
              <p className="text-[10px] text-zinc-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => void handleLogout()}
          className="flex w-full items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors duration-150"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
