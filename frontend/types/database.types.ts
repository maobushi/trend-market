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
      market: {
        Row: {
          contract_id: number | null
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          llm_a: string | null
          llm_c: string | null
          lln_b: string | null
          no_price: number | null
          oracles: string | null
          providers: string | null
          title: string | null
          total_volume: number | null
          yes_price: number | null
        }
        Insert: {
          contract_id?: number | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          llm_a?: string | null
          llm_c?: string | null
          lln_b?: string | null
          no_price?: number | null
          oracles?: string | null
          providers?: string | null
          title?: string | null
          total_volume?: number | null
          yes_price?: number | null
        }
        Update: {
          contract_id?: number | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          llm_a?: string | null
          llm_c?: string | null
          lln_b?: string | null
          no_price?: number | null
          oracles?: string | null
          providers?: string | null
          title?: string | null
          total_volume?: number | null
          yes_price?: number | null
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string | null
          description: string | null
          id: string
          llm_a: string | null
          llm_b: string | null
          llm_c: string | null
          market_uuid: string | null
          provider: string | null
          provider_link: string | null
          published_at: string
          title: string | null
          view: number | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: string
          llm_a?: string | null
          llm_b?: string | null
          llm_c?: string | null
          market_uuid?: string | null
          provider?: string | null
          provider_link?: string | null
          published_at: string
          title?: string | null
          view?: number | null
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: string
          llm_a?: string | null
          llm_b?: string | null
          llm_c?: string | null
          market_uuid?: string | null
          provider?: string | null
          provider_link?: string | null
          published_at?: string
          title?: string | null
          view?: number | null
        }
        Relationships: []
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
