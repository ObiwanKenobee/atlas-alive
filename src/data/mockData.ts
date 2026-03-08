// Atlas Regenerative Impact Dashboard — Mock Data Layer
// In production this would come from normalized API endpoints:
// /projects, /regions, /impact_metrics, /time_series, /verification_records, /economic_assets

export type ConfidenceLevel = "satellite" | "field" | "community" | "model" | "audited";
export type TrendDirection = "accelerating" | "stable" | "stalling" | "reversing";
export type DataAvailability = "available" | "estimated" | "unavailable" | "under_review";

// ── Hero Metrics ──────────────────────────────────────────────────────────────
export interface HeroMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  displayValue: string;
  delta: number;
  deltaLabel: string;
  confidence: number;
  trend: TrendDirection;
  color: "recovery" | "water" | "watch" | "reversal" | "accent";
  icon: string;
  sourceType: ConfidenceLevel;
  sparkline: number[];
}

export const heroMetrics: HeroMetric[] = [
  {
    id: "hectares",
    label: "Hectares Restored",
    value: 10240,
    unit: "ha",
    displayValue: "10,240",
    delta: 14.2,
    deltaLabel: "vs last quarter",
    confidence: 0.87,
    trend: "accelerating",
    color: "recovery",
    icon: "🌿",
    sourceType: "satellite",
    sparkline: [42, 48, 51, 58, 62, 70, 75, 82, 88, 95, 100, 107],
  },
  {
    id: "carbon",
    label: "Net Carbon Removed",
    value: 284600,
    unit: "t CO₂e",
    displayValue: "284.6K",
    delta: 9.1,
    deltaLabel: "vs last quarter",
    confidence: 0.91,
    trend: "accelerating",
    color: "recovery",
    icon: "🌀",
    sourceType: "audited",
    sparkline: [30, 38, 44, 50, 55, 60, 68, 74, 80, 88, 94, 100],
  },
  {
    id: "water",
    label: "Water Systems Recovered",
    value: 47,
    unit: "systems",
    displayValue: "47",
    delta: 6.8,
    deltaLabel: "vs last quarter",
    confidence: 0.74,
    trend: "stable",
    color: "water",
    icon: "💧",
    sourceType: "field",
    sparkline: [55, 58, 60, 63, 65, 68, 70, 72, 75, 80, 85, 100],
  },
  {
    id: "lives",
    label: "Lives Improved",
    value: 128400,
    unit: "people",
    displayValue: "128.4K",
    delta: -2.3,
    deltaLabel: "vs last quarter",
    confidence: 0.61,
    trend: "stalling",
    color: "watch",
    icon: "🫀",
    sourceType: "community",
    sparkline: [80, 90, 95, 105, 108, 110, 112, 108, 105, 100, 98, 97],
  },
  {
    id: "biodiversity",
    label: "Biodiversity Recovery Index",
    value: 0.73,
    unit: "index",
    displayValue: "0.73",
    delta: 5.8,
    deltaLabel: "vs last quarter",
    confidence: 0.68,
    trend: "accelerating",
    color: "recovery",
    icon: "🦋",
    sourceType: "model",
    sparkline: [40, 45, 48, 52, 57, 63, 68, 72, 78, 83, 90, 100],
  },
  {
    id: "jobs",
    label: "Regenerative Jobs Created",
    value: 8920,
    unit: "jobs",
    displayValue: "8,920",
    delta: 22.4,
    deltaLabel: "vs last quarter",
    confidence: 0.82,
    trend: "accelerating",
    color: "accent",
    icon: "🤝",
    sourceType: "field",
    sparkline: [20, 28, 35, 42, 52, 60, 68, 75, 82, 90, 95, 100],
  },
];

// ── Time Series Data ──────────────────────────────────────────────────────────
export interface TimeSeriesPoint {
  period: string;
  actual: number;
  target: number;
  forecast?: number;
  lower?: number;
  upper?: number;
}

