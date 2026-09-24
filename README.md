# Atlas — Regenerative Impact Dashboard

> **Measure restoration, not just activity.**

The **Regenerative Impact Dashboard** is Atlas's operational interface for answering a deceptively difficult question:

> **Are we actually healing anything, or are we just making beautiful charts while the planet wheezes?**

Traditional analytics dashboards are usually optimized around extraction and performance:

```text
Revenue
Output
Growth
Utilization
Efficiency
```

Atlas focuses on a different class of signal:

```text
Restoration
Recovery
Regeneration
Resilience
Durability
Verified ecological value
```

The dashboard turns regenerative outcomes into measurable, geographic, temporal, and economic intelligence.

It is not an ESG decoration layer.

It is a **regenerative accounting interface**.

---

# 01 — Product Purpose

The dashboard should allow a decision-maker to answer three questions immediately:

### What has improved?

How much measurable restoration or recovery has occurred?

### Where is it happening?

Which regions, ecosystems, projects, communities, and intervention zones are producing the change?

### Is the impact credible and durable?

Can the result be verified, sustained through time, attributed responsibly, and translated into economic value?

The product therefore connects:

```text
OBSERVATION
     ↓
MEASUREMENT
     ↓
VERIFICATION
     ↓
REGENERATION
     ↓
DURABILITY
     ↓
ECONOMIC VALUE
```

---

# 02 — Product Mental Model

The interface is organized into four layers.

```text
┌──────────────────────────────────────────┐
│ 1. EXECUTIVE SUMMARY                     │
│    What changed?                         │
├──────────────────────────────────────────┤
│ 2. SPATIAL IMPACT                       │
│    Where did it change?                  │
├──────────────────────────────────────────┤
│ 3. TEMPORAL ANALYSIS                    │
│    Is recovery accelerating or fading?  │
├──────────────────────────────────────────┤
│ 4. ECONOMIC TRANSLATION                 │
│    What is verified recovery worth?     │
└──────────────────────────────────────────┘
```

This creates a consistent reasoning path:

> **What → Where → How durable → What value**

---

# 03 — Dashboard Architecture

A production layout can follow this structure:

```text
┌─────────────────────────────────────────────────────────────┐
│ ATLAS · REGENERATIVE IMPACT                                │
│ Region · Domain · Verification · Time · Portfolio          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ HERO IMPACT METRICS                                         │
│                                                             │
│ Hectares  Carbon  Water  Lives  Biodiversity  Jobs         │
│                                                             │
├───────────────────────────────────────┬─────────────────────┤
│                                       │                     │
│         REGENERATION MAP              │ SELECTED REGION    │
│                                       │ IMPACT DETAILS     │
│                                       │                     │
├───────────────────────────────────────┴─────────────────────┤
│                                                             │
│ IMPACT TRENDS                                               │
│                                                             │
├──────────────────────────┬──────────────────────────────────┤
│ OUTCOMES BY CATEGORY     │ VERIFICATION / TRUST            │
├──────────────────────────┴──────────────────────────────────┤
│                                                             │
│ RVE ECONOMIC TRANSLATION                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ PROJECT IMPACT EXPLORER                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 04 — Context & Filter Bar

## `ImpactFilterBar`

The context bar controls the analytical lens across the entire page.

### Filters

```text
Geography
├── Global
├── Country
├── Region
└── Project Area

Domain
├── Land
├── Carbon
├── Water
├── Health
├── Biodiversity
└── Jobs

Verification
├── Satellite Verified
├── Field Verified
├── Third-Party Audited
├── Community Reported
└── Model Estimated

Time
├── 30D
├── 12M
├── 5Y
└── Since Inception

