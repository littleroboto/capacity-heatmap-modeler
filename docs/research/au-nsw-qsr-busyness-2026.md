# AU / NSW QSR Busyness — Primary-Source Research (Calendar Year 2026)

> **Saved to:** `docs/research/au-nsw-qsr-busyness-2026.md`
>
> **Scope:** New South Wales, Australia · Target calendar year **2026**.
> Feeds the "AU / NSW QSR busyness" capacity-modeling scenario in this repo.
>
> **Method:** Every dated claim is traced to the **primary source that owns it** (NSW Government,
> NSW Department of Education, Australian Bureau of Statistics). Secondary/aggregator content is
> avoided; where only secondary or estimated data exists it is **explicitly flagged**.
>
> **Prepared:** 2026-07-10.

---

## Section 1 — NSW Public Holidays 2026

**Primary source:** NSW Government, *NSW public holidays* — <https://www.nsw.gov.au/about-nsw/public-holidays>
(owning org: **NSW Government**, administered by NSW Industrial Relations under the *Public Holidays Act 2010*).
Cross-checked against the Fair Work Ombudsman *2026 public holidays* list for New South Wales.

Statewide public holidays gazetted under the *Public Holidays Act 2010* for NSW in 2026:

| Holiday | Day | Date | ISO |
| --- | --- | --- | --- |
| New Year's Day | Thursday | 1 Jan 2026 | 2026-01-01 |
| Australia Day | Monday | 26 Jan 2026 | 2026-01-26 |
| Good Friday | Friday | 3 Apr 2026 | 2026-04-03 |
| Easter Saturday | Saturday | 4 Apr 2026 | 2026-04-04 |
| Easter Sunday | Sunday | 5 Apr 2026 | 2026-04-05 |
| Easter Monday | Monday | 6 Apr 2026 | 2026-04-06 |
| Anzac Day | Saturday | 25 Apr 2026 | 2026-04-25 |
| Additional public holiday for Anzac Day | Monday | 27 Apr 2026 | 2026-04-27 |
| King's Birthday | Monday | 8 Jun 2026 | 2026-06-08 |
| Labour Day | Monday | 5 Oct 2026 | 2026-10-05 |
| Christmas Day | Friday | 25 Dec 2026 | 2026-12-25 |
| Boxing Day | Saturday | 26 Dec 2026 | 2026-12-26 |
| Additional public holiday for Boxing Day | Monday | 28 Dec 2026 | 2026-12-28 |

**Region-specific / part-day / conditional notes (from the NSW Government page):**

- **Bank Holiday — Monday 3 Aug 2026 (`2026-08-03`) is NOT a statewide declared public holiday.**
  Only *retail bank branches and certain financial institutions* are required to close on the first
  Monday in August (per Part 3A of the *Retail Trading Act 2008*). It has **no** general public-holiday
  staffing/penalty implication for a QSR. Source: NSW Government public holidays page, footnote 1, and its
  FAQ ("Is a Bank Holiday a declared public holiday? No.").
- **Anzac Day** is always observed on **25 April** even when it falls on a weekend; because 25 Apr 2026 is a
  Saturday, an **additional** public holiday is declared for **Monday 27 April 2026**. (NSW Government page.)
- **Boxing Day** falls on **Saturday 26 Dec 2026**, so an **additional** public holiday is declared for
  **Monday 28 December 2026**. (NSW Government page, footnote 3.)
- **Christmas Day (Fri 25 Dec)** and **New Year's Day (Thu 1 Jan)** fall on weekdays in 2026, so they get
  **no** additional/substitute day.
- **Local public holidays & local event days:** NSW also declares *local* public holidays and *local event
  days* (e.g. agricultural shows, racing carnivals) in specific regional/rural local-government areas. These
  are **region-specific**, vary year to year, and are **not** enumerated on the statewide page — they must be
  checked per LGA if the scenario models a specific regional town. A *local event day* is **not** a declared
  public holiday for work purposes. (NSW Government page, "NSW local public holidays or local event days" and FAQ 2–3.)

**Machine-friendly list (statewide declared public holidays only; ISO YYYY-MM-DD):**