export const hectaresTimeSeries: TimeSeriesPoint[] = [
  { period: "Jan '24", actual: 4200, target: 4500, lower: 3900, upper: 4500 },
  { period: "Feb '24", actual: 4800, target: 5000, lower: 4400, upper: 5200 },
  { period: "Mar '24", actual: 5400, target: 5500, lower: 5000, upper: 5800 },
  { period: "Apr '24", actual: 5900, target: 6000, lower: 5500, upper: 6300 },
  { period: "May '24", actual: 6700, target: 6500, lower: 6200, upper: 7200 },
  { period: "Jun '24", actual: 7200, target: 7000, lower: 6700, upper: 7700 },
  { period: "Jul '24", actual: 7800, target: 7500, lower: 7300, upper: 8300 },
  { period: "Aug '24", actual: 8400, target: 8000, lower: 7800, upper: 8900 },
  { period: "Sep '24", actual: 8900, target: 8500, lower: 8300, upper: 9400 },
  { period: "Oct '24", actual: 9400, target: 9000, lower: 8800, upper: 9900 },
  { period: "Nov '24", actual: 9800, target: 9500, lower: 9200, upper: 10400 },
  { period: "Dec '24", actual: 10240, target: 10000, lower: 9600, upper: 10900 },
  { period: "Jan '25", actual: undefined as unknown as number, target: 10500, forecast: 10800, lower: 9900, upper: 11700 },
  { period: "Feb '25", actual: undefined as unknown as number, target: 11000, forecast: 11400, lower: 10400, upper: 12400 },
  { period: "Mar '25", actual: undefined as unknown as number, target: 11500, forecast: 12100, lower: 11000, upper: 13200 },
];

export const carbonTimeSeries: TimeSeriesPoint[] = [
  { period: "Jan '24", actual: 180000, target: 200000, lower: 160000, upper: 200000 },
  { period: "Feb '24", actual: 198000, target: 210000, lower: 178000, upper: 218000 },
  { period: "Mar '24", actual: 210000, target: 220000, lower: 190000, upper: 230000 },
  { period: "Apr '24", actual: 224000, target: 230000, lower: 204000, upper: 244000 },
  { period: "May '24", actual: 238000, target: 240000, lower: 218000, upper: 258000 },
  { period: "Jun '24", actual: 248000, target: 250000, lower: 228000, upper: 268000 },
  { period: "Jul '24", actual: 258000, target: 260000, lower: 238000, upper: 278000 },
  { period: "Aug '24", actual: 266000, target: 265000, lower: 246000, upper: 286000 },
  { period: "Sep '24", actual: 272000, target: 270000, lower: 252000, upper: 292000 },
  { period: "Oct '24", actual: 278000, target: 275000, lower: 258000, upper: 298000 },
  { period: "Nov '24", actual: 281000, target: 280000, lower: 261000, upper: 301000 },
  { period: "Dec '24", actual: 284600, target: 285000, lower: 264600, upper: 304600 },
];

export const waterTimeSeries: TimeSeriesPoint[] = [
  { period: "Jan '24", actual: 28, target: 30, lower: 24, upper: 32 },
  { period: "Mar '24", actual: 32, target: 34, lower: 28, upper: 36 },
  { period: "May '24", actual: 36, target: 37, lower: 32, upper: 40 },
  { period: "Jul '24", actual: 39, target: 40, lower: 35, upper: 43 },
  { period: "Sep '24", actual: 43, target: 43, lower: 39, upper: 47 },
  { period: "Nov '24", actual: 45, target: 46, lower: 41, upper: 49 },
  { period: "Dec '24", actual: 47, target: 48, lower: 43, upper: 51 },
];

// ── Map Zones ──────────────────────────────────────────────────────────────────
export interface MapZone {
  id: string;
  name: string;
  region: string;
  country: string;
  type: "forest" | "watershed" | "biodiversity" | "health" | "employment" | "carbon";
  status: "recovering" | "stable" | "stalling" | "reversing";
  confidence: number;
  hectares?: number;
  projects: number;
  primaryMetric: string;
  primaryValue: string;
  coordinates: { x: number; y: number };
  size: "sm" | "md" | "lg";
}