Portfolio
├── All Projects
├── Fund
├── Program
└── Custom Portfolio
```

The filter state should remain persistent while navigating the dashboard.

### Example

```text
Kenya / Rift Valley
Forest + Water
Verified + Audited
Last 12 Months
Atlas Regeneration Portfolio
```

A user should never have to wonder:

> **“What exactly am I looking at?”**

---

# 05 — Hero Impact Metrics

## `ImpactMetricCard`

The hero strip presents the most important regenerative outcomes.

Recommended metrics:

```text
Hectares Restored
Net Carbon Removed
Water Systems Recovered
Lives Improved
Biodiversity Recovery Index
Regenerative Jobs Created
```

Each card contains:

* primary value
* period delta
* confidence
* sparkline
* provenance status
* freshness indicator

### Example

```text
┌──────────────────────────────┐
│ HECTARES RESTORED            │
│                              │
│ 10,240 ha                    │
│ ↑ 14.2% vs previous period   │
│                              │
│ ╭──────────────╮             │
│ │╲   ╭──────╮  │             │
│ │ ╲╭─╯      ╰──│             │
│ ╰──────────────╯             │
│                              │
│ Confidence 87% · Field + EO │
└──────────────────────────────┘
```

The confidence value matters because regenerative measurements are often partially observed, modeled, or asynchronously verified.

> **The interface should never imply more precision than the evidence supports.**

---

# 06 — Impact Delta

Every major metric should distinguish:

```text
CURRENT
vs
BASELINE
vs
PREVIOUS PERIOD
vs
TARGET
```

For example:

```text
10,240 ha restored

Baseline          6,800 ha
Previous period   8,960 ha
Current           10,240 ha
Annual target     12,000 ha
```

This makes improvement operational rather than merely decorative.

---

# 07 — Regeneration Map

## `RegenerationMap`

The map is the visual centerpiece of the dashboard.

Regeneration without geography is difficult to interrogate.

The map should support multiple layers:

```text
Land Restoration
Watershed Recovery
Reforestation
Biodiversity Corridors
Health Improvement
Employment Density
Carbon Sequestration
Project Boundaries
Verification Coverage
```

### Map controls

```text
[Layers]
[Satellite]
[Terrain]
[Policy]
[Heatmap]
[Polygons]
[Baseline ↔ Current]
```

The implementation should favor vector-based rendering and lazy layer loading.

---

# 08 — Spatial Drill-Down

Selecting a region or project opens an adjacent detail panel.

```text
┌─────────────────────────────────────┐
│ RIFT VALLEY RESTORATION ZONE 04     │
├─────────────────────────────────────┤
│                                     │
│ 2,420 ha restored                   │
│ +19.4% vegetation recovery          │
│                                     │
│ Carbon        41,200 tCO₂e          │
│ Water         +17% flow recovery    │
│ Biodiversity  +0.13 index           │
│                                     │
│ Verification                       │
│ ✓ Satellite                         │
│ ✓ Field sampled                     │
│ ⚠ Third-party audit pending         │
│                                     │
│ RVE ESTIMATE                        │
│ $2.8M                               │
│                                     │
│ [View Project] [View Evidence]      │
└─────────────────────────────────────┘
```

The panel should expose:

* project name
* geography
* baseline condition
* current condition
* impact metrics
* verification methods
* confidence
* economic valuation
* RVE instruments
* risk flags
* recent changes

The map is therefore not a decorative GIS layer.

It is a **spatial decision console**.

---

# 09 — Impact Trends

## `ImpactTrendPanel`

This section answers:

> **Is regeneration accumulating, stalling, reversing, or fluctuating?**

Core time-series views include:

```text
Hectares Restored
Carbon Removal
River / Groundwater Health
Disease or Health Outcomes
Biodiversity Recovery
Regenerative Employment
```

Each chart should support:

```text
Actual
Target
Forecast
Uncertainty
Baseline
```

### Example

```text
Impact

Target     ───────────────────────────
Actual                  ╭────────────
                       ╭╯
                     ╭─╯
                   ╭─╯
Forecast       ····╯
Uncertainty    ░░░░░░░░░░░░░░░░░░░░

          2024     2025     2026
```

---

# 10 — Multi-Resolution Time Series

Do not render every raw observation at every zoom level.

The charting layer should adapt.

```text
30D
→ daily / weekly observations

12M
→ weekly / monthly aggregation

5Y
→ monthly / quarterly aggregation

Since Inception
→ quarterly / annual aggregation
```

This avoids both performance problems and visual noise.

Otherwise every chart becomes a small spaghetti demon.

---

# 11 — Recovery Durability

A regenerative gain should not be treated as permanent simply because the latest measurement is positive.

Atlas should track durability.

Example:

```text
RESTORATION SURVIVAL

