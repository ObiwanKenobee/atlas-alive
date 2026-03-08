export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      impact_metrics: {
        Row: {
          availability: Database["public"]["Enums"]["data_availability"]
          confidence: number
          created_at: string
          id: string
          metric_type: string
          notes: string | null
          period_end: string | null
          period_start: string | null
          project_id: string
          source_type: Database["public"]["Enums"]["confidence_level"]
          submitted_by: string | null
          unit: string
          updated_at: string
          value: number
        }
        Insert: {
          availability?: Database["public"]["Enums"]["data_availability"]
          confidence?: number
          created_at?: string
          id?: string
          metric_type: string
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          project_id: string
          source_type?: Database["public"]["Enums"]["confidence_level"]
          submitted_by?: string | null
          unit: string
          updated_at?: string
          value: number
        }
        Update: {
          availability?: Database["public"]["Enums"]["data_availability"]
          confidence?: number
          created_at?: string
          id?: string
          metric_type?: string
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          project_id?: string
          source_type?: Database["public"]["Enums"]["confidence_level"]
          submitted_by?: string | null
          unit?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "impact_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          organisation: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          organisation?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          organisation?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          baseline: string
          confidence: number
          country: string
          created_at: string
          current_state: string
          district: string | null
          id: string
          last_verified: string | null
          name: string
          notes: string | null
          operator_id: string | null
          region: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          status: Database["public"]["Enums"]["project_status"]
          trend: Database["public"]["Enums"]["trend_direction"]
          type: string
          updated_at: string
          value_estimate: string | null
        }
        Insert: {
          baseline: string
          confidence?: number
          country: string
          created_at?: string
          current_state: string
          district?: string | null
          id?: string
          last_verified?: string | null
          name: string
          notes?: string | null
          operator_id?: string | null
          region: string
          risk_level?: Database["public"]["Enums"]["risk_level"]
          status?: Database["public"]["Enums"]["project_status"]
          trend?: Database["public"]["Enums"]["trend_direction"]
          type: string
          updated_at?: string
          value_estimate?: string | null
        }
        Update: {
          baseline?: string
          confidence?: number
          country?: string
          created_at?: string
          current_state?: string
          district?: string | null
          id?: string
          last_verified?: string | null
          name?: string
          notes?: string | null
          operator_id?: string | null
          region?: string
          risk_level?: Database["public"]["Enums"]["risk_level"]
          status?: Database["public"]["Enums"]["project_status"]
          trend?: Database["public"]["Enums"]["trend_direction"]
          type?: string
          updated_at?: string
          value_estimate?: string | null
        }
        Relationships: []
      }
      time_series: {
        Row: {
          actual: number | null
          created_at: string
          forecast: number | null
          id: string
          lower_bound: number | null
          metric_type: string
          period: string
          period_date: string
          project_id: string | null
          target: number | null
          upper_bound: number | null
        }
        Insert: {
          actual?: number | null
          created_at?: string
          forecast?: number | null
          id?: string
          lower_bound?: number | null
          metric_type: string
          period: string
          period_date: string
          project_id?: string | null
          target?: number | null
          upper_bound?: number | null
        }
        Update: {
          actual?: number | null
          created_at?: string
          forecast?: number | null
          id?: string
          lower_bound?: number | null
          metric_type?: string
          period?: string
          period_date?: string
          project_id?: string | null
          target?: number | null
          upper_bound?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "time_series_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_records: {
        Row: {
          coverage: number | null
          created_at: string
          evidence_urls: string[] | null
          id: string
          last_verified_at: string | null
          methodology_version: string | null
          next_review_at: string | null
          notes: string | null
          project_id: string
          submitted_by: string | null
          updated_at: string
          verification_type: Database["public"]["Enums"]["confidence_level"]
          verifier_name: string | null
        }
        Insert: {
          coverage?: number | null
          created_at?: string
          evidence_urls?: string[] | null
          id?: string
          last_verified_at?: string | null
          methodology_version?: string | null
          next_review_at?: string | null
          notes?: string | null
          project_id: string
          submitted_by?: string | null
          updated_at?: string
          verification_type: Database["public"]["Enums"]["confidence_level"]
          verifier_name?: string | null
        }
        Update: {
          coverage?: number | null
          created_at?: string
          evidence_urls?: string[] | null
          id?: string
          last_verified_at?: string | null
          methodology_version?: string | null
          next_review_at?: string | null
          notes?: string | null
          project_id?: string
          submitted_by?: string | null
          updated_at?: string
          verification_type?: Database["public"]["Enums"]["confidence_level"]
          verifier_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_records_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_primary_role: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "executive" | "operator" | "investor" | "government" | "admin"
      confidence_level:
        | "satellite"
        | "field"
        | "community"
        | "model"
        | "audited"
      data_availability:
        | "available"
        | "estimated"
        | "unavailable"
        | "under_review"
      project_status: "active" | "watch" | "critical"
      risk_level: "low" | "medium" | "high"
      trend_direction: "accelerating" | "stable" | "stalling" | "reversing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["executive", "operator", "investor", "government", "admin"],
      confidence_level: ["satellite", "field", "community", "model", "audited"],
      data_availability: [
        "available",
        "estimated",
        "unavailable",
        "under_review",
      ],
      project_status: ["active", "watch", "critical"],
      risk_level: ["low", "medium", "high"],
      trend_direction: ["accelerating", "stable", "stalling", "reversing"],
    },
  },
} as const
