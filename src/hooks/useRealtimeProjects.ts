import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RealtimeStatus {
  /** Total DB change events received this session */
  updateCount: number;
  /** Timestamp of the last received change, or null if none yet */
  lastUpdate: Date | null;
  /** Whether the realtime channel is actively connected */
  connected: boolean;
}

/**
 * Subscribes to realtime changes on core tables.
 * Returns live status info for the FilterBar indicator.
 */
export function useRealtimeProjects(): RealtimeStatus {
  const qc = useQueryClient();
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [connected, setConnected] = useState(false);

  const bump = useCallback(() => {
    setUpdateCount((n) => n + 1);
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("atlas-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => {
          qc.invalidateQueries({ queryKey: ["projects"] });
          bump();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "impact_metrics" },
        () => {
          qc.invalidateQueries({ queryKey: ["projects"] });
          qc.invalidateQueries({ queryKey: ["impact_metrics"] });
          bump();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "verification_records" },
        () => {
          qc.invalidateQueries({ queryKey: ["verification_records"] });
          bump();
        }
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc, bump]);

  return { updateCount, lastUpdate, connected };
}