Year 1     97%
Year 2     91%
Year 3     84%
Year 4     82%
```

Useful durability indicators include:

* restoration survival rate
* persistence after climatic shocks
* vegetation stability
* habitat continuity
* water-system persistence
* outcome retention
* reversal events

This creates an important distinction:

```text
ACTIVITY
≠
IMPACT
≠
DURABLE IMPACT
```

---

# 12 — Before / After Comparison

## `BaselineComparison`

Users should be able to compare conditions directly.

```text
BEFORE                        CURRENT

Vegetation  42%       →       67%
Water       31%       →       54%
Species     0.48      →       0.61
Soil        39%       →       63%
```

Where possible, the interface should support:

```text
Baseline ↔ Current
Baseline ↔ Target
Current ↔ Forecast
Project A ↔ Project B
```

This is particularly valuable for policy and project operators.

---

# 13 — Outcomes by Category

## `ImpactCategoryTabs`

The dashboard should not force every regenerative domain into a single generic metric model.

Recommended categories:

```text
Land
Carbon
Water
Health
Biodiversity
Jobs
Economic Value
```

---

# 14 — Land Intelligence

### Metrics

```text
Hectares Restored
Soil Health
Vegetation Density
Desertification Reversal
Restoration Survival Rate
Land Cover Improvement
```

Example:

```text
LAND RECOVERY

Restored            10,240 ha
Vegetation          +18.7%
Soil Health         +11.4%
Survival Rate       84%
Desertification     -9.2%
```

---

# 15 — Carbon Intelligence

### Metrics

```text
Carbon Removed
Avoided Emissions
Sequestration Velocity
Permanence Confidence
Leakage Risk
Verification Coverage
```

Important distinction:

```text
REMOVED
AVOIDED
ESTIMATED
VERIFIED
```

These should never be visually conflated.

---

# 16 — Water Intelligence

### Metrics

```text
River Flow Recovery
Wetland Restoration
Groundwater Recharge Indicators
Water Quality
Flood Resilience
Watershed Stability
```

The UI should explicitly flag when a measure is a proxy rather than direct observation.

---

# 17 — Health Intelligence

### Metrics

```text
Lives Improved
Healthcare Access
Morbidity Reduction
Vaccination Continuity
Sanitation Outcomes
Service Reliability
```

Where causal attribution is uncertain, the interface should distinguish:

```text
Observed association
Modeled contribution
Verified intervention effect
```

---

# 18 — Biodiversity Intelligence

### Metrics

```text
Species Richness Proxy
Habitat Connectivity
Pollinator Return
Ecosystem Integrity
Habitat Area
Population Recovery
```

Biodiversity measurements can be especially incomplete, so data sufficiency and confidence should remain visible.

---

# 19 — Jobs Intelligence

### Metrics

```text
Regenerative Jobs
Local Enterprise Participation
Youth Employment
Income Uplift
Local Procurement
Supply Chain Inclusion
```

The dashboard connects ecological restoration with socioeconomic regeneration.

---

# 20 — Verification & Trust

## `VerificationPanel`

This section is one of the most important pieces of the product.

Once Atlas turns regenerative outcomes into economically meaningful instruments, users will reasonably ask:

> **Who verified this?**

The dashboard should expose the verification stack.

### Verification Types

```text
Satellite Verified
Ground Sampled
Community Reported
AI Inferred
Third-Party Audited
```

### Example

```text
┌─────────────────────────────────────┐
│ VERIFICATION STATUS                 │
├─────────────────────────────────────┤
│ ✓ Satellite verified               │
│ ✓ Ground sampled                   │
│ ✓ Community reported               │
│ ⚠ Third-party audit pending        │
│                                     │
│ Methodology v2.4                   │
│ Last audit: 14 Sep 2026            │
│ Coverage: 91%                      │
└─────────────────────────────────────┘
```

---

# 21 — Evidence Drawer

## `EvidenceDrawer`

Every important impact metric should have a way to reveal its evidence.

The drawer can contain:

```text
Source
Methodology
Collection Date
Coverage
Sampling Method
Model Version
Verification Method
Known Limitations
Audit History
```

Example:

```text
CARBON REMOVAL

41,200 tCO₂e

Evidence:
Satellite biomass model
+ field sample calibration

Confidence:
87%

