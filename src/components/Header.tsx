import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useTheme } from "next-themes";
import txStar from "@/assets/tx-star.svg";

const navItems = [
  { to: "/", label: "HOME" },
  { to: "/candidates", label: "CANDIDATES" },
  { to: "/polling", label: "POLLING" },
  { to: "/independent-expenditures", label: "SUPER PAC SPENDING" },
  { to: "/top-donors", label: "TOP DONORS" },
  { to: "/faq", label: "FAQ" },
];

export function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-12 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-mono font-bold text-sm tracking-tight">
          <span
            aria-label="Texas lone star"
            role="img"
            className="inline-block h-5 w-5 bg-[#fdb417]"
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
          <span className="text-[#fdb417]">TXGOVTRACKER.COM</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map(({ to, label }) => (
            <Link key={to} to={to}>
              <Button
                variant="ghost"
                size="sm"
                className={`font-mono text-xs tracking-wider h-8 px-3 rounded-sm ${
                  isActive(to) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 rounded-sm text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            size="sm"
            onClick={() => setSignupOpen(true)}
            className="h-8 px-3 rounded-sm font-mono text-xs tracking-wider bg-[#fdb417] text-black hover:bg-[#fdb417]/90"
          >
            SIGN UP
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-card">
            <SheetTitle className="font-mono text-xs text-muted-foreground tracking-widest">MENU</SheetTitle>
            <nav className="flex flex-col gap-1 mt-6">
              {navItems.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-mono text-xs tracking-wider rounded-sm">
                    {label}
                  </Button>
                </Link>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 font-mono text-xs tracking-wider rounded-sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  setSignupOpen(true);
                }}
                className="w-full justify-start font-mono text-xs tracking-wider rounded-sm bg-[#fdb417] text-black hover:bg-[#fdb417]/90 mt-2"
              >
                SIGN UP
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
          <DialogContent className="w-[95vw] max-w-[520px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-mono tracking-wider">GET UPDATES</DialogTitle>
              <DialogDescription>
                Sign up to receive updates about the Political Integrity Project.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center w-full">
              <iframe
                src="https://politicalintegritypac.substack.com/embed?theme=night"
                className="w-full max-w-[480px] rounded-md"
                height="320"
                style={{
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  colorScheme: "dark",
                }}
                frameBorder={0}
                scrolling="no"
                title="Substack signup"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
