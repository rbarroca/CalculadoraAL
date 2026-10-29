---
name: seo-health-monitoring
description: >
  Set up and run an ongoing SEO monitoring routine: what to check weekly, monthly and after
  changes, which movements are real alerts versus normal noise, how to calibrate thresholds to a
  site's own history, how to write a short health report, and which diagnostic skill to escalate
  to. Use for "set up SEO monitoring," "what should I check each week," "write my monthly SEO
  report," "how do I know if something's wrong," "set up alerts." Not for root-cause diagnosis
  (traffic-drop-diagnosis) or a one-off audit (site-audit-orchestrator).
---

# SEO Health Monitoring

A small, repeatable routine that notices real problems early without reacting to noise. Clicks are the primary metric; everything else supports or explains it. Alerts trigger diagnosis and an owner decision, never automatic site changes. This skill is the single owner of emergency and alert detection in this pack; other skills point here for tiers and thresholds.

---

## Step 0 — Ask before assuming

1. What data exists: Search Console, Bing Webmaster Tools, analytics, server logs, an MCP connection, CSV exports?
2. How often will this run, and by whom (human, agent, scheduler)? Who reads the report?
3. Which page groups (by template/type) are critical, and roughly how many search clicks per day?
4. Is there a change ledger (`measurement-discipline`, `change-and-decision-log`)?
5. Growth stage: run `seo-growth-stage-strategy` if unknown. Early or small sites need only the minimal routine; mature sites add segments and event checks.
6. Can the owner read the Search Console Page indexing report (or supply its counts)? Nothing in this skill can pull those counts automatically (see Step 3 item 3).

Search Console and Bing Webmaster Tools are free, need ownership verification, and are worth connecting. The skill still runs without them at reduced precision (analytics, spot-checks); say so, never block. Use an MCP connection or API if present, else CSV exports, else give the human the exact screens to read and a template for pasting results.

**If none of this can be answered:** propose a minimal default: a weekly check of about 10 minutes (Step 3), a monthly review (Step 6), and event checks after deploys. Assume clicks are the only trend metric, segments are "whole site," the homepage and one top template, and the reader is a human. Label thresholds as defaults; mark inferred versus confirmed.

---

## Defaults

Every number below that Google does not state is a **practitioner estimate (PROPOSED)**, not a Google figure. Calibrate before relying on it (Step 4).

| id | value | unit | basis | calibrate on |
|---|---|---|---|---|
| H-CRIT-DROP | more than 50% | clicks vs same-weekday baseline | PROPOSED (carried over) | the segment's own 8-12 weeks of same-weekday changes |
| H-CRIT-DAYS | 3 | consecutive complete days | PROPOSED (carried over) | same |
| H-WARN-DROP-A | 25% or more | clicks vs same-weekday baseline | PROPOSED | same |
| H-WARN-DAYS-A | 5 | consecutive complete days | PROPOSED | same |
| H-WARN-DROP-B | 50% or more | clicks vs same-weekday baseline | PROPOSED | same |
| H-WARN-DAYS-B | 2 | consecutive complete days | PROPOSED | same |
| H-MIN-BASELINE | 100 | clicks in the prior 28 days, per segment | PROPOSED | the site's smallest segment that still shows real trends |
| H-NOALERT-FLOOR | 30 | clicks in the prior 28 days, per segment, below which the segment raises no alert | PROPOSED | the smallest segment worth watching |
| H-KEY-SHARE | 10% | share of site clicks, 28 days, for a "key template" | PROPOSED | the site's template mix |
| H-MOST-LOSS | 60% | share of a page's clicks lost over 14 days vs the prior 14 | PROPOSED | the site's page-level volatility |
| H-SEG-DROP | 30% or more | one segment's click fall, 7-day total versus the prior 7 (same weekdays), while others are flat (Warning) | PROPOSED (carried over) | segment-level variation |
| H-SEG-DAYS | 7 | days in the window for the segment-drop rule (a single day never qualifies) | PROPOSED | how noisy the smallest key segment is |
| H-TOP-N | 10 | pages, by clicks, watched for losing most of their clicks | PROPOSED | site size |
| H-VANISH | top 20 | pages, by clicks, checked weekly for vanishing | PROPOSED | site size |
| H-SPOT | 3-5 | key pages spot-checked weekly | PROPOSED | number of key templates |
| H-TIME | about 10 minutes weekly (30 the first time); 30-60 minutes monthly | owner time budget | PROPOSED | how much is exported or automated |
| H-INDEX-DROP | more than 30% | fall in indexed count in a week | PROPOSED (carried over) | the site's own indexed-count history |
| H-CLOSE-DAYS | 7 | consecutive complete days back within the guard to close an alert | PROPOSED | how long the site's real incidents take to settle |
| H-ALERT-CAP | 1 | alert message per site per day | PROPOSED | owner tolerance |
| H-CAL-WEEKS | 8-12 | weeks of history for calibration | PROPOSED (carried over) | available history |
| H-CAL-PCT | 90th percentile | of absolute same-weekday changes, for Warning; Critical at about twice | PROPOSED (carried over) | the site's own distribution |
| H-ACTIONS | 3-5 | monthly actions at most | PROPOSED (carried over) | owner capacity |
| H-LAG | 2-3 | days of Search Console lag before judging a day | Google-documented (see Facts checked) | n/a |