Known limitation:
Field sample coverage is limited in
high-altitude zones.

Methodology:
Carbon Model v2.4
```

This is how the product becomes **belief infrastructure** rather than just visualization.

---

# 22 — Data Freshness

Every major domain should expose freshness.

Example:

```text
Carbon data      ● 2 days old
Water data       ● 7 days old
Biodiversity     ⚠ 91 days old
Health outcomes  ● 14 days old
Jobs             ● 3 days old
```

Do not let fresh and stale information look identical.

---

# 23 — RVE Economic Translation

## `RVEValuePanel`

This is the economic bridge between ecological recovery and Atlas's **Regenerative Value Exchange (RVE)**.

The panel translates verified outcomes into economic representations.

Potential modules:

```text
Regenerative Assets Created
Verified Recovery Units
Estimated Market Value
Portfolio Value
Yield
Liquidity
Counterparty Activity
Permanence Discount
Risk Adjustment
```

---

# 24 — Regenerative Asset Example

```text
FOREST RECOVERY ASSET

10,000 hectares restored

Ecological uplift       0.82
Carbon equivalent       68,000 tCO₂e
Biodiversity multiplier 1.30x
Durability confidence   0.91

Estimated RVE Value
$4.2M

Risk adjustment
-11%

Risk-adjusted value
$3.74M
```

The economic layer should never imply that an estimated ecological value is automatically a guaranteed market price.

The UI should distinguish:

```text
Observed
Verified
Estimated
Projected
Tradable
Illiquid
```

---

# 25 — Impact-to-Value Flow

## `ImpactValueSankey`

A Sankey or flow visualization can connect the physical outcome to economic representation.

```text
LAND RESTORATION
      │
      ├──────────────→ CARBON
      │
      ├──────────────→ BIODIVERSITY
      │
      └──────────────→ WATER
              │
              ↓
       VERIFIED OUTCOME
              │
              ↓
       REGENERATIVE ASSET
              │
              ↓
          RVE VALUE
```

This is one of the few places where a richer visualization genuinely earns its complexity.

---

# 26 — Portfolio Intelligence

## `RegenerativePortfolio`

For funders and institutional investors, the dashboard should support portfolio-level views.

Example:

```text
PORTFOLIO

42 Projects
84,200 ha restored
2.8M tCO₂e equivalent
17 watersheds
61,000 regenerative jobs
$38.4M estimated RVE value
```

Users can compare projects by:

```text
Impact
Durability
Verification
Risk
Cost
Economic Value
Geography
Outcome Type
```

Avoid presenting a single composite "impact score" without exposing the underlying dimensions.

---

# 27 — Project Impact Explorer

## `ProjectImpactTable`

Power users need a dense analytical table.

Recommended columns:

| Project             | Region      | Impact Type  | Baseline | Current | Confidence | Value | Trend | Risk   |
| ------------------- | ----------- | ------------ | -------: | ------: | ---------: | ----: | ----- | ------ |
| Rift Restoration 04 | Rift Valley | Land         |      42% |     67% |       0.87 | $2.8M | ↑     | Low    |
| Mara Watershed      | Kenya       | Water        |      31% |     54% |       0.79 | $1.9M | ↑     | Medium |
| Green Corridor 12   | Nairobi     | Biodiversity |     0.48 |    0.61 |       0.68 | $0.9M | →     | Medium |

The table should support:

* sorting
* filtering
* column configuration
* pagination or virtualization
* row expansion
* CSV / structured export
* deep links into projects

---

# 28 — Dashboard States

A regenerative dashboard has unusually complex data availability.

Every module must explicitly support state.

## Loading

Use domain-specific loading states:

```text
Loading restoration layers…
Loading verification evidence…
Calculating RVE valuation…
Loading biodiversity observations…
```

Avoid a generic spinner for the entire application.

---

## Empty

Example:

```text
No verified restoration signals found
for this region and time range.
```

The user should understand why the chart is empty.

---

## Partial Data

Example:

```text
CARBON
✓ verified

BIODIVERSITY
⚠ model estimated

WATER
— unavailable

HEALTH
✓ field validated
```

Partial information should remain usable.

---

## Error

Example:

```text
Water recovery analysis unavailable.

Cause:
Upstream sensor feed has not reported
recent observations.

