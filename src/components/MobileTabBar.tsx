import { Link, useLocation } from "react-router-dom";
import { Home, Users, BarChart3, DollarSign, Wallet, HelpCircle } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/polling", label: "Polling", icon: BarChart3 },
  { to: "/independent-expenditures", label: "Super PAC", icon: DollarSign },
  { to: "/top-donors", label: "Donors", icon: Wallet },
  { to: "/faq", label: "FAQ", icon: HelpCircle },
];

export function MobileTabBar() {
  const location = useLocation();
  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
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
                className={`flex flex-col items-center justify-center gap-0.5 h-full font-mono text-[10px] tracking-wider transition-colors ${
                  active ? "text-[#fdb417]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="uppercase">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
