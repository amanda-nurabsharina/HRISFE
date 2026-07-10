import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import profileIcon from "../../assets/react.svg";
import { Footer, Sheet, SheetContent, SheetTrigger } from "../../components/layout";
import {
  Brand,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  LangToggler,
  RouteLink,
  ThemeToggler,
} from "../../components/ui";
import { Input } from "../../components/forms";
import { PanelLeft, Search, LayoutDashboard, Users, Clock, CalendarRange, Settings as SettingsIcon } from "lucide-react";
import { useAppLayout } from "./useAppLayout";
import { useStore } from "../../store/store";
import { useUIStore } from "../../store/uiStore";

export const AppLayout = () => {
  const { handleLogout } = useAppLayout();
  const user = useStore((state) => state.user);
  const { isSidebarCollapsed } = useUIStore();

  const mobileMenuItems = [
    { to: "/app" as any, label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/employees" as any, label: "Employees", icon: Users },
    { to: "/app/attendance" as any, label: "Attendance", icon: Clock },
    { to: "/app/leaves" as any, label: "Leave Requests", icon: CalendarRange },
    { to: "/app/settings" as any, label: "Settings", icon: SettingsIcon },
  ];

  return (
    <main>
      <div className="h-[calc(100dvh-var(--footer-height))] bg-zinc-50 dark:bg-zinc-950/20">
        <Sidebar />

        <div className={`flex h-full flex-col sm:gap-4 sm:py-4 transition-all duration-300 ${
          isSidebarCollapsed ? "sm:pl-16" : "sm:pl-64"
        }`}>
          <header className="sticky top-0 z-[--z-navbar] flex h-[--navbar-height] items-center gap-4 border-b bg-background/85 backdrop-blur-md px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="sm:hidden"
                >
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="sm:max-w-xs bg-zinc-950 text-zinc-400 border-zinc-800"
              >
                <nav className="grid gap-6 text-lg font-medium">
                  <Brand className="justify-start text-white mb-6" />

                  {mobileMenuItems.map((item) => (
                    <RouteLink
                      key={item.to}
                      to={item.to}
                      activeOptions={{ exact: true }}
                      className="flex items-center gap-4 px-2.5 hover:text-white transition-colors [&.active]:text-emerald-400"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </RouteLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search everything..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="flex gap-1">
              <LangToggler />
              <ThemeToggler />
            </div>

            {user && (
              <div className="hidden md:flex flex-col text-right ml-2">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{user.name}</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                  {user.role}
                </span>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full border-zinc-200 dark:border-zinc-800"
                >
                  <img
                    src={profileIcon}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full bg-emerald-500/10 p-1"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-zinc-800 dark:text-zinc-200">{user?.name}</p>
                    <p className="text-xs leading-none text-zinc-400">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <RouteLink to="/app/settings" className="w-full">Settings</RouteLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void handleLogout()} className="text-red-500 focus:text-red-500">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <div className="grid flex-1 items-start gap-4 overflow-scroll p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};