Last valid observation:
17 Sep 2026
```

Do not replace meaningful diagnostics with:

> “Something went wrong.”

---

## Stale

Example:

```text
⚠ Biodiversity data is 91 days old.

Current result may not reflect recent
ecological conditions.
```

Freshness is part of the metric.

---

# 29 — Frontend Data Architecture

The dashboard combines several fundamentally different data types:

```text
Geospatial
Time Series
Impact Metrics
Verification Metadata
Economic Valuation
Project Metadata
Risk Signals
```

Normalize these into domain-specific models.

```text
projects
regions
impact_metrics
impact_series
verification_records
data_sources
economic_assets
valuations
risk_signals
```

Avoid letting every UI component invent its own representation of the same concept.

---

# 30 — Suggested Component Architecture

```text
regenerative-impact/
├── context/
│   ├── ImpactFilterBar
│   ├── RegionSelector
│   ├── DomainSelector
│   ├── VerificationSelector
│   └── TimeRangeSelector
│
├── overview/
│   ├── ImpactMetricCard
│   ├── DeltaIndicator
│   ├── ConfidenceBadge
│   └── SparklineMiniChart
│
├── map/
│   ├── RegenerationMap
│   ├── MapLayerControl
│   ├── MapLegend
│   └── RegionImpactDrawer
│
├── trends/
│   ├── ImpactTrendPanel
│   ├── RecoveryChart
│   ├── TargetTrajectory
│   └── UncertaintyBand
│
├── outcomes/
│   ├── ImpactCategoryTabs
│   ├── LandMetrics
│   ├── CarbonMetrics
│   ├── WaterMetrics
│   ├── HealthMetrics
│   ├── BiodiversityMetrics
│   ├── JobsMetrics
│   └── EconomicMetrics
│
├── trust/
│   ├── VerificationPanel
│   ├── EvidenceDrawer
│   ├── FreshnessBadge
│   └── MethodologyPanel
│
├── economics/
│   ├── RVEValuePanel
│   ├── RegenerativeAssetCard
│   ├── ImpactValueSankey
│   └── PortfolioValue
│
├── explorer/
│   ├── ProjectImpactTable
│   ├── ProjectRow
│   └── ProjectDetailDrawer
│
└── shared/
    ├── UnitFormatter
    ├── StatusBadge
    ├── EmptyState
    ├── PartialDataState
    └── DataFreshness
```

---

# 31 — TypeScript Domain Model

A normalized impact metric can use a structure like:

```ts
export interface ImpactMetric {
  id: string;
  projectId: string;
  regionId: string;

  domain:
    | "land"
    | "carbon"
    | "water"
    | "health"
    | "biodiversity"
    | "jobs"
    | "economic";

  metric: string;

  value: number;
  unit: string;

  baseline?: number;
  target?: number;

  delta?: number;
  deltaPercent?: number;

  confidence?: number;

  verificationStatus:
    | "verified"
    | "field_validated"
    | "community_reported"
    | "modeled"
    | "estimated"
    | "under_review";

  observedAt: string;
  freshnessHours?: number;
}
```

This model makes confidence, verification, and freshness first-class properties rather than annotations added later.

---

# 32 — Geospatial Model

```ts
export interface ImpactRegion {
  id: string;
  projectId?: string;

  geometry: GeoJSON.Geometry;

  metrics: {
    hectaresRestored?: number;
    carbonRemoved?: number;
    waterRecovery?: number;
    biodiversityIndex?: number;
    jobsCreated?: number;
  };

  verification: {
    level: string;
    confidence: number;
  };
}
```

For large datasets, do not ship raw global geometry to the browser.

Prefer:

```text
Vector Tiles
+
Viewport Queries
+
Layer-Level Fetching
+
Geometry Simplification
```

---

# 33 — Economic Asset Model

```ts
export interface RegenerativeAsset {
  id: string;

  projectId: string;

  assetType:
    | "forest_recovery"
    | "watershed_recovery"
    | "biodiversity"
    | "carbon"
    | "health"
    | "regenerative_land";

  verifiedUplift: number;

  estimatedValue: number;
  riskAdjustedValue?: number;

  liquidity:
    | "high"
    | "medium"
    | "low"
    | "illiquid";

  permanenceConfidence: number;