```
2026-01-01  New Year's Day
2026-01-26  Australia Day
2026-04-03  Good Friday
2026-04-04  Easter Saturday
2026-04-05  Easter Sunday
2026-04-06  Easter Monday
2026-04-25  Anzac Day
2026-04-27  Additional public holiday for Anzac Day
2026-06-08  King's Birthday
2026-10-05  Labour Day
2026-12-25  Christmas Day
2026-12-26  Boxing Day
2026-12-28  Additional public holiday for Boxing Day
```

> Bank Holiday (`2026-08-03`) is deliberately **excluded** from the machine list above because it is not a
> statewide declared public holiday. Include it separately only if modeling bank/financial-institution staffing.

---

## Section 2 — NSW School Terms & School Holidays 2026

**Primary source:** NSW Department of Education, *2026 term dates* —
<https://education.nsw.gov.au/schooling/calendars/2026> (owning org: **NSW Department of Education**).
Cross-checked against NSW Government, *NSW school holidays* — <https://www.nsw.gov.au/about-nsw/school-holidays>.

NSW public-school dates split into **Eastern division** and **Western division**; they differ **only in the
Term 1 start date** (Western "late start" schools in the far west begin later). All other 2026 term
start/end dates are identical across divisions.

### Term dates for students (2026)

| Term | Eastern division | Western division |
| --- | --- | --- |
| Term 1 | Mon 2 Feb 2026 → Thu 2 Apr 2026 | **Mon 9 Feb 2026** → Thu 2 Apr 2026 |
| Term 2 | Wed 22 Apr 2026 → Fri 3 Jul 2026 | Wed 22 Apr 2026 → Fri 3 Jul 2026 |
| Term 3 | Tue 21 Jul 2026 → Fri 25 Sep 2026 | Tue 21 Jul 2026 → Fri 25 Sep 2026 |
| Term 4 | Tue 13 Oct 2026 → Thu 17 Dec 2026 | Tue 13 Oct 2026 → Thu 17 Dec 2026 |

ISO term spans:

```
Term 1 (Eastern): 2026-02-02 .. 2026-04-02
Term 1 (Western): 2026-02-09 .. 2026-04-02
Term 2 (both):    2026-04-22 .. 2026-07-03
Term 3 (both):    2026-07-21 .. 2026-09-25
Term 4 (both):    2026-10-13 .. 2026-12-17
```

### School holiday (break) periods

The Department lists holiday breaks as the **weekday range between terms** (it excludes the surrounding
weekends and public holidays). The long summer breaks that bracket 2026 are shown for both divisions.

| Break | Eastern division | Western division |
| --- | --- | --- |
| Summer 2025→26 | Mon 22 Dec 2025 → Mon 26 Jan 2026 (students return Mon 2 Feb) | Mon 22 Dec 2025 → Mon 2 Feb 2026 (students return Mon 9 Feb) |
| Autumn | Tue 7 Apr 2026 → Fri 17 Apr 2026 | Tue 7 Apr 2026 → Fri 17 Apr 2026 |
| Winter | Mon 6 Jul 2026 → Fri 17 Jul 2026 | Mon 6 Jul 2026 → Fri 17 Jul 2026 |
| Spring | Mon 28 Sep 2026 → Fri 9 Oct 2026 | Mon 28 Sep 2026 → Fri 9 Oct 2026 |
| Summer 2026→27 | Fri 18 Dec 2026 → Wed 27 Jan 2027 | Fri 18 Dec 2026 → Wed 3 Feb 2027 |

ISO break spans (Department definition — weekday ranges):

```
Summer 2025-26 (Eastern): 2025-12-22 .. 2026-01-26
Summer 2025-26 (Western): 2025-12-22 .. 2026-02-02
Autumn (both):            2026-04-07 .. 2026-04-17
Winter (both):            2026-07-06 .. 2026-07-17
Spring (both):            2026-09-28 .. 2026-10-09
Summer 2026-27 (Eastern): 2026-12-18 .. 2027-01-27
Summer 2026-27 (Western): 2026-12-18 .. 2027-02-03
```

**Notes:**

- The **only** Eastern vs Western difference in 2026 is Term 1 start (2 Feb vs 9 Feb) and, correspondingly,
  the end of the preceding/following summer break.
- School development days (staff-only, students not attending) sit just before student term starts, e.g.
  Eastern Term 1: Tue 27 Jan → Fri 30 Jan 2026; Western Term 1: Tue 3 Feb → Fri 6 Feb 2026. These are not
  student holidays but are also not normal school days. (NSW Department of Education, 2026 term dates page.)
