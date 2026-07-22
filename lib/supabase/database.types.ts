// Hand-written to match supabase/migrations/0001_init.sql.
// Once you can run the Supabase CLI locally against this project, replace
// this file with a generated one for full accuracy:
//
//   npx supabase gen types typescript --project-id uuaxyywnuioitcjctvun > lib/supabase/database.types.ts

export type Locale = "ru" | "es" | "en";

export type ApplicationStatus =
  | "NEW"
  | "CONTACTED"
  | "INTERVIEW"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

// Every table declares an empty Relationships array. We don't rely on
// PostgREST's embedded-resource type resolution (`.select("*, foo(*)")`
// results are cast with `as any` where used) so this is safe to leave empty.
type NoRelationships = [];

export interface Database {
  public: {
    Tables: {
      difficulty_levels: {
        Row: {
          id: string;
          slug: string;
          sort_order: number;
          color_token: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          sort_order?: number;
          color_token?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["difficulty_levels"]["Insert"]>;
        Relationships: NoRelationships;
      };
      difficulty_level_i18n: {
        Row: { level_id: string; locale: Locale; name: string; description: string | null };
        Insert: { level_id: string; locale: Locale; name: string; description?: string | null };
        Update: Partial<Database["public"]["Tables"]["difficulty_level_i18n"]["Insert"]>;
        Relationships: NoRelationships;
      };
      expeditions: {
        Row: {
          id: string;
          slug: string;
          difficulty_level_id: string | null;
          country: string | null;
          altitude_m: number | null;
          duration_days: number | null;
          group_size_min: number | null;
          group_size_max: number | null;
          price_from: number | null;
          currency: string;
          best_season: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          difficulty_level_id?: string | null;
          country?: string | null;
          altitude_m?: number | null;
          duration_days?: number | null;
          group_size_min?: number | null;
          group_size_max?: number | null;
          price_from?: number | null;
          currency?: string;
          best_season?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["expeditions"]["Insert"]>;
        Relationships: NoRelationships;
      };
      expedition_i18n: {
        Row: {
          expedition_id: string;
          locale: Locale;
          title: string;
          short_description: string | null;
          hero_text: string | null;
          fitness_requirements: string | null;
          experience_requirements: string | null;
          preparation_text: string | null;
          meta_title: string | null;
          meta_description: string | null;
        };
        Insert: {
          expedition_id: string;
          locale: Locale;
          title: string;
          short_description?: string | null;
          hero_text?: string | null;
          fitness_requirements?: string | null;
          experience_requirements?: string | null;
          preparation_text?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["expedition_i18n"]["Insert"]>;
        Relationships: NoRelationships;
      };
      expedition_itinerary_days: {
        Row: { id: string; expedition_id: string; day_number: number; sort_order: number };
        Insert: { id?: string; expedition_id: string; day_number: number; sort_order?: number };
        Update: Partial<Database["public"]["Tables"]["expedition_itinerary_days"]["Insert"]>;
        Relationships: NoRelationships;
      };
      expedition_itinerary_i18n: {
        Row: { day_id: string; locale: Locale; title: string; description: string | null };
        Insert: { day_id: string; locale: Locale; title: string; description?: string | null };
        Update: Partial<Database["public"]["Tables"]["expedition_itinerary_i18n"]["Insert"]>;
        Relationships: NoRelationships;
      };
      expedition_inclusions: {
        Row: { id: string; expedition_id: string; icon: string | null; sort_order: number };
        Insert: { id?: string; expedition_id: string; icon?: string | null; sort_order?: number };
        Update: Partial<Database["public"]["Tables"]["expedition_inclusions"]["Insert"]>;
        Relationships: NoRelationships;
      };
      expedition_inclusions_i18n: {
        Row: { inclusion_id: string; locale: Locale; text: string };
        Insert: { inclusion_id: string; locale: Locale; text: string };
        Update: Partial<Database["public"]["Tables"]["expedition_inclusions_i18n"]["Insert"]>;
        Relationships: NoRelationships;
      };
      expedition_exclusions: {
        Row: { id: string; expedition_id: string; sort_order: number };
        Insert: { id?: string; expedition_id: string; sort_order?: number };
        Update: Partial<Database["public"]["Tables"]["expedition_exclusions"]["Insert"]>;
        Relationships: NoRelationships;
      };
      expedition_exclusions_i18n: {
        Row: { exclusion_id: string; locale: Locale; text: string };
        Insert: { exclusion_id: string; locale: Locale; text: string };
        Update: Partial<Database["public"]["Tables"]["expedition_exclusions_i18n"]["Insert"]>;
        Relationships: NoRelationships;
      };
      expedition_photos: {
        Row: {
          id: string;
          expedition_id: string;
          storage_path: string;
          alt_text: string | null;
          is_cover: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          expedition_id: string;
          storage_path: string;
          alt_text?: string | null;
          is_cover?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["expedition_photos"]["Insert"]>;
        Relationships: NoRelationships;
      };
      gallery_stories: {
        Row: {
          id: string;
          slug: string;
          expedition_id: string | null;
          year: number | null;
          cover_storage_path: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          expedition_id?: string | null;
          year?: number | null;
          cover_storage_path?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_stories"]["Insert"]>;
        Relationships: NoRelationships;
      };
      gallery_stories_i18n: {
        Row: { story_id: string; locale: Locale; title: string; description: string | null };
        Insert: { story_id: string; locale: Locale; title: string; description?: string | null };
        Update: Partial<Database["public"]["Tables"]["gallery_stories_i18n"]["Insert"]>;
        Relationships: NoRelationships;
      };
      gallery_story_photos: {
        Row: {
          id: string;
          story_id: string;
          storage_path: string;
          alt_text: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          story_id: string;
          storage_path: string;
          alt_text?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_story_photos"]["Insert"]>;
        Relationships: NoRelationships;
      };
      team_members: {
        Row: {
          id: string;
          storage_path: string | null;
          years_experience: number | null;
          stat_secondary_value: string | null;
          stat_secondary_label_key: string | null;
          is_published: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          storage_path?: string | null;
          years_experience?: number | null;
          stat_secondary_value?: string | null;
          stat_secondary_label_key?: string | null;
          is_published?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: NoRelationships;
      };
      team_members_i18n: {
        Row: { member_id: string; locale: Locale; name: string; role: string; bio: string | null };
        Insert: { member_id: string; locale: Locale; name: string; role: string; bio?: string | null };
        Update: Partial<Database["public"]["Tables"]["team_members_i18n"]["Insert"]>;
        Relationships: NoRelationships;
      };
      faq: {
        Row: { id: string; expedition_id: string | null; sort_order: number; is_published: boolean };
        Insert: {
          id?: string;
          expedition_id?: string | null;
          sort_order?: number;
          is_published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["faq"]["Insert"]>;
        Relationships: NoRelationships;
      };
      faq_i18n: {
        Row: { faq_id: string; locale: Locale; question: string; answer: string };
        Insert: { faq_id: string; locale: Locale; question: string; answer: string };
        Update: Partial<Database["public"]["Tables"]["faq_i18n"]["Insert"]>;
        Relationships: NoRelationships;
      };
      applications: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          whatsapp: string | null;
          telegram: string | null;
          country: string | null;
          age: number | null;
          expedition_id: string | null;
          hiking_experience: string | null;
          climbing_experience: string | null;
          altitude_experience: string | null;
          fitness_level: string | null;
          trainings_per_week: string | null;
          sports_practiced: string | null;
          medical_notes: string | null;
          extra_info: string | null;
          consent_given: boolean;
          status: ApplicationStatus;
          locale: Locale | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          whatsapp?: string | null;
          telegram?: string | null;
          country?: string | null;
          age?: number | null;
          expedition_id?: string | null;
          hiking_experience?: string | null;
          climbing_experience?: string | null;
          altitude_experience?: string | null;
          fitness_level?: string | null;
          trainings_per_week?: string | null;
          sports_practiced?: string | null;
          medical_notes?: string | null;
          extra_info?: string | null;
          consent_given: boolean;
          status?: ApplicationStatus;
          locale?: Locale | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
        Relationships: NoRelationships;
      };
      site_settings_i18n: {
        Row: { key: string; locale: Locale; value: Record<string, unknown> };
        Insert: { key: string; locale: Locale; value: Record<string, unknown> };
        Update: Partial<Database["public"]["Tables"]["site_settings_i18n"]["Insert"]>;
        Relationships: NoRelationships;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