---

## Step 1 — Define "healthy"

- Primary metric: clicks from search, per engine (Google and Bing separately).
- Secondary signals, fixed and few: the Step 3 items.
- Segment by page template or group (and branded versus non-branded if available) so one failing template is not hidden in a flat total.
- Record a baseline: weekday and weekend clicks, 28-day total, and the indexed count when the owner can supply it.
- **Key templates:** page families holding at least H-KEY-SHARE of site clicks over 28 days. Everything else is a minor segment.

## Step 2 — Cadence

- **Weekly (about 10 minutes when data is exported; 30 minutes the first time, `H-TIME`):** Step 3.
- **Monthly (`H-TIME`):** Step 6, 28 days versus the prior 28.
- **Event-driven:** after any deploy, template, redirect, robots or sitemap change, or confirmed Google update, check the affected group around days 2, 7 and 14.
- Too heavy to run? Cut signals, not cadence. Do not react to a single day; evaluate the series daily only if automated, otherwise at the weekly check on the last 7 complete days.

## Step 3 — Weekly checklist

1. **Known issues and data anomalies:** read Search Console's "Data anomalies" help page and Google's Search Status Dashboard. Google records anomalies with dates, metrics and reports. Examples on the page as read on 2026-10-05:
   - A logging error that, in Google's words, "prevented Search Console from accurately reporting impressions" from 13 May 2025 until 27 Apr 2026. Impressions, and so CTR and average position, were affected; clicks were not. Google said impressions may now read lower. Do not call this an "over-count"; Google does not.
   - Discover logging errors affecting clicks and impressions (7-8 May, 21 May, 24 Jun, 13 Aug 2026).
   - Generative AI in Search report impressions down 13-17 Aug 2026 (restored per Google's 21 Aug note).
   - Job listing and Job details data not reported 16-27 Apr 2026.
   - 28 Feb and 1 Mar 2026 missing from Bulk data exports and "won't be recovered."
   - FAQ rich results no longer appearing from 7 May 2026 (a real change, not a logging error).

   Read the live entry before trusting or discounting any figure. The page keeps only recent months, so **log any anomaly you notice** (date, metric, report) in the change ledger when you see it; it may be gone later.
2. **Clicks:** last full 7 days versus the prior 7 and versus the same weekdays 4 weeks back, by segment. Allow H-LAG (2-3 days) before judging a day, and never judge days drawn as preliminary (dotted line); the newest data can be preliminary and may change within hours. The Search Console API returns finalized data by default; fresh data requested explicitly may be incomplete.
3. **Indexing:** indexed and not-indexed counts versus last week; new error or exclusion reasons. **There is no public API for the Page indexing report's counts, and the Sitemaps API's per-sitemap "indexed" field is deprecated** (the Sitemaps API still gives submitted counts, errors and warnings). Read counts from the Search Console UI or have the owner supply them. If neither is possible, write "indexing: not checked" and do not estimate. URL Inspection checks single URLs only and is quota-limited, so do not use it to rebuild site-wide counts. Example URL lists are capped (about 1,000 URLs in the UI); trust counts and trends.
4. **Crawl/server errors:** 5xx, 404 spikes, redirect errors, blocked resources (Crawl stats report, server logs).
5. **Sitemaps:** processed without errors.
6. **Messages:** Search Console Messages, Manual actions and Security issues reports, and Bing's equivalents. Email is not a sufficient check alone.
7. **Top pages and queries:** biggest gainers and losers; any top-`H-VANISH` page that vanished. Anonymized queries are omitted from rows, UI tables are capped at 1,000 rows and the API returns roughly the top 50,000 rows per day per search type, so rows will not sum to totals.
8. **Spot-check `H-SPOT` key pages:** status 200, indexable, canonical correct, content renders.
9. **Impressions versus clicks divergence:** when a segment meets a Warning or Critical click condition (Step 4), compare its impressions over the same window. Clicks down while impressions are flat or higher points to a SERP or snippet change (see `ctr-snippet-optimization`); clicks and impressions down together points to visibility or indexing loss (see `traffic-drop-diagnosis`). Impressions are supporting evidence only and never raise or lower a tier by themselves.
10. **Cross-reference** movements with the ledger and deploys first.

## Step 4 — Alerts and noise

Impressions, CTR and average position are never alert triggers on their own; they can support a clicks- or indexing-based finding but are skewed by reporting errors (Step 3 item 1) and SERP changes.

**Thresholds in this skill are practitioner starting defaults (Defaults table), not Google figures.** Calibrate: take H-CAL-WEEKS of same-weekday week-over-week click changes per segment (more if available; Search Console keeps about 16 months of data per Google's debugging guide, checked 2026-10-05, so check current retention and export to preserve history). Set Warning near the edge of normal variation (H-CAL-PCT) and Critical at about twice that. Re-calibrate quarterly and after traffic-level changes.

**Drops are measured per segment, on complete days, against the same weekday in the prior period.** A drop pattern lands in exactly one tier: evaluate Critical first, then Warning, then Info; the highest matching tier wins.

- **Critical (diagnose now, notify owner):**
  - site or key templates unreachable or erroring;
  - robots.txt or noindex blocking key pages;
  - manual action or security issue;
  - indexed count down by more than H-INDEX-DROP in a week (only when the count was read or supplied; otherwise not checked);
  - clicks down more than H-CRIT-DROP for H-CRIT-DAYS or more consecutive complete days with no seasonal explanation. Duration alone qualifies; a second signal is not required (it only helps classify broad versus narrow, see below).
- **Warning (investigate this week):**
  - clicks down H-WARN-DROP-A or more for H-WARN-DAYS-A consecutive complete days; **or** down H-WARN-DROP-B or more for H-WARN-DAYS-B consecutive complete days (so a 40% fall for 5 days, and a 60% fall for 2 days, are both Warning; 60% for 3 days is Critical);
  - one segment down H-SEG-DROP or more on a 7-day total (H-SEG-DAYS) versus the prior 7 (same weekdays) while others are flat; a new indexing error type or growing not-indexed count; sitemap errors;
  - a top-`H-TOP-N` page (by clicks) losing most of its clicks (H-MOST-LOSS over 14 days versus the prior 14);
  - any Critical click pattern in a thin segment (baseline under H-MIN-BASELINE but at least H-NOALERT-FLOOR), capped at Warning and written in counts, not percentages (see the minimum-traffic guard).
- **Info (log only):** drops smaller or shorter than the Warning patterns above, single-day swings (a single-day dip is never an alert beyond Info), weekend dips, flat-net page moves, impression or position drift, gains. Falls of 25-50% lasting 2-4 days are Info; re-check daily and escalate if they reach 5 days.

**Second signal.** Used only to classify a movement as broad or narrow and to decide how urgent the diagnosis is, never to qualify a sustained drop for a tier: an independent indicator from a different metric or source than the clicks series itself. Count any of: Bing clicks down for the same segment and days; an indexed-count fall or new error type; new crawl or server errors; a deploy or change-ledger entry at the onset; a Search Console message; a Search Status Dashboard or anomaly-page entry overlapping the days. Another Google click series from the same Search Console property does not count.

Noise rules, applied before alerting:
- Same weekday to same weekday.
- Search Console daily data uses Pacific time (America/Los_Angeles), so it will not line up with analytics set to another zone.
- Minimum-traffic guard: a segment below H-NOALERT-FLOOR clicks in the prior 28 days raises no alert (log it and watch the longer window). A thin segment, with fewer than H-MIN-BASELINE but at least H-NOALERT-FLOOR clicks, cannot raise a Critical alert: a Critical pattern is capped at Warning, stated in counts ("down 18 clicks, from 64 to 46") and never as a percentage fall, and judged on a longer window.
- Seasonality: compare with the same period last year where history exists.
- One day is never a trend: tiers are set by duration (`H-CRIT-DAYS`, `H-WARN-DAYS-A`, `H-WARN-DAYS-B`, `H-SEG-DAYS`), and a single-day dip stays Info. A second signal is needed only for the broad-versus-narrow call below.
- Broad movement (many unrelated pages, same time, ideally with a second signal) suggests technical or external cause; narrow suggests page-level. State which; with no second signal, say the classification is unconfirmed.
- More than a couple of alerts a month: thresholds are too tight.

**Alert open and close rules.**
- Open when a tier condition is first met; record segment, tier, first complete day and evidence. A higher tier raises the open alert rather than opening a second one.
- Close only after H-CLOSE-DAYS consecutive complete days back within the guard (no Warning or Critical pattern matching), and record the close date and what was concluded.
- Send at most H-ALERT-CAP alert message per site per day: combine all new or changed alerts into one message; unchanged open alerts appear in the weekly report, not as new messages.

## Step 5 — Escalation

| Signal | Route to |
|---|---|
| Sustained clicks decline, cause unknown | `traffic-drop-diagnosis` |
| Indexed count falling, rising not-indexed, crawl or sitemap problems | `indexing-crawl-health-audit` |
| Template-level canonical, robots or structured-data faults | `technical-seo-audit` |
| Drop after migration, domain, URL or platform change | `site-migration-safety` |
| Stable position, clicks falling | `ctr-snippet-optimization` |
| Slow decay on aging pages | `content-freshness-audit` |
| Link-related manual action | `backlink-profile-audit` |

Before escalating, check the ledger and known issues. Make no page edits, rollbacks or removals in response to an alert until the cause is classified and the owner has decided. While a Critical or Warning alert is open, hold new suggestions to edit pages or add pages (titles, descriptions, content, internal links, new pages) until it closes, so edits do not blur the diagnosis; checks and fixes to the alerted page itself carry on.

## Step 6 — Monthly review

1. **What changed:** deploys, content batches, known Google updates.
2. **What moved:** 28-day clicks versus prior 28 by segment; gainers and losers; indexed trend where counts exist.
3. **Ledger check:** measure changes whose window (`measurement-discipline`) has closed; record results.
4. **Decisions:** at most H-ACTIONS actions, each with owner, expected effect, re-check date; log per `change-and-decision-log`.

## Step 7 — Report rules and automation

- Lead with a one-line verdict (Healthy / Watch / Problem) and the single recommended next action.
- Show date ranges and an as-of date; note excluded days. Mark claims confirmed or inferred; name data gaps (including "indexing: not checked").
- Only Step 1 signals; no vanity metrics; weekly report fits one screen.
- Agent can automate: data pulls, same-weekday comparisons, threshold checks, spot-check fetches, drafting. A human must: verify ownership, read Messages if not exposed to the agent, read Page indexing counts if no export is supplied, decide and make any site change.
- Verify time-sensitive facts (latency, retention, notification behavior, anomaly entries) against current Search Console Help. Analytics sessions are not search clicks (consent, tagging, time zone, bots differ). AI Overview and AI Mode clicks are included in Search Console's Web totals; there is also a separate Generative AI performance report (impressions only; see Facts checked).

## Step 8 — What not to do

- React to daily data, or to impressions, CTR or position alone.
- Treat one day or an unfinished period as a trend.
- Change several things in an open measurement window.
- Auto-revert, auto-redirect or auto-edit because an alert fired.
- Report everything, or send more than one alert message per site per day.
- Estimate indexed counts you could not read; write "not checked."

---

## Facts checked against Google documentation on 2026-10-05

Time-sensitive items are marked (T); re-verify before relying on them.

- Daily data follows Pacific time (America/Los_Angeles). Verified.
- Normal lag 2-3 days; newest data can be preliminary. Verified (T).
- UI tables show at most 1,000 rows; the API returns at most about 50,000 rows per day per search type, ranked, so the long tail is missing. Verified (T).
- Rare (anonymized) queries are omitted from tables, so rows will not sum to chart totals. Verified.
- Sitemaps API "indexed" field is deprecated; no report-level Page indexing API found (inferred from the API reference listing only, not stated by Google). Verified/inferred (T).
- Data anomalies entries above, read 2026-10-05 (T); the page keeps only recent entries.
- AI Overview and AI Mode traffic counts in the Web search type. Verified. A Generative AI performance report (impressions only, rolled out to all sites by 31 Aug 2026 per Google) exists; its API availability is not documented (T).
- Retention of Search Console performance data: Google's debugging guide uses a "Last 16 months" date range and describes exporting to keep more; treat about 16 months as the working limit and re-check current retention (T).

---

## Output shape

**Weekly health check:** as-of date and data range, verdict, one next action, then one line per Step 3 signal (OK / Warning / Critical / not checked, plus evidence). List open and newly closed alerts. End with what is inferred rather than confirmed.

**Monthly report:** 1) Verdict and top action. 2) Clicks by segment, current versus prior 28 days, with dates. 3) Indexing and technical status (or "not checked"). 4) Changes and ledger results. 5) Alerts opened, closed and anomalies logged. 6) Decisions and plan with re-check dates. 7) Data caveats and what was not checked.
