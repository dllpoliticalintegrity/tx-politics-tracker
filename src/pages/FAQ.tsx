import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Check, X, ExternalLink } from "lucide-react";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { q: "How much can I personally give to a candidate for Governor?", a: "Up to $39,200 per election. Since the primary and general are separate elections, an individual can give up to $78,400 total across the 2026 cycle." },
    { q: "Are there any contributions with no limit?", a: "Yes. Political parties can give unlimited amounts to candidates. Ballot measure committees, legal defense funds, and committees opposing a recall can also accept unlimited contributions." },
    { q: "What about Super PACs and outside spending?", a: "Independent expenditure committees (Super PACs) can raise and spend unlimited money supporting or opposing candidates — as long as that spending is not coordinated with the candidate's campaign." },
    { q: "Can a candidate transfer money to another candidate?", a: "A state candidate or officeholder may not contribute more than $5,900 per election to a committee controlled by another state candidate, including from personal or campaign funds." },
    { q: "What is the voluntary expenditure ceiling?", a: "Candidates can voluntarily cap their own spending in exchange for a 250-word statement in the official ballot pamphlet. For Governor, the ceiling is $11.77M for the primary and $19.61M for the general." },
    { q: "What is a Small Contributor Committee?", a: "A committee that has existed for 6+ months, receives donations from 100+ people, accepts no more than $200/year from any single person, and contributes to 5+ candidates. SCCs can give the same $39,200 limit as individuals to gubernatorial candidates." },
    { q: "Are contributions from affiliated companies counted separately?", a: "No — contributions from affiliated entities are aggregated for the limit. You cannot bypass the cap by routing donations through subsidiaries or related LLCs." },
    { q: "Where does this data come from?", a: "All limits are published by the California Fair Political Practices Commission (FPPC). Contribution data on this site is sourced from CAL-ACCESS filings (Forms 460, 461, and 496)." },
  ].map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const govLimits = [
  { who: "Individual / Business / PAC", limit: "$39,200" },
  { who: "Small Contributor Committee", limit: "$39,200" },
  { who: "Political Party", limit: "No Limit" },
];

const otherCommittees = [
  { who: "PAC contributing to state candidates", limit: "$9,800 / yr" },
  { who: "Political Party account for state candidates", limit: "$49,000 / yr" },
  { who: "Small Contributor Committee", limit: "$200 / yr" },
  { who: "Ballot measure / non-candidate PAC", limit: "No Limit*" },
];

const govCeiling = [
  { election: "Primary", amount: "$11,767,000" },
  { election: "General", amount: "$19,611,000" },
];

const allowed = [
  "Individuals donating up to $39,200 per election to a Governor candidate",
  "Political parties making unlimited contributions to candidates",
  "Independent expenditures by Super PACs (no contribution limit when not coordinated)",
  "Ballot measure committees accepting unlimited contributions",
  "Candidates voluntarily accepting expenditure ceilings in exchange for ballot statement space",
  "Small Contributor Committees aggregating $200/yr donations from 100+ people",
];

const notAllowed = [
  "An individual giving more than $39,200 to a Governor candidate per election",
  "A PAC giving more than $9,800/year to another PAC that funds state candidates",
  "A state candidate transferring more than $5,900 to another state candidate's committee",
  "Coordinating spending between a candidate and an 'independent' expenditure committee",
  "Aggregating contributions from affiliated entities to bypass per-source limits",
  "Using legal defense funds for amounts beyond what is reasonably necessary",
];