- A small number of schools near the VIC/QLD borders may vary from the standard calendar. (NSW Department of
  Education / NSW Government pages.)

---

## Section 3 — Australian QSR / Takeaway-Food Busyness Seasonality

**Primary sources:** Australian Bureau of Statistics (ABS). The relevant industry category is
**"Cafes, restaurants and takeaway food services"** (ANZSIC subgroups: Cafes and restaurants 4511,
Takeaway food services 4512, Catering services 4513) as defined in the ABS Retail Trade methodology.

> **IMPORTANT DATA-AVAILABILITY CAVEAT.** The ABS **discontinued** *Retail Trade, Australia* — the series
> that carried the standalone monthly "Cafes, restaurants and takeaway food services" turnover — on
> **31 July 2025**; the **June 2025 issue was the last release**. From August 2025 onward, food-service
> spending is reported inside the broader **Monthly Household Spending Indicator (MHSI)** category
> **"Hotels, cafes and restaurants"**, which bundles accommodation and cafes/restaurants together and is
> **not** a pure QSR/takeaway series. So there is **no ongoing, first-party monthly series specific to
> takeaway food services** for 2026. (ABS Retail Trade June 2025 release; ABS MHSI.)

### 3a. Seasonal shape across the year (month-of-year)

ABS states the seasonal pattern directly in its own methodology and commentary (primary):

- The ABS seasonal-adjustment methodology names the retail seasonal effect explicitly as
  *"annual patterns in sales, such as **increased spending in December as a result of Christmas**"* — i.e.
  a **December peak** is the dominant seasonal feature of retail (including food services).
  (ABS, *Retail Trade, Australia methodology, Feb 2025*.)
- ABS commentary: *"**November, December and January are the most seasonal months of the year**, with retail
  activity heavily affected by the Christmas period and January holidays."* (ABS media release,
  *Retail sales rebound by 1.9 per cent in January* [Jan 2023 reference month].)
- Within the cafes/restaurants/takeaway industry specifically, ABS has noted **January strength driven by
  catering/events**: the *return of large-scale sporting and cultural events in January … boosted sales in
  catering services which are part of the cafes, restaurants and takeaway food services industry.*
  (Same ABS media release.)

**Summarised seasonal shape (primary-anchored):**

- **Peak: December** (Christmas / holiday season) — the strongest, most consistent seasonal high across
  retail and food services. **Original-terms** turnover is highest in December.
- **Elevated: January** — sustained by summer holidays plus catering for large sporting/cultural events;
  a QSR-relevant strong month even though total retail dips after Christmas.
- **Trough: post-holiday / early-year lull.** ABS groups Nov–Jan as "most seasonal"; the seasonal *dip*
  shows up as the sharp month-on-month falls the ABS removes after the December peak (e.g. seasonally
  adjusted total retail fell **-4.0%** Dec 2022 before rebounding **+1.9%** Jan 2023 — illustrating the size
  of the Christmas seasonal bump that adjustment strips out). (ABS media release, Jan 2023.)

> **Estimate / gap flag.** A clean, public **monthly seasonal index** (e.g. each month's share of annual
> turnover) specifically for *cafes/restaurants/takeaway* is **not** reproduced on the ABS web releases; it
> lives in the ABS time-series **datacubes (spreadsheets)** for the now-discontinued Retail Trade series.
> The qualitative shape above (December peak, Jan elevated, Feb–Mar softest early-year) is **ABS-primary**;
> any precise per-month multiplier used in the model should be treated as an **estimate** unless taken
> directly from those ABS original-series spreadsheets. The published "Changes in the seasonality of Retail
> Turnover" article quantifies month-share for *non-food* retail (Dec ≈ 12% of annual vs Jan ≈ 7.9%) as an
> indicative magnitude, but that is **non-food retail, not food services** — do not apply it directly to QSR.

### 3b. Day-of-week pattern

- ABS confirms a **weekend / trading-day effect** in principle: seasonal adjustment removes
  *"trading day [effects] arising from weekly patterns in sales"* and notes
  *"increased trading activity on **weekends and public holidays**."*
  (ABS, *Retail Trade, Australia methodology, Feb 2025*.) This is primary confirmation that food-service
  activity is **higher on weekends**, but ABS does **not** publish a first-party day-of-week busyness curve.
