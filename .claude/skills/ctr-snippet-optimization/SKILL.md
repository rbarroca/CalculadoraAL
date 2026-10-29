---
name: ctr-snippet-optimization
description: >
  Improve click-through on pages that already rank, via titles, meta descriptions and
  snippet-level elements, safely and measurably. Use when a user says "my CTR is low," "improve
  my titles/meta descriptions," "pages at positions 3-15 get few clicks," "Google rewrote my
  title," or "A/B test titles." Not for pages that don't rank or aren't indexed (use
  content-opportunity-discovery / indexing-crawl-health-audit), traffic drops
  (traffic-drop-diagnosis), or length/uniqueness checks (technical-seo-audit).
---

# CTR and Snippet Optimization

Finds pages that rank but under-earn clicks versus the site's own norm, diagnoses why, rewrites truthfully, and measures on clicks. Title changes can change how a page appears in results and may affect performance: in bulk or untested they can backfire, so test before bulk edits.

**Evidence rule:** impressions, CTR and position are supporting evidence only; clicks are the headline; for days in the affected window (Google's impressions logging error, 13 May 2025 to 27 Apr 2026) impressions, CTR and position are inaccurate; clicks were not affected.

---

## Step 0 — Ask before assuming

1. Is Search Console (or Bing Webmaster Tools) data available via MCP, API or CSV export (page + query, last 3+ months)?
2. Are the pages templated (one title pattern across many) or unique?
3. Any title/description change on these pages in the last 6 weeks (T-CTR-WINDOW)? (Open window: do not stack.)
4. Any brand-placement rule?
5. Success target: clicks on a page set, or one query?
6. Gate: run `seo-growth-stage-strategy` first; a site with very few impressions lacks the data for this work (prefer content/indexing work).

Search Console and Bing Webmaster Tools are free, need ownership verification, and are worth connecting. This skill still runs without them at reduced precision. Never block on it. No MCP connection: ask for a CSV export.

**If none of this can be answered:** work from observable data. Read live titles, descriptions, H1s and openings; search the target queries and note what is displayed; identify templates from URL patterns. Without click data you cannot rank by lost clicks or prove a lift: state "candidates inferred from on-page and SERP review, not confirmed by performance data" and give a measurement plan for when data exists.

---

## Defaults

Every number below that is not from Google is PROPOSED: a practitioner starting default, to be calibrated on the site's own data. None is a Google figure.

| id | value | unit | basis | calibrate on |
|---|---|---|---|---|
| T-CTR-GAP | CTR below 50% of the site's own median for the position band | ratio of median | PROPOSED; may change after testing. Start at 50% of median; if fewer than 5 candidates result, loosen to 70% | the site's own CTR curve, clean days only |
| T-CTR-BUCKETS | 1, 2-3, 4-5, 6-10, 11-20 | average-position buckets for the site's own CTR curve | PROPOSED | the site's impression distribution |
| T-CTR-NOEDIT-POS | 1-3 | positions where titles are not edited without a documented diagnosis | PROPOSED | the site's own CTR curve |
| T-CTR-PILOT | 5 | comparable pages in a first pilot batch, picked at random (or half of a worst-first list, the other half left as the control) | PROPOSED. A pilot this small cannot be called keep or revert: in a simulation (not field data) 4 changed pages against 100 untouched pages gave "too little data" in 97% to 100% of runs | team capacity and how comparable the pages are |
| T-CTR-BASELINE | 28 | days of clicks recorded as the pre-change baseline | PROPOSED | the site's reporting lag |
| T-CTR-GAP-IMPR | 200 | impressions (in the band, in the window) | PROPOSED | the site's impression distribution |
| T-CTR-BAND | roughly 3-15 | average position | PROPOSED (practitioner estimate, existing pack default) | the site's own distribution |
| T-CTR-STABLE | standard deviation of daily average position under 2 places | positions | PROPOSED | the site's own daily position series |
| T-CTR-DATA | 28 days minimum, ideally 90 | days of data | PROPOSED | data available |
| T-CTR-SETTLE | 14 | days to wait after a change before the "after" window starts, unless dated evidence shows Google recrawled the page | PROPOSED (Google: a recrawl takes a few days to a few weeks) | the site's own recrawl delay |
| T-CTR-MEASURE | 4 | whole weeks in each of the "before" and "after" windows for a title or description change | PROPOSED | the site's weekly click volume |
| T-CTR-WINDOW | 6 | weeks a page stays locked after a title or description change (the wait plus the 4-week "after" window, 42 days). A content or internal-link change needs 6 weeks of "after" data once the wait ends (56 days) | PROPOSED (not a Google rule) | the site's crawl and reporting lag |
| T-CTR-CONTROL-EXTRA | 5 | untouched comparison pages beyond the number of pages changed | PROPOSED | how many similar pages the site has |
| T-CTR-CLEAN-START | days after 27 April 2026 | date | Google-documented (Search Console "Data anomalies": impressions logging error 13 May 2025 to 27 Apr 2026) | n/a |
| T-CTR-RECRAWL | a few days to a few weeks | time | Google-documented (title link documentation, last verified 2026-10-05) | n/a |

Referenced, not defined here: T-NEARMISS (the near-miss position band, owned by `content-opportunity-discovery`).

---

## Step 1 — Find candidates from the site's own data

1. Pull page and page+query clicks, impressions, CTR, position: T-CTR-DATA. Split desktop/mobile.
2. Merge URL variants (trailing slash, parameters, www) first; split impressions mislead.
3. Bucket by position (T-CTR-BUCKETS). Compute the site's OWN median CTR per bucket, **using only days after 27 April 2026** (T-CTR-CLEAN-START): impressions, CTR and position on earlier days were affected by Google's logging error, so a curve built from them is unreliable. Do not import external CTR-by-position tables (published studies disagree widely by method). If there are too few clean days to build a curve, say so and mark every CTR gap as unreliable (inside the affected window).
4. Candidate = position within T-CTR-BAND; impressions at least T-CTR-GAP-IMPR in the band; CTR below T-CTR-GAP; stable position (T-CTR-STABLE: a wandering average position blends results and makes CTR meaningless).
5. **Tie-break with `content-opportunity-discovery` (positions about 8 to 15):** a query-page pair is a CTR item if a matching, non-thin page exists with stable position and below-median CTR; otherwise it is an opportunity item (no page matches the intent, the page is thin, or its position or CTR does not fit the CTR conditions). Never both. A page's own CTR gap stays in the CTR item; do not count it again as a position gain in the opportunity item. If the page does not match the intent or is thin, hand the pair to `content-opportunity-discovery` and do not rewrite its title.
6. Exclude: branded queries; queries labelled "likely affected" in Step 2b; intent mismatch or thin page (hand off to `content-opportunity-discovery`); indexing/canonical problems (hand off to `indexing-crawl-health-audit`); queries with a recent unexplained position drop (`traffic-drop-diagnosis`).
7. Rank by estimated lost clicks = impressions x (bucket median CTR - page CTR). Treat it as an estimate: it rests on impressions and CTR (supporting evidence only). Cross-check against actual clicks.
8. Google documents a logging error (13 May 2025 to 27 Apr 2026) that made impressions, and so CTR and average position, inaccurate; clicks were not affected. Google said impressions may now read lower. Check "Data anomalies in Search Console" for your window and for newer entries. Anonymized queries are omitted from query rows, so rows may not sum to totals; Search Console UI tables show at most 1,000 rows (use the API for more).

## Step 2 — Look at the live result

For each candidate's top queries, check the live results (desktop and mobile, signed-out, right country/language). Record: the title and description Google actually displays (may differ from your tags and vary by query), competitors' framing, and any AI summary, answer box, rich result or sitelinks. Google documents that title links are generated automatically from several sources (title element, main visual title, headings such as the h1, og:title, other prominent text, anchor text and text in links pointing to the page, WebSite structured data), and that snippets are primarily created from page content, sometimes from the meta description when it describes the page better, varying by query. Last verified: 2026-10-05.

## Step 2b — Triage AI-answer exposure (labels, not a verdict)

You cannot see AI Overview or AI Mode exposure per query in Search Console: that traffic is inside the normal Web totals (Google documents no filter for it that we could find), and a link click there is an ordinary click. Search Console's Generative AI performance report (Google says fully rolled out 31 Aug 2026; last verified 2026-10-05) shows impressions only, no clicks; do not treat it as a CTR source. So label each candidate query from observable signals only:

- **Likely affected:** narrow, long or question-style query, impressions stable or rising, CTR falling, and the live results show an AI summary or answer box.
- **Unclear:** some of those signals but not all, or the live check was not possible.
- **Unaffected:** short or navigational query, or no AI summary or answer box on the live result, and CTR in line with the site's curve.

These are inferred labels, not proof of cause. Never claim clicks were "lost to AI". For queries labelled likely affected: do not recommend title rewrites; put them on a watch list and judge only on clicks. For unclear: allow at most a low-risk pilot, flagged as inferred.

## Step 3 — Diagnose why clicks are low

Check in order:
- **Rewritten display:** Google replaced your title. Fix the cause (title contradicts H1/body, boilerplate, obsolete year/figure, half-empty title, several equally prominent headings) rather than polishing the tag. Google must recrawl for changes to show (T-CTR-RECRAWL).
- **Answer absorbed:** the result itself answers the query, or the query is labelled likely affected (Step 2b). Rewriting rarely helps; watch list.
- **Intent/relevance:** title does not match what the top queries ask.
- **Specificity:** generic wording; no concrete differentiator.
- **Truncation:** key term or value cut off. Google documents no title or description length limit and says shortening is typically to fit the device width. Any figure (for example a ~60-character rule of thumb) is a practitioner heuristic, not a Google rule: judge by the rendered live result on desktop and mobile.
- **Brand placement:** brand crowding out the topic.
- **Staleness/duplicates:** obsolete year or figure; near-identical titles competing for one query (`duplicate-intent-audit`).
- **Snippet controls:** nosnippet/max-snippet/data-nosnippet can cut the description; confirm intended.

## Step 4 — Write replacements

- Many practitioners keep the primary query term near the front so it survives shortening; Google does not say this. Keep it there unless Step 3 shows it is the problem. Do not broaden into generic wording: more impressions with worse position is a regression.
- Lead with a specific value proposition the body delivers (figure, scope, audience, format). Brand short, at one end after a delimiter. No keyword lists, clickbait or unsupported superlatives.
- Every title and description must pass `protected-field-audit`: each figure, claim, year and superlative checked against the body (use `verify-primary-source` for the value). Add a year only if the content truly reflects it.
- The meta description is a snippet candidate: Google's documentation describes it only as a source for the snippet, used when it describes the page better than the page text. Make it unique and matched to the query; Google may substitute page text. Length/uniqueness checks live in `technical-seo-audit`.
- Give 2-3 variants with reasoning; recommend one. Templated pages: change the pattern once, pilot on a small subset. Unique pages: one-off edits.
- An accuracy correction replaces only the wrong token; do not fold wording, length or brand changes into it.

## Step 5 — Gate, cap, baseline, control

Route every change through `measurement-discipline`. Do not edit pages ranking in T-CTR-NOEDIT-POS or earning steady clicks without a documented diagnosis and user approval. Never rewrite many titles at once: pilot T-CTR-PILOT comparable pages (pick at random, or take half of a worst-first list and leave the other half untouched as the control); ask before any larger rollout. Choosing the lowest-impression or worst pages and comparing them with the rest is selection on the outcome: such pages recover with no change and look like a win. A pilot this small cannot be called keep or revert: report raw before and after clicks for the changed and the untouched pages, and nothing more. Before editing record per page: date, old/new text, T-CTR-BASELINE-day clicks, impressions, CTR, position. One variable per batch (title OR description). Keep similar unchanged pages (same template, similar clicks, not competing for the same queries, at least T-CTR-CONTROL-EXTRA more than the pages changed) as the control, chosen by the same rule as the changed pages. Leave a page, and any competing page for its query, untouched while its window (T-CTR-WINDOW) is open: no second change in the window.

## Step 6 — Measure on clicks

Success is judged on clicks, never on CTR alone. Allow for recrawl (T-CTR-SETTLE days unless you can see Google has recrawled; evidence of a recrawl counts only if it is dated after the change), then compare equal whole-week windows before and after (T-CTR-MEASURE weeks for a title or description), with the control over the same dates. These are defaults, not Google rules. Show the result as a range, and when the data cannot show a difference larger than normal week-to-week wobble, say "too little data to call" rather than keep or revert. Watch position: a click gain with a position drop, or a CTR rise from falling impressions, is not a win. CTR, impressions and position are supporting evidence only, and inaccurate for any day in the affected window (Step 1). Account for seasonality and algorithm updates via the control or year-on-year.

## Step 7 — Decide

- Clicks up vs control by more than normal wobble, position stable: keep; apply the pattern to similar pages next batch. A position drop stops a keep.
- Flat: iterate once on a different diagnosis; if still flat, watch list (likely SERP-level cause); revisit only with new SERP evidence.
- Clicks down vs control by more than normal wobble: revert to the logged previous text and note it. Position alone never triggers a revert.
- Too little data to call (few pages, few clicks, an overlapping Google update, or a pilot-sized batch): report raw counts, do not keep or revert on the numbers, and decide on the diagnosis instead.

## Step 8 — Log it

Record changes, baselines, measurement dates, results, reverts and watch-list decisions via `change-and-decision-log`.

---

## Output shape

1. Candidate list: page, top query, position, impressions, clicks, CTR, gap to site curve, estimated lost clicks; AI-exposure label (likely affected / unclear / unaffected) per query; exclusions with reasons; data-anomaly check result and whether the CTR curve used clean days only.
2. Per candidate: what Google actually displays, diagnosis (Step 3 category), actionable or watch-list.
3. Proposed title/description (2-3 variants, one recommended) with truthfulness check result. None for queries labelled likely affected.
4. Batch size, baseline values, control group, template or page set, growth-stage gate result.
5. Measurement window (dates), success criterion in clicks vs control, revert rule.
6. Inferred vs confirmed statement, and log entry.

Facts checked against Google documentation on 2026-10-05 (title link, snippet, Search Console data anomalies and Generative AI performance report pages). Re-check time-sensitive items before relying on them.
