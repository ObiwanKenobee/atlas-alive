import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { projects as mockProjects } from "@/data/mockData";
import type { Project } from "@/data/mockData";

type DbProject = Database["public"]["Tables"]["projects"]["Row"];

function dbToProject(p: DbProject): Project {
  const daysSince = p.last_verified
    ? Math.floor((Date.now() - new Date(p.last_verified).getTime()) / 86400000)
    : null;
  const lastVerified = daysSince === null
    ? "Not verified"
    : daysSince === 0 ? "Today"
    : daysSince === 1 ? "1 day ago"
    : `${daysSince} days ago`;

  return {
    id: p.id,
    name: p.name,
    region: p.region,
    country: p.country,
    type: p.type,
    baseline: p.baseline,
    current: p.current_state,
    confidence: p.confidence,
    valueEstimate: p.value_estimate ?? "—",
    trend: p.trend,
    riskLevel: p.risk_level,
    lastVerified,
    status: p.status,
  };
}

export function useProjects(region?: string) {
  return useQuery({
    queryKey: ["projects", region],
    queryFn: async () => {
      let query = supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (region && region !== "All Regions") {
        // Try matching on region column
        const regionPart = region.split("—")[1]?.trim();
        if (regionPart) {
          query = query.ilike("region", `%${regionPart}%`);
        }
      }
      const { data, error } = await query;
      if (error) throw error;

      // If no live data yet, fall through to mock
      if (!data || data.length === 0) {
        const filtered = region && region !== "All Regions"
          ? mockProjects.filter(p =>
              region.includes(p.country) ||
              region.toLowerCase().includes(p.region.toLowerCase()) ||
              p.region.toLowerCase().includes(region.split("—")[1]?.trim().toLowerCase() ?? "")
            )
          : mockProjects;
        return filtered;
      }

      return data.map(dbToProject);
    },
    staleTime: 30_000,
  });
}