- **Gap:** There is **no ABS first-party daily/day-of-week QSR busyness dataset.** Any specific
  day-of-week busyness curve (e.g. Fri/Sat evening peaks, Sunday lunch) must come from **secondary or
  first-party industry telemetry** (e.g. payments processors, delivery platforms, POS vendors), which were
  **not** available as high-trust primary sources here. **Flag any day-of-week weighting in the model as an
  estimate.**

### 3c. NSW-specific note

- The discontinued Retail Trade series reported turnover by state; in the final (June 2025) release NSW
  posted the equal-largest monthly total-retail rise (**+1.6%**), but this is a one-month total-retail
  movement, **not** a NSW cafes/restaurants seasonal profile. (ABS, Retail Trade June 2025.)
- The current MHSI reports "Hotels, cafes and restaurants" nationally and by state (seasonally adjusted, so
  it **hides** the raw seasonal shape). It is the correct **ongoing** primary source to watch for 2026
  food-service spending, but it is **broader than QSR** and does not isolate takeaway.

---

## Gaps where primary data was unavailable

1. **No ongoing QSR-specific monthly series for 2026.** ABS retired the standalone "Cafes, restaurants and
   takeaway food services" monthly turnover series (last release June 2025); the successor MHSI bundles it
   into "Hotels, cafes and restaurants."
2. **No public per-month seasonal index for QSR on the ABS website.** The qualitative shape (December peak,
   January elevated) is ABS-primary; precise monthly multipliers require the ABS Retail Trade time-series
   datacubes (original series), which are downloadable spreadsheets not fully quoted here.
3. **No first-party day-of-week busyness data from ABS.** Weekend > weekday is ABS-confirmed qualitatively;
   any specific daily curve is an estimate from secondary/industry sources.
4. **Regional NSW local public holidays / local event days** are not enumerated statewide and must be
   checked per LGA if the scenario models a specific regional location.

---

## Sources

All sources below are first-party / owning-org primary sources.

1. **NSW Government — NSW public holidays** (Public Holidays Act 2010; NSW Industrial Relations).
   <https://www.nsw.gov.au/about-nsw/public-holidays> — 2026 dates, Bank Holiday footnote, additional-day rules, local holidays. *(Owner: NSW Government.)*
2. **Fair Work Ombudsman — 2026 public holidays** (cross-check for NSW list).
   <https://www.fairwork.gov.au/employment-conditions/public-holidays/2026-public-holidays> — *(Owner: Fair Work Ombudsman, Australian Government.)*
3. **NSW Department of Education — 2026 term dates.**
   <https://education.nsw.gov.au/schooling/calendars/2026> — term dates, school holiday breaks, Eastern/Western divisions, development days. *(Owner: NSW Department of Education.)*
4. **NSW Government — NSW school holidays** (cross-check of term/holiday dates).
   <https://www.nsw.gov.au/about-nsw/school-holidays> — *(Owner: NSW Government.)*
5. **ABS — Retail Trade, Australia, June 2025** (final/last release of the series; industry & state figures; discontinuation notice).
   <https://www.abs.gov.au/statistics/industry/retail-and-wholesale-trade/retail-trade-australia/latest-release> — *(Owner: Australian Bureau of Statistics.)*
6. **ABS — Retail Trade, Australia methodology, February 2025** (ANZSIC definition of "Cafes, restaurants and takeaway food services"; December/Christmas seasonal effect; weekend trading-day effects).
   <https://www.abs.gov.au/methodologies/retail-trade-australia-methodology/feb-2025> — *(Owner: Australian Bureau of Statistics.)*
7. **ABS — media release, "Retail sales rebound by 1.9 per cent in January"** (Nov–Jan "most seasonal months"; December fall / January rebound; January catering/events strength).
   <https://www.abs.gov.au/media-centre/media-releases/retail-sales-rebound-19-cent-january> — *(Owner: Australian Bureau of Statistics.)*
8. **ABS — Monthly Household Spending Indicator** (successor series; "Hotels, cafes and restaurants" category).
   <https://www.abs.gov.au/statistics/economy/finance/monthly-household-spending-indicator> — *(Owner: Australian Bureau of Statistics.)*
9. **ABS — Changes in the seasonality of Retail Turnover** (indicative monthly-share magnitudes; non-food retail only — used only as scale illustration, not applied to QSR).
   <https://www.abs.gov.au/articles/changes-seasonality-retail-turnover> — *(Owner: Australian Bureau of Statistics.)*
