import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type MetricInsert = Database["public"]["Tables"]["impact_metrics"]["Insert"];
type VerificationInsert = Database["public"]["Tables"]["verification_records"]["Insert"];

export function useSubmitImpactMetric() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: MetricInsert) => {
      const { data, error } = await supabase
        .from("impact_metrics")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useSubmitVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VerificationInsert) => {
      const { data, error } = await supabase
        .from("verification_records")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["verification"] }),
  });
}

export function useUpdateProjectStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      updates,
    }: {
      projectId: string;
      updates: Database["public"]["Tables"]["projects"]["Update"];
    }) => {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", projectId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}
