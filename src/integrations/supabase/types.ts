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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          operation: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      footer_templates: {
        Row: {
          created_at: string
          description: string | null
          full_image_url: string | null
          id: string
          is_default: boolean | null
          layout_config: Json
          logo_url: string | null
          name: string
          template_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          full_image_url?: string | null
          id?: string
          is_default?: boolean | null
          layout_config?: Json
          logo_url?: string | null
          name: string
          template_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          full_image_url?: string | null
          id?: string
          is_default?: boolean | null
          layout_config?: Json
          logo_url?: string | null
          name?: string
          template_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      general_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      page_footers: {
        Row: {
          created_at: string
          footer_template_id: string | null
          id: string
          is_enabled: boolean | null
          page_id: string
          page_number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          footer_template_id?: string | null
          id?: string
          is_enabled?: boolean | null
          page_id: string
          page_number: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          footer_template_id?: string | null
          id?: string
          is_enabled?: boolean | null
          page_id?: string
          page_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_footers_footer_template_id_fkey"
            columns: ["footer_template_id"]
            isOneToOne: false
            referencedRelation: "footer_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_pages: {
        Row: {
          background_image_url: string | null
          content: Json
          created_at: string
          id: string
          image1_url: string | null
          image2_url: string | null
          layout_history: Json | null
          layout_version: number | null
          middle_image_url: string | null
          page_name: string
          page_number: number
          previous_layout: Json | null
          updated_at: string
        }
        Insert: {
          background_image_url?: string | null
          content?: Json
          created_at?: string
          id?: string
          image1_url?: string | null
          image2_url?: string | null
          layout_history?: Json | null
          layout_version?: number | null
          middle_image_url?: string | null
          page_name: string
          page_number: number
          previous_layout?: Json | null
          updated_at?: string
        }
        Update: {
          background_image_url?: string | null
          content?: Json
          created_at?: string
          id?: string
          image1_url?: string | null
          image2_url?: string | null
          layout_history?: Json | null
          layout_version?: number | null
          middle_image_url?: string | null
          page_name?: string
          page_number?: number
          previous_layout?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sector_configs: {
        Row: {
          created_at: string
          description: string
          header_text: string | null
          id: string
          multiple: number
          name: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          header_text?: string | null
          id: string
          multiple: number
          name: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          header_text?: string | null
          id?: string
          multiple?: number
          name?: string
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      valuation_requests: {
        Row: {
          average_yearly_investment: number | null
          contact_company: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          employees: number | null
          employees_display: string | null
          expected_result_2025: number | null
          id: string
          largest_client_dependency: number | null
          largest_client_dependency_display: string | null
          largest_supplier_dependency: string | null
          multiplier: number | null
          prospects: string | null
          recurring_revenue: number | null
          recurring_revenue_display: string | null
          result_current_year: number | null
          result_previous_year: number | null
          revenue: number | null
          revenue_range_display: string | null
          sector: string | null
          updated_at: string
          valuation_amount: number | null
          valuation_range_max: number | null
          valuation_range_min: number | null
          was_lossmaking: boolean | null
        }
        Insert: {
          average_yearly_investment?: number | null
          contact_company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          employees?: number | null
          employees_display?: string | null
          expected_result_2025?: number | null
          id?: string
          largest_client_dependency?: number | null
          largest_client_dependency_display?: string | null
          largest_supplier_dependency?: string | null
          multiplier?: number | null
          prospects?: string | null
          recurring_revenue?: number | null
          recurring_revenue_display?: string | null
          result_current_year?: number | null
          result_previous_year?: number | null
          revenue?: number | null
          revenue_range_display?: string | null
          sector?: string | null
          updated_at?: string
          valuation_amount?: number | null
          valuation_range_max?: number | null
          valuation_range_min?: number | null
          was_lossmaking?: boolean | null
        }
        Update: {
          average_yearly_investment?: number | null
          contact_company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          employees?: number | null
          employees_display?: string | null
          expected_result_2025?: number | null
          id?: string
          largest_client_dependency?: number | null
          largest_client_dependency_display?: string | null
          largest_supplier_dependency?: string | null
          multiplier?: number | null
          prospects?: string | null
          recurring_revenue?: number | null
          recurring_revenue_display?: string | null
          result_current_year?: number | null
          result_previous_year?: number | null
          revenue?: number | null
          revenue_range_display?: string | null
          sector?: string | null
          updated_at?: string
          valuation_amount?: number | null
          valuation_range_max?: number | null
          valuation_range_min?: number | null
          was_lossmaking?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
