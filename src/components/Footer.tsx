import { Link } from "react-router-dom";

const footerLinks = [
  { to: "/candidates", label: "Candidates" },
  { to: "/polling", label: "Polling" },
  { to: "/money", label: "Money" },
  { to: "/statewide", label: "Statewide races" },
  { to: "/about", label: "About & methodology" },
];

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-sm space-y-2">
            <div className="font-display text-lg font-bold">Texas Politics Tracker</div>
            <p className="text-sm text-muted-foreground">
              A public-interest dashboard following the money and polling in the 2026
              Texas Governor's race, from the Political Integrity Project.
            </p>
            <p className="text-sm text-muted-foreground">
              <a
                href="https://politicalintegritypac.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get updates by email →
              </a>
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            {footerLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="text-muted-foreground hover:text-foreground">
                {label}
              </Link>
            ))}
            <a
              href="mailto:team@politicalintegrity.us"
              className="text-muted-foreground hover:text-foreground"
            >
              Contact us
            </a>
          </nav>
        </div>
        <div className="pt-6 border-t text-xs text-muted-foreground space-y-1">
          <p>
            Updated nightly from the Texas Ethics Commission and 270toWin. Data is presented
            as filed; corrections and amendments appear after the next sync.
          </p>
          <p>© 2026 Political Integrity Project</p>
        </div>
      </div>
    </footer>
  );
}