  marketStatus:
    | "draft"
    | "verified"
    | "listed"
    | "allocated"
    | "retired";
}
```

---

# 34 — Unit & Formatting System

Atlas should have a centralized formatting layer.

The dashboard may simultaneously handle:

```text
hectares
tCO₂e
m³
liters
index scores
people
jobs
percentages
currency
```

Create shared utilities for:

* unit formatting
* significant digits
* locale-aware numbers
* currency conversion
* metric prefixes
* percentage formatting
* date ranges
* confidence formatting

For example:

```text
10,240 ha

2.8M tCO₂e

$38.4M

87% confidence

0.82 ecological uplift
```

Small formatting inconsistencies can destroy trust surprisingly quickly.

---

# 35 — Geospatial Performance

The map is likely to become one of the most computationally expensive parts of the application.

Use:

```text
Vector tiles
Spatial indexing
Viewport-based requests
Geometry clustering
Lazy-loaded layers
Layer virtualization
Memoized selectors
Web Workers for expensive transforms
```

Do not load every polygon and sensor observation at startup.

The browser should receive only what the current viewport and analytical state require.

---

# 36 — Permission-Aware Rendering

Different users should see different levels of detail.

### Public Viewer

```text
Aggregated outcomes
Public project locations
High-level verification
Public methodology
```

### Project Operator

```text
Project metrics
Source diagnostics
Detailed geography
Operational warnings
```

### Institutional Funder

```text
Portfolio performance
Verification evidence
Economic valuation
Risk-adjusted impact
```

### Auditor

```text
Full provenance
Raw evidence metadata
Methodology versions
Verification history
Model outputs
Audit artifacts
```

The backend must enforce authorization.

The frontend should reflect that authorization state rather than treating hidden UI as a security boundary.

---

# 37 — Visualization Principles

Choose visualization based on cognitive purpose.

### Use metric cards for

```text
Headline outcomes
Current state
Period deltas
```

### Use maps for

```text
Spatial distribution
Regional comparison
Project coverage
```

### Use line charts for

```text
Recovery trajectories
Targets
Forecasts
Durability
```

### Use stacked bars for

```text
Impact composition
Portfolio allocation
Category contribution
```

### Use treemaps for

```text
Hierarchical allocation
Project distribution
Sector concentration
```

### Use Sankey diagrams for

```text
Impact → verification → asset → value
```

### Use scatter plots for

```text
Risk vs value
Durability vs cost
Impact vs investment
```

### Use survival/cohort charts for

```text
Restoration durability
Project persistence
Outcome retention
```

Avoid:

```text
3D maps
Decorative gauges
Excessive donuts
Ten-dimensional choropleths
Animation without analytical purpose
```

Motion should explain change, not perform jazz hands.

---

# 38 — Credibility Rules

The dashboard should distinguish carefully between different forms of knowledge.

```text
OBSERVED
Directly measured.

VERIFIED
Independently or methodologically validated.

MODELED
Derived through a defined model.

ESTIMATED
Approximation based on available evidence.

PROJECTED
Forward-looking scenario.

UNAVAILABLE
No sufficiently reliable evidence.
```

These states should never be collapsed into a single green number.

---

# 39 — Regenerative Value Semantics

The economic layer should preserve a strict distinction between:

```text
Physical impact
    ↓
Verified impact
    ↓
Economic representation
    ↓
Market estimate
    ↓
Tradable instrument
```

A hectare restored is not automatically:

> “$X of guaranteed economic value.”

The UI should show where valuation enters the pipeline and what assumptions drive it.

This is essential for institutional trust.

---

# 40 — Recommended User Journeys

## Executive

The executive opens Atlas and immediately sees:

```text
84,200 ha restored

2.8M tCO₂e equivalent

17 watersheds recovering

61,000 jobs created

$38.4M estimated regenerative value

3 projects requiring attention
```

They then inspect:

```text
Which regions improved?
Are annual targets on track?
Where is recovery deteriorating?
```

---

## Project Operator

The operator begins with the map.

```text
Region
  ↓
Project
  ↓
Weak metric
  ↓
Evidence
  ↓
