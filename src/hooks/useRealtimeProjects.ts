import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to realtime changes on the `projects` and `impact_metrics` tables.
 * When a change is detected, invalidates the relevant React Query caches so that
 * all connected viewers see fresh data without a page refresh.
 */
export function useRealtimeProjects() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("atlas-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => {
          qc.invalidateQueries({ queryKey: ["projects"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "impact_metrics" },
        () => {
          qc.invalidateQueries({ queryKey: ["projects"] });
          qc.invalidateQueries({ queryKey: ["impact_metrics"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "verification_records" },
        () => {
          qc.invalidateQueries({ queryKey: ["verification_records"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
}
