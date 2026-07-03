import { Link, useLocation } from "react-router-dom";
import { Home, Users, TrendingUp, DollarSign, Landmark } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/polling", label: "Polling", icon: TrendingUp },
  { to: "/money", label: "Money", icon: DollarSign },
  { to: "/statewide", label: "Statewide", icon: Landmark },
];

export function MobileTabBar() {
  const location = useLocation();
  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="flex items-stretch justify-around h-14">
        {items.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 h-full text-[11px] transition-colors ${
                  active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