Operational intervention
```

They need diagnosis, not inspirational wallpaper.

---

## Investor / Funder

The investor focuses on:

```text
Verified impact
Durability
Confidence
Economic conversion
Portfolio concentration
Risk
```

The critical requirement is comparability.

---

## Government / Policy Lead

The policy user examines:

```text
District outcomes
Water and infrastructure recovery
Health outcomes
Employment
Budget-to-impact relationships
Geographic equity
```

They need legitimacy and context.

---

# 41 — Accessibility

The regenerative dashboard should remain usable without relying exclusively on color or spatial perception.

Requirements:

* text alternatives for maps
* tabular equivalents for charts
* keyboard-accessible filters
* semantic headings
* visible focus states
* screen-reader labels
* text-based status indicators
* accessible warnings
* non-color verification states

Example:

```text
✓ VERIFIED
⚠ ESTIMATED
! UNDER REVIEW
— NO DATA
```

rather than relying only on colored circles.

---

# 42 — API Architecture

Prefer explicit domain APIs.

```text
GET /impact/summary
GET /impact/regions
GET /impact/projects
GET /impact/projects/:id
GET /impact/timeseries
GET /impact/verification
GET /impact/evidence
GET /impact/assets
GET /impact/portfolio
GET /impact/risks
```

Example:

```json
{
  "region": "rift-valley",
  "period": "12m",
  "metrics": {
    "hectaresRestored": 10240,
    "carbonRemoved": 41200,
    "waterRecovery": 17.2,
    "biodiversityIndex": 0.82,
    "jobsCreated": 6100
  },
  "confidence": 0.87,
  "verification": {
    "satellite": true,
    "fieldSampled": true,
    "thirdPartyAudited": false
  }
}
```

Avoid making the frontend calculate business-critical economic or ecological values from raw fragments.

The frontend should present the domain model.

---

# 43 — Caching & Refresh Strategy

Different data domains have different temporal characteristics.

Example:

```text
Satellite observations     hours / days
Weather                    minutes / hours
Water sensors              minutes / hours
Biodiversity               weeks / months
Health outcomes            weeks / months
Project accounting         days
RVE valuation              variable
```

Cache according to domain rather than applying one global refresh policy.

The interface should expose the last refresh timestamp for important metrics.

---

# 44 — Minimum Viable Version

A strong V1 does not require the entire planetary nervous system.

Ship these first:

```text
1. Filter Bar

2. Six Hero Impact Metrics

3. Regeneration Map

4. Three Core Trend Charts

5. Verification Panel

6. RVE Value Summary

7. Project Impact Table
```

That is enough to establish the product thesis:

```text
Measure
    ↓
Locate
    ↓
Verify
    ↓
Trend
    ↓
Value
```

Everything else can compound around that foundation.

---

# 45 — What Makes Atlas Different

A conventional impact dashboard might report:

```text
Trees planted
Money spent
Projects completed
Participants reached
```

Atlas asks deeper questions:

```text
Did ecosystem function improve?

Did the improvement persist?

How strong is the evidence?

What changed from baseline?

What is the confidence interval?

What risks could reverse the gain?

Can the verified impact be represented economically?

What is the risk-adjusted value?
```

That is the difference between:

> **measuring activity**

and:

> **measuring restorative change.**

---

# 46 — The Frontend North Star

The objective is not to display more impact data.

The objective is:

> **Turn regeneration into something leaders can see, verify, compare, value, and act on.**

The system should make the following loop visible:

```text
                RESTORATION
                     │
                     ↓
                OBSERVATION
                     │
                     ↓
                VERIFICATION
                     │
                     ↓
                DURABILITY
                     │
                     ↓
             REGENERATIVE VALUE
                     │
                     ↓
                  CAPITAL
                     │
                     ↓
            MORE RESTORATION
                     │
                     └───────────────┐
                                     │
                                     ↓
                              COMPOUNDING
                              RECOVERY LOOP
```

That feedback loop is the heart of the dashboard.

Atlas is not merely asking whether a project happened.

It is asking whether the underlying system is **recovering**.

And then it asks the uncomfortable—and economically interesting—question:

> **Can verified recovery become a durable source of value that finances more recovery?**

That is the interface problem.

That is the product.

That is the north star.

---

# Atlas

### **From activity metrics to regenerative intelligence.**

**Observe. Verify. Recover. Value. Compound.**
