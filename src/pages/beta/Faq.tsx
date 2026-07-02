import { BetaLayout } from "@/components/beta/BetaLayout";

export default function BetaFaq() {
  return (
    <BetaLayout active="faq">
      <main>
        <PageHero />
        <div className="faq-grid">
          <Toc />
          <FaqContent />
        </div>
      </main>
    </BetaLayout>
  );
}

function PageHero() {
  return (
    <section className="page-hero">
      <div className="page-hero__inner">
        <div className="page-hero__main" style={{ gridColumn: "1 / -1" }}>
          <div className="page-hero__kicker kicker">
            <span
              style={{
                width: 7,
                height: 7,
                background: "var(--green)",
                borderRadius: "50%",
                display: "inline-block",
                marginRight: 4,
              }}
            />
            Background reading · TX campaign-finance basics
          </div>
          <h1 className="page-hero__title">
            Frequently asked <em>questions</em>.
          </h1>
          <p className="page-hero__deck">
            Texas has its own disclosure rules &mdash; and, unlike most states, <strong>no contribution limits</strong> for
            statewide races. This page covers the basics: <strong>what's allowed, what's required, and where this site's data comes from</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}

function Toc() {
  return (
    <aside className="faq-toc">
      <div className="faq-toc__label">Contents</div>
      <ul className="faq-toc__list">
        <li>
          <a href="#limits">
            <span className="num">01</span>Contribution limits
          </a>
        </li>
        <li>
          <a href="#disclosure">
            <span className="num">02</span>Disclosure &amp; deadlines
          </a>
        </li>
        <li>
          <a href="#prohibited">
            <span className="num">03</span>Prohibited activity
          </a>
        </li>
        <li>
          <a href="#ie">
            <span className="num">04</span>Independent expenditures
          </a>
        </li>
        <li>
          <a href="#data">
            <span className="num">05</span>About this data
          </a>
        </li>
        <li>
          <a href="#contact">
            <span className="num">06</span>Corrections
          </a>
        </li>
      </ul>
    </aside>
  );
}

function FaqContent() {
  return (
    <main>
      <Section id="limits" num="01" title="Contribution limits">
        <Q q="What's the most an individual can give to a TX gubernatorial candidate?">
          There is <strong>no limit</strong>. Texas places no cap on what an individual or a PAC may give to a candidate for
          non-judicial office &mdash; seven-figure single checks are routine in governor's races. What Texas regulates instead is{" "}
          <em>who</em> may give and <em>how it's disclosed</em>.
          <table className="limits-table">
            <thead>
              <tr>
                <th>From</th>
                <th>To Governor candidate</th>
                <th className="right">Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Individual</td>
                <td>Candidate / specific-purpose committee</td>
                <td className="right">unlimited</td>
              </tr>
              <tr>
                <td>PAC (general-purpose committee)</td>
                <td>Candidate / specific-purpose committee</td>
                <td className="right">unlimited</td>
              </tr>
              <tr>
                <td>Political party</td>
                <td>Candidate / specific-purpose committee</td>
                <td className="right">unlimited</td>
              </tr>
              <tr>
                <td>Corporation or labor union</td>
                <td>Candidate / specific-purpose committee</td>
                <td className="right">prohibited</td>
              </tr>
              <tr>
                <td>Self-funding (loan or contribution)</td>
                <td>Own campaign</td>
                <td className="right">unlimited</td>
              </tr>
            </tbody>
          </table>
          <div className="callout">
            <strong>Corporations and unions can't give to candidates</strong>, but they can make unlimited{" "}
            <strong>direct campaign expenditures</strong> (Texas's independent-expenditure analog) and fund the PACs that make
            them.
          </div>
        </Q>
        <Q q="Are contributions tax-deductible?">
          No. Political contributions to candidates, PACs, and IE committees are <strong>not deductible</strong> as charitable
          contributions on federal income tax (Texas has no state income tax).
        </Q>
      </Section>

      <Section id="disclosure" num="02" title="Disclosure & deadlines">
        <Q q="When do candidates have to file?">
          Texas candidates and their committees file <strong>semiannual</strong> reports with the Texas Ethics Commission
          (Jan 15 covering July–Dec, July 15 covering Jan–June), plus <strong>30-day and 8-day pre-election reports</strong>{" "}
          before each election they're on the ballot for, plus <strong>daily reports</strong> of large late contributions in the
          final days before an election.
        </Q>
        <Q q="What's reported about each donor?">
          Contributions over the itemization threshold (<strong>$100 in a reporting period</strong>) must list the donor's name,
          address, and &mdash; for larger donors &mdash; occupation and employer. Smaller gifts are reported only as an unitemized
          total. This site shows itemized rows plus each filing's unitemized line.
        </Q>
        <Q q="How quickly does this site update after a filing?">
          The Texas Ethics Commission refreshes its public bulk data <strong>daily</strong>; this site mirrors it on the same
          cadence. Polling data refreshes nightly from 270toWin. Last sync time is shown in the status bar at the top of every
          page.
        </Q>
      </Section>

      <Section id="prohibited" num="03" title="Prohibited activity">
        <Q q="Who can't contribute?">
          Corporations and labor unions (to candidates &mdash; they may fund PACs' direct campaign expenditures instead). Foreign
          nationals. Contributions in another person's name. Cash contributions over <strong>$100 in aggregate</strong> per
          reporting period. Contributions inside the Capitol, and &mdash; for legislators and statewide officeholders &mdash;
          during the legislative-session moratorium.
        </Q>
        <Q q="Can a candidate use campaign funds for personal use?">
          No. Texas prohibits converting political contributions to "personal use" &mdash; expenses that would exist irrespective
          of the campaign or officeholder duties. The Texas Ethics Commission publishes detailed guidance at{" "}
          <code>ethics.state.tx.us</code>.
        </Q>
      </Section>

      <Section id="ie" num="04" title="Independent expenditures">
        <Q q='What counts as an "independent expenditure"?'>
          Texas law calls it a <strong>direct campaign expenditure</strong> (DCE): spending that benefits a candidate,
          made <em>without</em> the candidate's prior consent or approval. TV ads, mailers, digital ads, and phone-banking all
          count. The spender reports each transaction to the Texas Ethics Commission, naming the candidate benefited &mdash;
          that's the per-candidate IE data this site shows.
        </Q>
        <Q q="Why are IE committees so much bigger than candidate committees?">
          In Texas the draw isn't donor limits (there are none for candidates) &mdash; it's the <strong>corporate-money
          rule</strong>. Corporations and unions can't give to candidates, but they can bankroll committees that make direct
          campaign expenditures. This is the <em>Citizens United</em> regime as applied to Texas's corporate-contribution ban.
        </Q>
      </Section>

      <Section id="data" num="05" title="About this data">
        <Q q="Where do the numbers come from?">
          <strong>Campaign finance:</strong> direct mirrors of the Texas Ethics Commission's daily bulk CSV export
          (contributions, expenditures, cover-sheet totals, direct-campaign-expenditure rows). <strong>Polling:</strong>{" "}
          270toWin's aggregated horse-race polls. <strong>Candidates:</strong> manually curated from TEC filings. Source
          attribution is shown on every section's footer.
        </Q>
        <Q q="How is the polling average computed?">
          A <strong>60-day trailing window</strong> of all public polls, averaged per-candidate, recomputed nightly. Older polls
          fall out; new polls drop in. We don't apply house-effect adjustments or recency weighting; the goal is a transparent,
          reproducible mean.
        </Q>
        <Q q="Why does the same donor appear on multiple candidates?">
          Donors can give to multiple campaigns. The Top Donors page aggregates a single donor's contributions across all
          candidates and shows a per-candidate split underneath the row. The aggregation is name-normalized client-side from the{" "}
          <code>tx_top_donors</code> view.
        </Q>
      </Section>

      <Section id="contact" num="06" title="Corrections & contact">
        <Q q="I see a mistake. How do I report it?">
          Email <code>data@politicalintegrity.us</code>. Include the URL, what you expected, and what you saw. Most data issues
          trace back to the TEC filings themselves; if a candidate filed a corrected report, it'll be picked up on the next daily
          sync.
        </Q>
        <Q q="Can I download the raw data?">
          Yes. CSV exports are available on the Candidates and Top Donors pages. The raw source is the Texas Ethics Commission's
          own bulk download at <code>ethics.state.tx.us</code>. Source code for this site lives in the{" "}
          <code>tx-politics-tracker</code> repo.
        </Q>
      </Section>
    </main>
  );
}

function Section({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="faq-section" id={id}>
      <div className="faq-section__num">§ {num}</div>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Q({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="faq-q">
      <h3 className="faq-q__q">{q}</h3>
      <p className="faq-q__a">{children}</p>
    </div>
  );
}
