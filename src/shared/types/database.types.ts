export type TourSegment = 'economy' | 'standard' | 'premium' | 'mice';
export type LeadStatus = 'new' | 'contacted' | 'closed';
export type UserRole = 'client' | 'admin';

export interface Database {
  public: {
    Tables: {
      tours: {
        Row: {
          id: string;
          created_at: string;
          slug: string;
          title: string;
          country: string;
          description: string;
          highlights: string[];
          price_from: number;
          currency: string;
          duration_days: number;
          image_url: string | null;
          segment: TourSegment;
          is_hot: boolean;
          rating: number | null;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['tours']['Row']> & {
          slug: string;
          title: string;
          country: string;
          description: string;
          price_from: number;
          duration_days: number;
          segment: TourSegment;
        };
        Update: Partial<Database['public']['Tables']['tours']['Row']>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          phone: string;
          tour_id: string | null;
          tour_title: string | null;
          message: string | null;
          status: LeadStatus;
          source: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          phone: string;
          tour_id?: string | null;
          tour_title?: string | null;
          message?: string | null;
          status?: LeadStatus;
          source?: string;
          user_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['leads']['Row']>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
        Relationships: [];
      };
      favorites: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          tour_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          tour_id: string;
        };
        Update: Partial<Database['public']['Tables']['favorites']['Row']>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          created_at: string;
          author_name: string;
          rating: number;
          text: string;
          tour_id: string | null;
          is_published: boolean;
        };
        Insert: Partial<Database['public']['Tables']['reviews']['Row']> & {
          author_name: string;
          rating: number;
          text: string;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Row']>;
        Relationships: [];
      };
      faq: {
        Row: {
          id: string;
          question: string;
          answer: string;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['faq']['Row']> & {
          question: string;
          answer: string;
        };
        Update: Partial<Database['public']['Tables']['faq']['Row']>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          created_at: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_image_url: string | null;
          published_at: string;
          is_published: boolean;
        };
        Insert: Partial<Database['public']['Tables']['blog_posts']['Row']> & {
          slug: string;
          title: string;
          excerpt: string;
          content: string;
        };
        Update: Partial<Database['public']['Tables']['blog_posts']['Row']>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          created_at: string;
          email: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
        };
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Row']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tour = Database['public']['Tables']['tours']['Row'];
export type TourInsert = Database['public']['Tables']['tours']['Insert'];
export type TourUpdate = Database['public']['Tables']['tours']['Update'];
export type Lead = Database['public']['Tables']['leads']['Row'];
export type LeadInsert = Database['public']['Tables']['leads']['Insert'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type FaqItem = Database['public']['Tables']['faq']['Row'];
export type FaqInsert = Database['public']['Tables']['faq']['Insert'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Favorite = Database['public']['Tables']['favorites']['Row'];
