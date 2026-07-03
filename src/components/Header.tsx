import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useTheme } from "next-themes";
import DonationPanel from "@/components/donate/DonationPanel";
import txStar from "@/assets/tx-star.svg";

const navItems = [
  { to: "/candidates", label: "Candidates" },
  { to: "/polling", label: "Polling" },
  { to: "/money", label: "Money" },
  { to: "/statewide", label: "Statewide" },
  { to: "/about", label: "About" },
];

export function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isActive = (to: string) => location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span
            aria-label="Texas lone star"
            role="img"
            className="inline-block h-5 w-5 shrink-0 bg-primary"
            style={{
              WebkitMaskImage: `url(${txStar})`,
              maskImage: `url(${txStar})`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
          <span className="font-display text-lg font-bold tracking-tight truncate">
            Texas Politics Tracker
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label }) => (
            <Link key={to} to={to}>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 text-sm ${
                  isActive(to)
                    ? "text-foreground bg-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button size="sm" onClick={() => setDonateOpen(true)} className="h-8 px-3 text-sm gap-1.5">
            <Heart className="h-3.5 w-3.5" />
            Donate
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-card">
            <SheetTitle className="font-display text-lg">Menu</SheetTitle>
            <nav className="flex flex-col gap-1 mt-6">
              {navItems.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    {label}
                  </Button>
                </Link>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  setDonateOpen(true);
                }}
                className="w-full justify-start gap-2 text-sm mt-2"
              >
                <Heart className="h-4 w-4" />
                Donate
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        <Dialog open={donateOpen} onOpenChange={setDonateOpen}>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="w-[95vw] max-w-md h-[90vh] p-0 overflow-hidden bg-white"
          >
            <DialogTitle className="sr-only">Donate</DialogTitle>
            <DialogDescription className="sr-only">
              Donate to the Political Integrity Project
            </DialogDescription>
            {donateOpen && (
              <div className="h-full w-full overflow-y-auto scrollbar-hide bg-white">
                <DonationPanel />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