export const mapZones: MapZone[] = [
  { id: "mz1", name: "Mau Forest Complex", region: "Rift Valley", country: "Kenya", type: "forest", status: "recovering", confidence: 0.88, hectares: 2400, projects: 4, primaryMetric: "Forest Cover", primaryValue: "+18% in 18 months", coordinates: { x: 52, y: 44 }, size: "lg" },
  { id: "mz2", name: "Tana River Watershed", region: "Eastern", country: "Kenya", type: "watershed", status: "recovering", confidence: 0.74, hectares: 580, projects: 2, primaryMetric: "River Flow", primaryValue: "+32% baseline recovery", coordinates: { x: 60, y: 50 }, size: "md" },
  { id: "mz3", name: "Lake Victoria Basin", region: "Nyanza", country: "Kenya", type: "watershed", status: "stable", confidence: 0.91, hectares: 1200, projects: 6, primaryMetric: "Water Quality", primaryValue: "0.81 index score", coordinates: { x: 46, y: 48 }, size: "lg" },
  { id: "mz4", name: "Amboseli Corridor", region: "Kajiado", country: "Kenya", type: "biodiversity", status: "recovering", confidence: 0.65, hectares: 340, projects: 3, primaryMetric: "Species Richness", primaryValue: "+12 species observed", coordinates: { x: 55, y: 55 }, size: "md" },
  { id: "mz5", name: "Nairobi North Clinics", region: "Nairobi", country: "Kenya", type: "health", status: "stalling", confidence: 0.58, hectares: undefined, projects: 8, primaryMetric: "Access Coverage", primaryValue: "38,400 served", coordinates: { x: 54, y: 51 }, size: "sm" },
  { id: "mz6", name: "Mount Elgon Reforestation", region: "Western", country: "Kenya", type: "forest", status: "recovering", confidence: 0.82, hectares: 1800, projects: 3, primaryMetric: "Canopy Density", primaryValue: "0.74 restored", coordinates: { x: 44, y: 40 }, size: "lg" },
  { id: "mz7", name: "Sahel Agroforestry Belt", region: "Sahel", country: "Niger", type: "carbon", status: "accelerating" as unknown as "recovering", confidence: 0.79, hectares: 3200, projects: 5, primaryMetric: "Carbon Seq.", primaryValue: "42,000 t CO₂e/yr", coordinates: { x: 32, y: 22 }, size: "lg" },
  { id: "mz8", name: "Congo Basin Restoration", region: "Équateur", country: "DRC", type: "forest", status: "recovering", confidence: 0.71, hectares: 4100, projects: 7, primaryMetric: "Forest Integrity", primaryValue: "0.68 → 0.79", coordinates: { x: 38, y: 54 }, size: "lg" },
  { id: "mz9", name: "Okavango Delta", region: "Ngamiland", country: "Botswana", type: "watershed", status: "stable", confidence: 0.85, hectares: 890, projects: 2, primaryMetric: "Wetland Cover", primaryValue: "12,400 ha maintained", coordinates: { x: 44, y: 72 }, size: "md" },
  { id: "mz10", name: "Rift Valley Employment Hub", region: "Rift Valley", country: "Kenya", type: "employment", status: "recovering", confidence: 0.77, projects: 12, primaryMetric: "Jobs Created", primaryValue: "2,840 regenerative", coordinates: { x: 50, y: 46 }, size: "sm" },
];

// ── Projects Table ─────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  region: string;
  country: string;
  type: string;
  baseline: string;
  current: string;
  confidence: number;
  valueEstimate: string;
  trend: TrendDirection;
  riskLevel: "low" | "medium" | "high";
  lastVerified: string;
  status: "active" | "watch" | "critical";
}

