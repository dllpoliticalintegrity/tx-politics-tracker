import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  useLatestContributions,
  contributionVerb,
  formatContributionAmount,
  donorDisplayName,
  donorContext,
  candidateShort,
} from "@/hooks/useLatestContributions";
import { useCandidates } from "@/hooks/useCandidates";

const ELECTION_TARGET_MS = new Date("2026-11-03T13:00:00Z").getTime(); // 7am CT polls open, general election
const ELECTION_LABEL = "Nov 3, 2026 · 7:00 AM CT";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function useNowTick() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function BetaLayout({
  active,
  children,
}: {
  active: "dashboard" | "candidates" | "polling" | "donors" | "ie" | "faq";
  children: ReactNode;
}) {
  const now = useNowTick();
  const diff = Math.max(0, ELECTION_TARGET_MS - now);
  const days = Math.floor(diff / 86_400_000);
  const hh = Math.floor((diff % 86_400_000) / 3_600_000);

  const ptHours = pad(new Date(now).getUTCHours() - 8 < 0 ? new Date(now).getUTCHours() - 8 + 24 : new Date(now).getUTCHours() - 8);
  const ptMins = pad(new Date(now).getUTCMinutes());
  const ptSecs = pad(new Date(now).getUTCSeconds());
  const clockText = `${ptHours}:${ptMins}:${ptSecs} PT`;

  const { data: candidates } = useCandidates();
  const { data: contribs } = useLatestContributions(20);

  // Build ticker items, doubled for seamless marquee.
  const tickerItems = useMemo(() => {
    if (!contribs || contribs.length === 0) return null;
    return [...contribs, ...contribs];
  }, [contribs]);

  return (
    <div className="beta-app">
      <ContributionsTicker items={tickerItems} />

      {/* status bar */}
      <div className="statusbar">
        <div className="statusbar__inner">
          <span className="statusbar__live">
            <span className="live-dot" />
            LIVE
          </span>
          <span className="statusbar__sep">│</span>
          <span>{clockText}</span>
          <span className="statusbar__sep">│</span>
          <span>
            2026 TX GOVERNOR · GENERAL{" "}
            <strong style={{ color: "var(--periwinkle-deep)" }}>
              {days} DAY{days === 1 ? "" : "S"}
            </strong>
          </span>
          <span className="statusbar__sep">│</span>
          <span>
            CANDIDATES{" "}
            <strong style={{ color: "var(--green-deep)" }}>{candidates?.length ?? "—"}</strong>
          </span>
          <span className="statusbar__right">
            <span className="preview-tag">BETA · LIVE DATA</span>
            <a href="https://github.com/dllpoliticalintegrity/ca-gov-polling" target="_blank" rel="noopener noreferrer">
              METHODOLOGY
            </a>
            <a href="https://github.com/dllpoliticalintegrity/ca-gov-polling" target="_blank" rel="noopener noreferrer">
              SOURCES
            </a>
          </span>
        </div>
      </div>

      {/* nav */}
      <nav className="nav">
        <div className="nav__inner">
          <Link className="brand" to="/beta">
            <div className="brand__mark" aria-hidden>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fffced"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10.2" />
                <path d="M7 12 l3 3 l7 -7" />
              </svg>
            </div>
            <div className="brand__name">
              CA <em>Governor</em> 2026
              <small>POLLS · DONORS · IE</small>
            </div>
          </Link>
          <div className="nav__tabs">
            <BetaNavTab to="/beta" exact label="Dashboard" active={active === "dashboard"} />
            <BetaNavTab
              to="/beta/candidates"
              label="Candidates"
              badge={candidates?.length}
              active={active === "candidates"}
            />
            <BetaNavTab to="/beta/polling" label="Polling" active={active === "polling"} liveBadge />
            <BetaNavTab to="/beta/top-donors" label="Top donors" active={active === "donors"} />
            <BetaNavTab to="/beta/ie" label="IE" active={active === "ie"} />
            <BetaNavTab to="/beta/faq" label="FAQ" active={active === "faq"} />
          </div>
          <div className="nav__util">
            <Link className="btn btn--ghost" to="/">
              ← Live site
            </Link>
            <a className="btn btn--primary" href="#">
              Subscribe
            </a>
          </div>
        </div>
      </nav>

      {children}

      {/* status line footer */}
      <footer className="statusline">
        <div className="statusline__inner">
          <span className="statusline__source">TEC</span>
          <span className="statusline__source">RealClearPolitics</span>
          <span className="statusline__source">Wikipedia</span>
          <span className="statusline__source warn">FEC · cached</span>
          <span className="statusline__right">
            <a href="#">© Political Integrity Project · 501(c)(4)</a>
            <a href="#">Methodology</a>
            <a href="#">API docs</a>
          </span>
        </div>
      </footer>

      {/* expose a constant for the dashboard */}
    </div>
  );
}

export const ELECTION_TARGET = ELECTION_TARGET_MS;
export const ELECTION_DATE_LABEL = ELECTION_LABEL;

function BetaNavTab({
  to,
  label,
  badge,
  active,
  liveBadge,
  exact,
}: {
  to: string;
  label: string;
  badge?: number;
  active?: boolean;
  liveBadge?: boolean;
  exact?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={`nav__tab ${active ? "active" : ""} ${liveBadge ? "live-badge" : ""}`}
    >
      {label}
      {badge !== undefined && <span className="badge">{badge}</span>}
    </NavLink>
  );
}

function ContributionsTicker({ items }: { items: ReturnType<typeof useLatestContributions>["data"] | null }) {
  return (
    <div className="feed" aria-label="Latest contributions">
      <div className="feed__chip">●&nbsp;&nbsp;LATEST CONTRIBUTIONS</div>
      <div className="feed__viewport">
        <div className="feed__track">
          {items === null ? (
            <span className="feed__item">
              <span className="meta">Loading contributions…</span>
            </span>
          ) : items.length === 0 ? (
            <span className="feed__item">
              <span className="meta">No contributions yet.</span>
            </span>
          ) : (
            items.map((c, i) => {
              const v = contributionVerb(c);
              const recipParty = (c.candidate_party || "I").toLowerCase();
              const ctx = donorContext(c);
              return (
                <span className="feed__item" key={`${c.id}-${i}`}>
                  <span className={`verb ${v.verb}`}>{v.label}</span>
                  <span className="amt">{formatContributionAmount(c.amount)}</span>
                  <span className="who">{donorDisplayName(c)}</span>
                  {ctx && (
                    <>
                      <span className="meta">{ctx}</span>
                      <span className="meta">·</span>
                    </>
                  )}
                  <span className="arrow">→</span>
                  <span className="recip">
                    <span className={`party-${recipParty}`}>{(c.candidate_party || "I").toUpperCase()}</span>{" "}
                    {candidateShort(c.candidate_name)}
                  </span>
                </span>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