export default function FAQ() {
  return (
    <div className="min-h-[80vh] terminal-grid">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="container pt-12 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary/20 bg-primary/5 text-primary font-mono text-xs tracking-wider">
          <BookOpen className="h-3.5 w-3.5" />
          FAQ // CAMPAIGN FINANCE RULES
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          What's Legal // 2026 CA Governor Race
        </h1>
        <p className="text-sm text-muted-foreground font-mono max-w-3xl">
          California limits how much money can flow to candidates for state office. Below are the rules that
          apply to the 2026 gubernatorial election, sourced from the{" "}
          <a
            href="https://www.fppc.ca.gov/learn/campaign-rules/state-contribution-limits-and-voluntary-expenditure-ceilings/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Fair Political Practices Commission
            <ExternalLink className="h-3 w-3" />
          </a>
          .
        </p>
      </section>

      {/* Quick reference cards */}
      <section className="container pb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-4 rounded-sm border-chart-5/30 bg-chart-5/5">
          <div className="flex items-center gap-2 mb-3">
            <Check className="h-4 w-4 text-chart-5" />
            <span className="font-mono text-xs tracking-widest text-chart-5">LEGALLY ALLOWED</span>
          </div>
          <ul className="space-y-2">
            {allowed.map((item) => (
              <li key={item} className="text-xs flex gap-2">
                <span className="text-chart-5 font-mono mt-0.5">+</span>
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 rounded-sm border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-2 mb-3">
            <X className="h-4 w-4 text-destructive" />
            <span className="font-mono text-xs tracking-widest text-destructive">NOT ALLOWED</span>
          </div>
          <ul className="space-y-2">
            {notAllowed.map((item) => (
              <li key={item} className="text-xs flex gap-2">
                <span className="text-destructive font-mono mt-0.5">−</span>
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Limits tables */}
      <section className="container pb-6 space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          2025-2026 CONTRIBUTION LIMITS — GOVERNOR
        </h2>
        <Card className="rounded-sm border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="font-mono text-[10px] tracking-widest text-muted-foreground">
                <th className="text-left px-4 py-2">CONTRIBUTOR</th>
                <th className="text-right px-4 py-2">LIMIT PER ELECTION</th>
              </tr>
            </thead>
            <tbody>
              {govLimits.map((row) => (
                <tr key={row.who} className="border-t border-border">
                  <td className="px-4 py-2.5">{row.who}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-primary">
                    {row.limit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <p className="text-[11px] text-muted-foreground font-mono">
          Primary, general, special, and special run-off elections are each treated as separate elections.
        </p>
      </section>

      <section className="container pb-6 space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          LIMITS TO OTHER COMMITTEES (PER CALENDAR YEAR)
        </h2>
        <Card className="rounded-sm border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="font-mono text-[10px] tracking-widest text-muted-foreground">
                <th className="text-left px-4 py-2">COMMITTEE</th>
                <th className="text-right px-4 py-2">LIMIT FROM ANY PERSON</th>
              </tr>
            </thead>
            <tbody>
              {otherCommittees.map((row) => (
                <tr key={row.who} className="border-t border-border">
                  <td className="px-4 py-2.5">{row.who}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-primary">
                    {row.limit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <p className="text-[11px] text-muted-foreground font-mono">
          *State PACs and parties may accept contributions over the limit only if they are NOT used for state
          candidate contributions.
        </p>
      </section>

      <section className="container pb-6 space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          VOLUNTARY EXPENDITURE CEILING — GOVERNOR
        </h2>
        <Card className="rounded-sm border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="font-mono text-[10px] tracking-widest text-muted-foreground">
                <th className="text-left px-4 py-2">ELECTION</th>
                <th className="text-right px-4 py-2">CEILING</th>
              </tr>
            </thead>
            <tbody>
              {govCeiling.map((row) => (
                <tr key={row.election} className="border-t border-border">
                  <td className="px-4 py-2.5">{row.election}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-primary">
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <p className="text-[11px] text-muted-foreground font-mono">
          Ceilings are voluntary. Candidates who accept get a 250-word statement in the ballot pamphlet.
        </p>
      </section>

      {/* FAQ Accordion */}
      <section className="container pb-16 space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <Card className="rounded-sm border-border px-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger className="text-sm text-left">
                How much can I personally give to a candidate for Governor?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Up to <span className="font-mono font-bold text-foreground">$39,200</span> per election. Since
                the primary and general are separate elections, an individual can give up to{" "}
                <span className="font-mono font-bold text-foreground">$78,400</span> total across the 2026 cycle.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2">
              <AccordionTrigger className="text-sm text-left">
                Are there any contributions with no limit?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Yes. Political parties can give unlimited amounts to candidates. Ballot measure committees, legal
                defense funds, and committees opposing a recall can also accept unlimited contributions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3">
              <AccordionTrigger className="text-sm text-left">
                What about Super PACs and outside spending?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Independent expenditure committees (Super PACs) can raise and spend unlimited money supporting or
                opposing candidates — as long as that spending is not coordinated with the candidate's campaign.
                See the{" "}
                <a href="/independent-expenditures" className="text-primary hover:underline">
                  Super PAC spending tracker
                </a>{" "}
                for current activity.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4">
              <AccordionTrigger className="text-sm text-left">
                Can a candidate transfer money to another candidate?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                A state candidate or officeholder may not contribute more than{" "}
                <span className="font-mono font-bold text-foreground">$5,900</span> per election to a committee
                controlled by another state candidate, including from personal or campaign funds.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q5">
              <AccordionTrigger className="text-sm text-left">
                What is the voluntary expenditure ceiling?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Candidates can voluntarily cap their own spending in exchange for a 250-word statement in the
                official ballot pamphlet. For Governor, the ceiling is{" "}
                <span className="font-mono font-bold text-foreground">$11.77M</span> for the primary and{" "}
                <span className="font-mono font-bold text-foreground">$19.61M</span> for the general.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q6">
              <AccordionTrigger className="text-sm text-left">
                What is a Small Contributor Committee?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                A committee that has existed for 6+ months, receives donations from 100+ people, accepts no more
                than $200/year from any single person, and contributes to 5+ candidates. SCCs can give the same
                $39,200 limit as individuals to gubernatorial candidates.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q7">
              <AccordionTrigger className="text-sm text-left">
                Are contributions from affiliated companies counted separately?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                No — contributions from affiliated entities are aggregated for the limit. You cannot bypass the
                cap by routing donations through subsidiaries or related LLCs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q8">
              <AccordionTrigger className="text-sm text-left">
                Where does this data come from?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                All limits are published by the California Fair Political Practices Commission (FPPC).
                Contribution data on this site is sourced from CAL-ACCESS filings (Forms 460, 461, and 496).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </section>
    </div>
  );
}