export const projects: Project[] = [
  { id: "p1", name: "Mau Forest Restoration Phase II", region: "Rift Valley", country: "Kenya", type: "Forest", baseline: "22% canopy", current: "41% canopy", confidence: 0.88, valueEstimate: "$4.2M", trend: "accelerating", riskLevel: "low", lastVerified: "7 days ago", status: "active" },
  { id: "p2", name: "Tana River Revitalization", region: "Eastern Kenya", country: "Kenya", type: "Water", baseline: "0.38 flow index", current: "0.61 flow index", confidence: 0.74, valueEstimate: "$1.8M", trend: "stable", riskLevel: "medium", lastVerified: "14 days ago", status: "active" },
  { id: "p3", name: "Congo Basin Carbon Sink", region: "Équateur Province", country: "DRC", type: "Carbon", baseline: "0.51 integrity", current: "0.74 integrity", confidence: 0.71, valueEstimate: "$8.6M", trend: "accelerating", riskLevel: "medium", lastVerified: "21 days ago", status: "active" },
  { id: "p4", name: "Sahel Farmer Managed Regen", region: "Zinder Region", country: "Niger", type: "Land + Carbon", baseline: "1,200 ha recovered", current: "4,400 ha recovered", confidence: 0.79, valueEstimate: "$3.1M", trend: "accelerating", riskLevel: "low", lastVerified: "5 days ago", status: "active" },
  { id: "p5", name: "Nairobi Urban Health Initiative", region: "Nairobi", country: "Kenya", type: "Health", baseline: "42% clinic access", current: "61% clinic access", confidence: 0.58, valueEstimate: "$0.9M", trend: "stalling", riskLevel: "high", lastVerified: "90 days ago", status: "watch" },
  { id: "p6", name: "Amboseli Biodiversity Corridor", region: "Kajiado", country: "Kenya", type: "Biodiversity", baseline: "BRI: 0.44", current: "BRI: 0.62", confidence: 0.65, valueEstimate: "$2.2M", trend: "stable", riskLevel: "medium", lastVerified: "30 days ago", status: "active" },
  { id: "p7", name: "Okavango Wetland Maintenance", region: "Ngamiland", country: "Botswana", type: "Water", baseline: "11,200 ha wetland", current: "12,400 ha wetland", confidence: 0.85, valueEstimate: "$5.4M", trend: "stable", riskLevel: "low", lastVerified: "10 days ago", status: "active" },
  { id: "p8", name: "Mt Elgon Agroforestry", region: "Western Kenya", country: "Kenya", type: "Forest + Jobs", baseline: "820 farm participants", current: "2,840 farm participants", confidence: 0.82, valueEstimate: "$1.5M", trend: "accelerating", riskLevel: "low", lastVerified: "3 days ago", status: "active" },
];

// ── Verification Records ───────────────────────────────────────────────────────
export const verificationSummary = {
  satelliteVerified: { count: 14, coverage: 0.82, lastUpdate: "48h ago" },
  fieldSampled: { count: 9, coverage: 0.61, lastUpdate: "7 days ago" },
  communityReported: { count: 22, coverage: 0.44, lastUpdate: "24h ago" },
  aiInferred: { count: 18, coverage: 0.78, lastUpdate: "6h ago" },
  thirdPartyAudited: { count: 5, coverage: 0.91, lastUpdate: "30 days ago" },
  methodologyVersion: "v2.4.1",
  lastAuditDate: "2024-11-15",
  overallConfidence: 0.76,
};

// ── RVE Economic Assets ────────────────────────────────────────────────────────
export interface RVEAsset {
  id: string;
  name: string;
  type: string;
  hectares?: number;
  ecologicalUplift: number;
  carbonEquivalent: string;
  biodiversityMultiplier: number;
  estimatedValue: string;
  liquidityStatus: "liquid" | "semi-liquid" | "illiquid";
  permanenceRisk: "low" | "medium" | "high";
  verifiedUnits: string;
  buyers: number;
  yieldProjection: string;
}

export const rveAssets: RVEAsset[] = [
  {
    id: "rve1",
    name: "Forest Recovery Asset — Mau Complex",
    type: "Ecosystem Recovery Certificate",
    hectares: 10000,
    ecologicalUplift: 0.82,
    carbonEquivalent: "142,400 t CO₂e",
    biodiversityMultiplier: 1.3,
    estimatedValue: "$14.2M",
    liquidityStatus: "semi-liquid",
    permanenceRisk: "low",
    verifiedUnits: "10,240 ERC units",
    buyers: 3,
    yieldProjection: "+8.4% / yr",
  },
  {
    id: "rve2",
    name: "Watershed Recovery Unit — Tana Basin",
    type: "Hydrological Restoration Bond",
    hectares: 1780,
    ecologicalUplift: 0.61,
    carbonEquivalent: "28,900 t CO₂e",
    biodiversityMultiplier: 1.1,
    estimatedValue: "$3.8M",
    liquidityStatus: "illiquid",
    permanenceRisk: "medium",
    verifiedUnits: "1,780 HRB units",
    buyers: 1,
    yieldProjection: "+5.2% / yr",
  },
  {
    id: "rve3",
    name: "Sahel Carbon Sequestration Pool",
    type: "Removal Credit",
    hectares: 3200,
    ecologicalUplift: 0.74,
    carbonEquivalent: "84,000 t CO₂e",
    biodiversityMultiplier: 1.2,
    estimatedValue: "$6.7M",
    liquidityStatus: "liquid",
    permanenceRisk: "low",
    verifiedUnits: "84,000 RC units",
    buyers: 7,
    yieldProjection: "+11.2% / yr",
  },
];

