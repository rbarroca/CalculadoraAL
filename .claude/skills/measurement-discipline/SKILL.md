---
name: measurement-discipline
description: >
  Audit (or help set up) whether a site can actually tell what caused a ranking/traffic change,
  or whether it's just making changes and hoping. Use when auditing a site's SEO/content-change
  process, when a user asks "why did my traffic move" and can't isolate the cause, or when
  reviewing whether past optimization changes were ever actually measured.
  Not for diagnosing a traffic drop (traffic-drop-diagnosis).
---

# Measurement Discipline Audit

Checks whether a site's change process lets it isolate cause and effect, or invites the
"we changed several things, something moved, no idea which change did it" failure.

---

## Step 0 — Ask before assuming

1. How many distinct optimization/structural changes (not new-content additions — see Step 4)
   get made per week or month currently?
2. Is there any record of when a change was made and what the metrics looked like right before
   it? Without a real baseline, nothing after is measurable.
3. Has anything been "fixed twice" — the same page changed again before the first change's
   effect was known? The most common symptom of missing discipline.
4. What's the actual crawl/re-index/re-rank timeline for the relevant search context? (For
   Google web search, practitioner estimates, not Google figures: days to crawl, 2–4 weeks for
   rankings to adjust, 4–6 weeks to fully stabilize — see the Defaults table. Use these to size the
   measurement window, not an arbitrary shorter one.)

**If no historical change/baseline data is given:** don't block on it — this is the one place
where the honest answer is that a *retroactive* assessment genuinely can't be produced without
some record of what changed and when. Say that plainly, then pivot to what can still be
delivered without any additional data: recommend starting the discipline (Steps 1, 2, and 5)
from this point forward, and give the setup guidance (what a change ledger should capture, what
window length to use per Step 3) so the site has the mechanism in place before the next change,
rather than waiting for a fuller history to exist.

---

## Defaults

| id | value | unit | basis | calibrate on |
|---|---|---|---|---|
| M-RERANK | 2–4 | weeks for rankings to adjust after a change | practitioner estimate (PROPOSED), not a Google figure | the site's own past changes |
| M-STABILIZE | 4–6 | weeks to fully stabilize | practitioner estimate (PROPOSED), not a Google figure | the site's own past changes |
| M-SETTLE | 14 | days to wait after a change before the "after" window starts, unless you can see Google has recrawled the page (evidence counts only if dated after the change) | PROPOSED; Google says a recrawl takes "a few days to a few weeks" | the site's own recrawl delay on earlier changes |
| M-WINDOW-SNIPPET | 4 | whole weeks in each of the "before" and "after" windows for a title or description change | PROPOSED | the site's weekly click volume |
| M-WINDOW-CONTENT | 6 | whole weeks in each window for a content or internal-link change | PROPOSED | the site's weekly click volume |
| M-CONTROL-EXTRA | 5 | untouched comparison pages to have beyond the number of pages changed | PROPOSED | how many similar pages the site has |

Google documents no fixed timeline for a change to take effect (only "a few days to a few weeks"
for a recrawl), so the numbers above are habits, not facts. Google's stated timings in this pack are listed in each skill's Facts checked; the ones that matter for windows are the 2–3 day data lag and the full week after a core update (`traffic-drop-diagnosis`).

---

## Step 1 — Check for a real baseline-before-change habit

For any past change, check whether a baseline was recorded at the time — date, description,
target pages, pre-change metrics — not reconstructed afterward from memory. If this doesn't
exist, the recommendation is to build it: a simple ledger logging every change with its
baseline, as the single source of truth for what's pending measurement.

---

## Step 2 — Check for change-isolation discipline

Rule: don't make a second change to a page (or a page competing for the same query) while a
previous change's measurement window is still open. Check whether changes get layered on top of
each other reactively instead. Related check: if changes are made in large batches, has
anything ever gone wrong in a way that couldn't be traced to a specific item in the batch? If
so, the batch size is too large relative to the ability to isolate cause.

---

## Step 3 — Check the measurement window is long enough to mean anything

A measurement taken too early mostly reflects noise. Check whether early checks get treated as
conclusive rather than as the necessarily-early data they are. Then check the method
against this one rule, which `ctr-snippet-optimization` follows too:

1. **Untouched comparison pages.** Compare the changed pages with similar pages you did not
   change (same template, similar clicks, not competing for the same queries; at least
   M-CONTROL-EXTRA more than the pages changed), over the same dates. A before-and-after on the
   same pages with no untouched comparison cannot separate your change from seasonality or a
   Google update.
2. **Same selection rule for both groups.** Choose the comparison pages by the same rule as the
   changed pages. Pages picked because they did badly tend to recover with no change at all, so if
   you changed the worst performers, leave a random half of that list unchanged as the comparison.
3. **Equal whole-week windows.** The "before" and "after" windows are the same number of whole
   weeks (M-WINDOW-SNIPPET or M-WINDOW-CONTENT), so every weekday appears equally often.
4. **Wait for the recrawl.** Start the "after" window M-SETTLE days after the change, or after
   dated evidence that Google recrawled the page, whichever is sooner.
5. **No second change** to a changed page, or a page competing for its query, until its window
   closes.
6. **Show a range, not a single number,** and say "too little data to call" when a small site
   cannot show a difference larger than normal week-to-week wobble. Few changed pages, few clicks
   or an overlapping Google update are all reasons to say it. A small batch can only show a very
   large change: report raw before and after counts and stop there.

Data caveats for any window: clicks are the primary measure. Search Console recorded a logging
error that, in Google's words, "prevented Search Console from accurately reporting impressions"
from 13 May 2025 until 27 Apr 2026; impressions, CTR and average position were affected and
clicks were not, so do not judge a change on impressions, CTR or position from that period. Check
the "Data anomalies" page (it keeps only recent entries) for others. Also, the newest days can be
preliminary and normal data lag is 2–3 days, so close a window only on complete days. AI Overview
and AI Mode traffic is included in Search Console's Web totals; Google documents no filter for it that we could find, so it is not separated from
ordinary web search clicks in the main report, so a shift in it can look like a change effect.

---

## Step 4 — Check the cap applies to the right category of change

The isolation discipline above should apply to changes to *existing* pages/structure — not to
adding genuinely new content, which doesn't compete for the same attribution problem. Check
whether the site's process correctly distinguishes these.

---

## Step 5 — Check for a staleness backstop on the tracking mechanism itself

Check whether updating the ledger is a required step inside the process that makes changes and
measures them, or a separate habit someone has to remember — the latter reliably lapses.

---

## Facts checked against Google documentation on 2026-10-05

Time-sensitive items marked (T).

- Impressions logging error 13 May 2025 to 27 Apr 2026: impressions, CTR, position affected; clicks unaffected. Verified (T).
- Newest data can be preliminary; normal lag 2–3 days. Verified (T).
- AI Overview and AI Mode traffic counts in the Web search type. Verified.
- The 2–4 and 4–6 week figures are practitioner estimates: not verified against Google.

---

## Output shape

Whether a real baseline-before-change record exists; evidence of the layered-changes/
can't-isolate-cause failure mode; whether measurement windows and untouched comparison pages follow
the Step 3 rule, with results shown as a range or as "too little data to call"; whether the change-cap applies to the right category; whether the tracking
mechanism has a structural staleness safeguard.
