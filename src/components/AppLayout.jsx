import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Plus, History } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/log", label: "Log Entry", icon: Plus },
  { to: "/history", label: "History", icon: History },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="md:w-60 md:min-h-screen border-b md:border-b-0 md:border-r border-sidebar-border bg-sidebar-background flex md:flex-col">
        <div className="p-5 border-b border-sidebar-border hidden md:block">
          <h1 className="text-lg font-heading font-semibold text-sidebar-foreground">
            Good After 50
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Feel good, stay healthy</p>
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
                      ? "bg-sidebar-primary/15 text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}