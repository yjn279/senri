export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      daily_goals: {
        Row: {
          completed: boolean
          created: string
          day: number
          id: string
          lifeGoalId: string | null
          monthlyGoalId: string | null
          updated: string
          yearlyGoalId: string | null
        }
        Insert: {
          completed?: boolean
          created?: string
          day: number
          id: string
          lifeGoalId?: string | null
          monthlyGoalId?: string | null
          updated?: string
          yearlyGoalId?: string | null
        }
        Update: {
          completed?: boolean
          created?: string
          day?: number
          id?: string
          lifeGoalId?: string | null
          monthlyGoalId?: string | null
          updated?: string
          yearlyGoalId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_goals_lifeGoalId_fkey"
            columns: ["lifeGoalId"]
            isOneToOne: false
            referencedRelation: "life_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_goals_monthlyGoalId_fkey"
            columns: ["monthlyGoalId"]
            isOneToOne: false
            referencedRelation: "monthly_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_goals_yearlyGoalId_fkey"
            columns: ["yearlyGoalId"]
            isOneToOne: false
            referencedRelation: "yearly_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      life_goals: {
        Row: {
          category: string
          created: string
          id: string
          title: string
          updated: string
          userId: string
        }
        Insert: {
          category: string
          created?: string
          id: string
          title: string
          updated?: string
          userId: string
        }
        Update: {
          category?: string
          created?: string
          id?: string
          title?: string
          updated?: string
          userId?: string
        }
        Relationships: []
      }
      monthly_goals: {
        Row: {
          created: string
          id: string
          lifeGoalId: string | null
          month: number
          title: string
          updated: string
          yearlyGoalId: string | null
        }
        Insert: {
          created?: string
          id: string
          lifeGoalId?: string | null
          month: number
          title: string
          updated?: string
          yearlyGoalId?: string | null
        }
        Update: {
          created?: string
          id?: string
          lifeGoalId?: string | null
          month?: number
          title?: string
          updated?: string
          yearlyGoalId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_goals_lifeGoalId_fkey"
            columns: ["lifeGoalId"]
            isOneToOne: false
            referencedRelation: "life_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_goals_yearlyGoalId_fkey"
            columns: ["yearlyGoalId"]
            isOneToOne: false
            referencedRelation: "yearly_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      yearly_goals: {
        Row: {
          created: string
          id: string
          lifeGoalId: string | null
          title: string
          updated: string
          year: number
        }
        Insert: {
          created?: string
          id: string
          lifeGoalId?: string | null
          title: string
          updated?: string
          year: number
        }
        Update: {
          created?: string
          id?: string
          lifeGoalId?: string | null
          title?: string
          updated?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "yearly_goals_lifeGoalId_fkey"
            columns: ["lifeGoalId"]
            isOneToOne: false
            referencedRelation: "life_goals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
