import { Brand, RouteLink, Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui";
import { LayoutDashboard, Users, Clock, CalendarRange, Settings } from "lucide-react";

export const Sidebar = () => {
  const menuItems = [
    { to: "/app", label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/employees", label: "Employees", icon: Users },
    { to: "/app/attendance", label: "Attendance", icon: Clock },
    { to: "/app/leaves", label: "Leave Requests", icon: CalendarRange },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-[--z-navbar] hidden w-16 flex-col border-r bg-zinc-950 text-zinc-400 sm:flex shadow-lg transition-all duration-300">
      <nav className="flex flex-col items-center gap-6 px-2 sm:py-6">
        <Brand className="text-white hover:opacity-85 transition-opacity mb-4" />
        
        {menuItems.map((item) => (
          <Tooltip key={item.to}>
            <TooltipTrigger>
              <RouteLink
                to={item.to as any}
                activeOptions={{ exact: true }}
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:text-white hover:bg-emerald-500/10 active:scale-95 [&.active]:bg-emerald-500 [&.active]:text-white shadow-emerald-500/20"
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </RouteLink>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-zinc-900 border-zinc-800 text-white font-medium">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-6">
        <Tooltip>
          <TooltipTrigger>
            <RouteLink
              to={"/app/settings" as any}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:text-white hover:bg-emerald-500/10 active:scale-95 [&.active]:bg-emerald-500 [&.active]:text-white shadow-emerald-500/20"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </RouteLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-zinc-900 border-zinc-800 text-white font-medium">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
};
