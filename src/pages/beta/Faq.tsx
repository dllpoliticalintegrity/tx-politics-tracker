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
            Background reading · CA campaign-finance basics
          </div>
          <h1 className="page-hero__title">
            Frequently asked <em>questions</em>.
          </h1>
          <p className="page-hero__deck">
            California has its own contribution limits and disclosure rules &mdash; separate from federal races. This page covers the
            basics: <strong>what's allowed, what's required, and where this site's data comes from</strong>.
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
        <Q q="What's the most an individual can give to a CA gubernatorial candidate?">
          For the 2026 cycle: <strong>$36,400 per individual per election</strong> (primary and general count separately, so an
          individual can give up to $72,800 across both). The Fair Political Practices Commission (FPPC) updates these limits each
          cycle for inflation; the figures below reflect the 2025–26 schedule.
          <table className="limits-table">
            <thead>
              <tr>
                <th>From</th>
                <th>To Governor candidate</th>
                <th className="right">Per election</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Individual</td>
                <td>Candidate-controlled committee</td>
                <td className="right">$36,400</td>
              </tr>
              <tr>
                <td>Small contributor committee</td>
                <td>Candidate-controlled committee</td>
                <td className="right">$72,800</td>
              </tr>
              <tr>
                <td>Political party</td>
                <td>Candidate-controlled committee</td>
                <td className="right">unlimited</td>
              </tr>
              <tr>
                <td>Other PAC</td>
                <td>Candidate-controlled committee</td>
                <td className="right">$36,400</td>
              </tr>
              <tr>
                <td>Self-funding (loan or contribution)</td>
                <td>Own campaign</td>
                <td className="right">unlimited</td>
              </tr>
            </tbody>
          </table>
          <div className="callout">
            <strong>Independent expenditures</strong> &mdash; outside groups not coordinated with a campaign &mdash; have{" "}
            <strong>no contribution limit</strong> on what they raise or spend.
          </div>
        </Q>
        <Q q="Are contributions tax-deductible?">
          No. Political contributions to candidates, PACs, and IE committees are <strong>not deductible</strong> as charitable
          contributions on either federal or California state income tax.
        </Q>
      </Section>

      <Section id="disclosure" num="02" title="Disclosure & deadlines">
        <Q q="When do candidates have to file?">
          California candidate-controlled committees file <strong>semi-annual</strong> Form 460 reports (Jan 31 covering July–Dec,
          July 31 covering Jan–June), plus pre-election reports before primary and general elections, plus 24-hour reports for any
          contribution of <code>$1,000+</code> received within 90 days of an election.
        </Q>
        <Q q="What's reported about each donor?">
          For contributions of <strong>$100 or more</strong>, committees must disclose donor name, address, occupation, and
          employer. Below $100, only the cumulative total is reported (donor identity is not). Anonymous contributions over $100
          must be returned or escheated to the state.
        </Q>
        <Q q="How quickly does this site update after a filing?">
          CAL-ACCESS publishes filings within hours of submission; this site mirrors them on a <strong>nightly sync</strong>.
          Polling data refreshes from RealClearPolitics on the same cadence. Last sync time is shown in the status bar at the top
          of every page.
        </Q>
      </Section>

      <Section id="prohibited" num="03" title="Prohibited activity">
        <Q q="Who can't contribute?">
          Foreign nationals (with limited green-card exceptions). California state contractors during contract negotiation.
          Anonymous contributions over $100 (must be refunded). Cash contributions over $100 (must be refunded; California
          requires checks, cards, or wire transfers above that threshold).
        </Q>
        <Q q="Can a candidate use campaign funds for personal use?">
          No. California prohibits "personal use" of campaign funds, defined as expenses that exist irrespective of the campaign
          (mortgage, groceries, vacations). The FPPC publishes a detailed list at <code>fppc.ca.gov</code>.
        </Q>
      </Section>

      <Section id="ie" num="04" title="Independent expenditures">
        <Q q='What counts as an "independent expenditure"?'>
          Any payment for a communication that <strong>expressly advocates</strong> the election or defeat of a candidate &mdash;
          made <em>without</em> coordination with that candidate. TV ads, mailers, digital ads, and phone-banking all count. The
          committee paying must register with the FPPC and report each transaction.
        </Q>
        <Q q="Why are IE committees so much bigger than candidate committees?">
          Because contributions to IE committees are <strong>unlimited</strong>. A donor capped at $36,400 to a candidate's own
          committee can give millions to an IE committee that supports or opposes that same candidate &mdash; provided there's no
          coordination. This is the <em>Citizens United</em> regime; California adopted matching state-law guidance in 2010.
        </Q>
      </Section>

      <Section id="data" num="05" title="About this data">
        <Q q="Where do the numbers come from?">
          <strong>Campaign finance:</strong> direct mirrors of CAL-ACCESS filings (<code>RCPT_CD</code>, <code>EXP_CD</code>, IE
          rows). <strong>Polling:</strong> RealClearPolitics' aggregated horse-race polls plus the Wikipedia poll-aggregator page.{" "}
          <strong>Candidates:</strong> manually curated from official Secretary of State filings. Source attribution is shown on
          every section's footer.
        </Q>
        <Q q="How is the polling average computed?">
          We follow RealClearPolitics: a <strong>30-day trailing window</strong> of all public polls, averaged per-candidate,
          recomputed nightly. Polls past 30 days fall out; new polls drop in. We don't apply house-effect adjustments or recency
          weighting; the goal is a transparent, reproducible mean.
        </Q>
        <Q q="Why does the same donor appear on multiple candidates?">
          Donors can give to multiple campaigns, up to the per-candidate limit. The Top Donors page aggregates a single donor's
          contributions across all candidates and shows a per-candidate split underneath the row. The aggregation is name-normalized
          client-side from the <code>ca_top_donors</code> view.
        </Q>
      </Section>

      <Section id="contact" num="06" title="Corrections & contact">
        <Q q="I see a mistake. How do I report it?">
          Email <code>data@politicalintegrity.us</code>. Include the URL, what you expected, and what you saw. Most data issues
          trace back to CAL-ACCESS itself; if a candidate filed an amended report, it'll be picked up on the next nightly sync.
        </Q>
        <Q q="Can I download the raw data?">
          Yes. CSV exports are available on the Candidates and Top Donors pages. The full dataset is also queryable via our{" "}
          <code>/api</code> endpoint &mdash; docs at <code>api.politicalintegrity.us</code>. Source code for the polling
          aggregation lives in the public <code>ca-gov-polling</code> repo.
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