// ── Category breakdown data ────────────────────────────────────────────────────
export const categoryData = {
  land: [
    { label: "Hectares Restored", value: "10,240 ha", change: "+14.2%", status: "recovery" as const, confidence: 0.87 },
    { label: "Soil Health Score", value: "0.71 / 1.0", change: "+0.08", status: "recovery" as const, confidence: 0.72 },
    { label: "Vegetation Density", value: "68% cover", change: "+7.4%", status: "recovery" as const, confidence: 0.85 },
    { label: "Desertification Reversal", value: "1,840 ha", change: "+22%", status: "recovery" as const, confidence: 0.68 },
    { label: "Restoration Survival Rate", value: "81%", change: "+3.2pp", status: "recovery" as const, confidence: 0.91 },
  ],
  carbon: [
    { label: "Carbon Removed", value: "284.6K t CO₂e", change: "+9.1%", status: "recovery" as const, confidence: 0.91 },
    { label: "Avoided Emissions", value: "42,100 t CO₂e", change: "+6.4%", status: "recovery" as const, confidence: 0.78 },
    { label: "Sequestration Velocity", value: "23,700 t/yr", change: "+18%", status: "recovery" as const, confidence: 0.74 },
    { label: "Permanence Confidence", value: "0.88", change: "stable", status: "watch" as const, confidence: 0.88 },
    { label: "Leakage Risk", value: "Low (0.12)", change: "-0.03", status: "recovery" as const, confidence: 0.71 },
  ],
  water: [
    { label: "River Flow Recovery", value: "47 systems", change: "+6.8%", status: "recovery" as const, confidence: 0.74 },
    { label: "Wetland Restoration", value: "12,400 ha", change: "+8.2%", status: "recovery" as const, confidence: 0.81 },
    { label: "Groundwater Recharge", value: "+18% indicator", change: "+18%", status: "recovery" as const, confidence: 0.61 },
    { label: "Water Quality Score", value: "0.68 index", change: "+0.11", status: "recovery" as const, confidence: 0.77 },
    { label: "Flood Resilience Effect", value: "Moderate", change: "improving", status: "watch" as const, confidence: 0.55 },
  ],
  health: [
    { label: "Lives Improved", value: "128,400", change: "-2.3%", status: "watch" as const, confidence: 0.61 },
    { label: "Clinic Access Change", value: "+19pp coverage", change: "+19pp", status: "recovery" as const, confidence: 0.68 },
    { label: "Morbidity Reduction", value: "Estimated 14%", change: "model estimate", status: "watch" as const, confidence: 0.44 },
    { label: "Vaccination Continuity", value: "74% rate", change: "+4pp", status: "recovery" as const, confidence: 0.72 },
    { label: "Sanitation-Linked Outcomes", value: "Under review", change: "—", status: "watch" as const, confidence: 0.0 },
  ],
  biodiversity: [
    { label: "Species Richness Proxy", value: "+12 species", change: "+22%", status: "recovery" as const, confidence: 0.65 },
    { label: "Habitat Connectivity", value: "0.58 score", change: "+0.12", status: "recovery" as const, confidence: 0.62 },
    { label: "Pollinator Return Index", value: "0.71", change: "+0.09", status: "recovery" as const, confidence: 0.58 },
    { label: "Ecosystem Integrity Score", value: "0.73", change: "+0.08", status: "recovery" as const, confidence: 0.68 },
  ],
  jobs: [
    { label: "Regenerative Jobs Created", value: "8,920", change: "+22.4%", status: "recovery" as const, confidence: 0.82 },
    { label: "Local Enterprise Participation", value: "312 enterprises", change: "+18%", status: "recovery" as const, confidence: 0.77 },
    { label: "Youth Employment", value: "34% of total", change: "+6pp", status: "recovery" as const, confidence: 0.74 },
    { label: "Income Uplift", value: "+28% median", change: "+28%", status: "recovery" as const, confidence: 0.61 },
    { label: "Supply Chain Inclusion", value: "41 local suppliers", change: "+8", status: "recovery" as const, confidence: 0.68 },
  ],
};
