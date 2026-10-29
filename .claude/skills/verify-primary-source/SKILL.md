---
name: verify-primary-source
description: >
  Verify any factual claim, number, threshold, rate, spec, or rule published on a content
  site against its one authoritative canonical source before publishing or editing it.
  Use before changing any figure in content, when confirming whether a flagged passage is
  actually wrong, or when auditing a site for factual accuracy. Trigger when a user asks
  "audit my site's accuracy," "is this figure still correct," "what's the source for X,"
  or when running any wider content-quality audit that touches factual claims. Prerequisite
  for content-freshness-audit and protected-field-audit (this pack).
  Not for scheduling re-checks (content-freshness-audit).
---

# Verify Primary Source

Confirm the correct, current value of any published fact from its one authoritative source
before trusting or editing it. A checkable claim is never confirmed by assumption — always by
checking the source.

Facts checked against Google documentation on 2026-10-05 (Google pages are time-sensitive;
re-read before quoting).

**AI-generated content: guidance versus rule.** Google's page on using generative AI for content
recommends, as *guidance*, manually fact-checking and reviewing all AI-generated content (this
includes titles, meta descriptions, structured data and image alt text). That recommendation is
not itself an enforceable rule. The enforceable rule is the scaled content abuse spam policy:
many pages generated mainly to manipulate rankings, however they are created, may violate it.
Checking facts against sources is how a site meets the guidance; it does not by itself settle
the policy question.

---

## Step 0 — Ask before assuming

1. What kind of claims does the content actually make (prices, specs, dates, regulatory
   thresholds, statistics, rankings, product data)?
2. Is there an existing source-of-truth mapping (a spreadsheet, a data source, an API), or does
   each page just state facts inline with no tracked source?
3. How many pages/claims are in scope? A 20-page site and a 2,000-page site need different
   sampling strategies (full check vs. representative sample + risk-tiering).
4. How often do the underlying facts actually change (daily prices vs. annual regulatory
   figures vs. essentially-static facts)?
5. Is there a specific known worry, or is this a cold-start audit?

Scope the rest of this skill to the answers — don't run every step unmodified if some don't apply.

**If the site owner can't answer some or all of these, proceed anyway rather than blocking**:
sample claim types directly from the visible content, build a best-effort source mapping from
general knowledge of the niche (flag it as provisional), and default to a representative sample
across page types rather than full coverage when scale is unclear.

---

## Step 1 — Identify the authoritative source, per claim type

For every distinct claim type, identify the one canonical source it should be checked against:

| Claim type | Authoritative source | Why not a secondary source |
|---|---|---|
| Product pricing | The vendor's own live pricing page | Third-party roundups lag and mis-tier pricing |
| Regulatory threshold | The issuing government/regulatory body's own page | Summary sites are one layer removed and propagate stale figures |
| A statistic attributed to a study | The study/publisher itself | Citing articles routinely mis-transcribe numbers |

Rule: always prefer the primary originator of the fact over anyone summarizing it. A secondary
source is acceptable only to *locate* the primary source — never as sole confirmation.

If this mapping doesn't exist yet, build it as part of the audit — it's a deliverable in its
own right, not just a means to an end.

---

## Step 2 — What to check, by claim shape

- **Numeric thresholds/rates**: confirm the exact value, not a rounded approximation; confirm
  which tier/segment it applies to.
- **Dated/versioned facts**: confirm the source's own "last updated"/"effective as of" date
  actually matches the period the site claims it for.
- **Rankings/superlatives** ("the cheapest," "#1 in X"): re-verify independently of the
  individual figures behind them — the inputs can all still be correct while the ranking itself
  has flipped.
- **Derived/calculated figures**: verify each input separately, then re-derive the output.

---

## Step 3 — Fetch and extract

1. Retrieve the source directly — don't rely on a cached summary or memory of it.
2. Check the source's own "last updated" date against the period being claimed.
3. Prefer a value in a table/structured data over one in prose.
4. If multiple periods/tiers/versions are shown, confirm which row/column applies.
5. A source in another language is still usable — the numeric value transfers directly.
6. **Check for a newer version.** Before calling a figure current, look on the issuing body's own
   site for a newer notice, plan year, edition or revision. Record what you searched and when
   ("found <what>" or "not found as of <date>"). If a newer version exists, add it as a clearly
   labelled note beside the current figure; never swap it in silently, and never present a
   draft as final.
7. **State the edition.** Record which version, plan year, period or effective date the source
   covers, and say so on the page whenever it is not the current one.
8. **If a source blocks you, do not disguise the request.** No spoofed browser identity, no
   proxies or mirrors. Identify honestly, retry once with the default, and if it is still
   blocked, report the claim as unreachable. Then open the source yourself in a real browser,
   ask the site owner for the document, narrow the claim to what you can support, or flag it
   as unverified.

---

## Step 4 — Compare to what the site currently claims

- **Correct** → record it as checked (Step 6); no edit needed.
- **Stale** → note old value, new value, source — a finding.
- **Conflicting sources** → do not silently pick one. Flag explicitly for the site owner's
  judgment (common causes: transition period, tier mismatch, fiscal-vs-calendar mismatch).

---

## Step 5 — Acceptable vs. unacceptable secondary sources

Acceptable for cross-checking only (never as sole confirmation): established industry-specific
reference sources for the niche; the primary source's own official secondary publications.

Never acceptable as a sole source: general news/blog articles, crowd-edited references,
competitor sites, AI-generated summaries with no cited source of their own.

---

## Step 6 — Record what was checked

For every claim verified: record the confirmed value, the source URL, the date checked and a
verbatim quote from the source (one line, 20 or more characters; if your tool only returned a
summary of the page, record the claim as "confirmed in substance" instead)
(a spreadsheet row or a content-file comment is enough). See `content-freshness-audit` (this
pack) for tracking *when* a claim is next due for re-checking.

Checking a claim is not a reason to change a page date. Google says to avoid changing dates
when content has not substantially changed, and a false sitemap `lastmod` loses Google's trust.
Record the check date in your own record; update a visible date or `lastmod` only if the page
content changed. Freshness matters most for queries where recent information is expected
("query deserves freshness" is query-specific).

Re-check cadence defaults, if none exists (tier by value and risk): `VPS-TIER-TOP`,
`VPS-TIER-MID`, `VPS-TIER-TAIL` in the Defaults table.

---

## Output shape

Per claim type sampled: the claim + location, confirmed value + source, and status (confirmed
correct / confirmed in substance / stale / conflicting sources — flagged / could not verify),
the source's edition, and what the newer-version search found.

---

## Defaults (not Google figures; all PROPOSED)

| id | value | unit | basis | calibrate on |
|---|---|---|---|---|
| VPS-TIER-TOP | monthly, or at the fact's own trigger if sooner | re-check interval | PROPOSED | how often the source changes; clicks and risk of the page |
| VPS-TIER-MID | quarterly | re-check interval | PROPOSED | observed change rate |
| VPS-TIER-TAIL | yearly, or reactive | re-check interval | PROPOSED | observed change rate |
