import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus, History, User, BarChart3 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/log", label: "Log Entry", icon: Plus },
  { to: "/history", label: "History", icon: History },
  { to: "/progress-reports", label: "Progress", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
];

export default function AppLayout() {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !profile) {
      navigate("/onboarding", { replace: true });
    }
  }, [loading, profile, navigate]);

  if (loading || !profile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="md:w-60 md:min-h-screen border-b md:border-b-0 md:border-r border-sidebar-border bg-sidebar-background flex md:flex-col">
        <div className="p-5 border-b border-sidebar-border hidden md:block">
          <h1 className="text-base font-heading font-extrabold uppercase tracking-[0.16em] text-chart-3">
            Good After 50
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-display italic">Feel good, stay healthy</p>
        </div>
        <nav className="flex md:flex-col gap-1 p-3 md:p-4 flex-1 overflow-x-auto md:overflow-x-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5 shrink-0" size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}