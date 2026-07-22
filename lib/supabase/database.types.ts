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
        Insert: Partial<Database["public"]["Tables"]["difficulty_levels"]["Row"]> & {
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["difficulty_levels"]["Row"]>;
      };
      difficulty_level_i18n: {
        Row: {
          level_id: string;
          locale: Locale;
          name: string;
          description: string | null;
        };
        Insert: Database["public"]["Tables"]["difficulty_level_i18n"]["Row"];
        Update: Partial<Database["public"]["Tables"]["difficulty_level_i18n"]["Row"]>;
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
        Insert: Partial<Database["public"]["Tables"]["expeditions"]["Row"]> & {
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["expeditions"]["Row"]>;
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
        Insert: Database["public"]["Tables"]["expedition_i18n"]["Row"];
        Update: Partial<Database["public"]["Tables"]["expedition_i18n"]["Row"]>;
      };
      expedition_itinerary_days: {
        Row: { id: string; expedition_id: string; day_number: number; sort_order: number };
        Insert: Partial<Database["public"]["Tables"]["expedition_itinerary_days"]["Row"]> & {
          expedition_id: string;
          day_number: number;
        };
        Update: Partial<Database["public"]["Tables"]["expedition_itinerary_days"]["Row"]>;
      };
      expedition_itinerary_i18n: {
        Row: { day_id: string; locale: Locale; title: string; description: string | null };
        Insert: Database["public"]["Tables"]["expedition_itinerary_i18n"]["Row"];
        Update: Partial<Database["public"]["Tables"]["expedition_itinerary_i18n"]["Row"]>;
      };
      expedition_inclusions: {
        Row: { id: string; expedition_id: string; icon: string | null; sort_order: number };
        Insert: Partial<Database["public"]["Tables"]["expedition_inclusions"]["Row"]> & {
          expedition_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["expedition_inclusions"]["Row"]>;
      };
      expedition_inclusions_i18n: {
        Row: { inclusion_id: string; locale: Locale; text: string };
        Insert: Database["public"]["Tables"]["expedition_inclusions_i18n"]["Row"];
        Update: Partial<Database["public"]["Tables"]["expedition_inclusions_i18n"]["Row"]>;
      };
      expedition_exclusions: {
        Row: { id: string; expedition_id: string; sort_order: number };
        Insert: Partial<Database["public"]["Tables"]["expedition_exclusions"]["Row"]> & {
          expedition_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["expedition_exclusions"]["Row"]>;
      };
      expedition_exclusions_i18n: {
        Row: { exclusion_id: string; locale: Locale; text: string };
        Insert: Database["public"]["Tables"]["expedition_exclusions_i18n"]["Row"];
        Update: Partial<Database["public"]["Tables"]["expedition_exclusions_i18n"]["Row"]>;
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
        Insert: Partial<Database["public"]["Tables"]["expedition_photos"]["Row"]> & {
          expedition_id: string;
          storage_path: string;
        };
        Update: Partial<Database["public"]["Tables"]["expedition_photos"]["Row"]>;
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
        Insert: Partial<Database["public"]["Tables"]["gallery_stories"]["Row"]> & { slug: string };
        Update: Partial<Database["public"]["Tables"]["gallery_stories"]["Row"]>;
      };
      gallery_stories_i18n: {
        Row: { story_id: string; locale: Locale; title: string; description: string | null };
        Insert: Database["public"]["Tables"]["gallery_stories_i18n"]["Row"];
        Update: Partial<Database["public"]["Tables"]["gallery_stories_i18n"]["Row"]>;
      };
      gallery_story_photos: {
        Row: {
          id: string;
          story_id: string;
          storage_path: string;
          alt_text: string | null;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["gallery_story_photos"]["Row"]> & {
          story_id: string;
          storage_path: string;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_story_photos"]["Row"]>;
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
        Insert: Partial<Database["public"]["Tables"]["team_members"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["team_members"]["Row"]>;
      };
      team_members_i18n: {
        Row: { member_id: string; locale: Locale; name: string; role: string; bio: string | null };
        Insert: Database["public"]["Tables"]["team_members_i18n"]["Row"];
        Update: Partial<Database["public"]["Tables"]["team_members_i18n"]["Row"]>;
      };
      faq: {
        Row: {
          id: string;
          expedition_id: string | null;
          sort_order: number;
          is_published: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["faq"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["faq"]["Row"]>;
      };
      faq_i18n: {
        Row: { faq_id: string; locale: Locale; question: string; answer: string };
        Insert: Database["public"]["Tables"]["faq_i18n"]["Row"];
        Update: Partial<Database["public"]["Tables"]["faq_i18n"]["Row"]>;
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
        Insert: Partial<Database["public"]["Tables"]["applications"]["Row"]> & {
          first_name: string;
          last_name: string;
          email: string;
          consent_given: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Row"]>;
      };
      site_settings_i18n: {
        Row: { key: string; locale: Locale; value: Record<string, unknown> };
        Insert: Database["public"]["Tables"]["site_settings_i18n"]["Row"];
        Update: Partial<Database["public"]["Tables"]["site_settings_i18n"]["Row"]>;
      };
    };
  };
}
