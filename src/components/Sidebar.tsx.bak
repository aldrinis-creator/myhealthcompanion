import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Heart,
  LayoutDashboard,
  Pill,
  Activity,
  CalendarCheck,
  Footprints,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Medications", path: "/medications", icon: Pill },
  { label: "Vitals", path: "/vitals", icon: Activity },
  { label: "Appointments", path: "/appointments", icon: CalendarCheck },
  { label: "Activity", path: "/activity", icon: Footprints },
  { label: "Profile", path: "/profile", icon: UserCircle },
];

export default function Sidebar({ onClose }: { onClose: () => void }) {
  const { pathname } = useLocation();
  const { signOut, session } = useAuth();

  return (
    <aside className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Heart className="w-4 h-4 text-sidebar-primary" />
          </div>
          <span className="font-bold text-sidebar-foreground text-sm">MyHealthCompanion</span>
        </div>
        <button onClick={onClose} className="md:hidden p-1 rounded hover:bg-sidebar-accent">
          <X className="h-4 w-4 text-sidebar-foreground" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground truncate mb-2 px-3">
          {session?.user?.email}
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
