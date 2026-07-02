export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-12">
      <div className="container py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-primary">
            Support Independent Election Tracking
          </div>
          <h2 className="font-orbitron font-bold uppercase text-2xl md:text-3xl tracking-tight">
            Help Keep This <span className="text-primary terminal-glow">Free</span>
          </h2>
        </div>
        <div className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground text-center pt-4 border-t border-border/40 space-y-1">
          <div>
            Powered by the{" "}
            <span className="text-foreground">Political Integrity Project</span>
          </div>
          <div>
            Questions?{" "}
            <a
              href="mailto:team@politicalintegrity.us"
              className="text-primary hover:underline normal-case tracking-normal"
            >
              team@politicalintegrity.us
            </a>
          </div>
          <div>© 2026 · Data from 270toWin &amp; TEC</div>
        </div>
      </div>
    </footer>
  );
}
