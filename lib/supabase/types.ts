export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    name?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    type: 'wedding' | 'trip' | 'party' | 'corporate' | 'other'
                    description: string | null
                    start_date: string
                    end_date: string
                    location_summary: string | null
                    slug: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    type: 'wedding' | 'trip' | 'party' | 'corporate' | 'other'
                    description?: string | null
                    start_date: string
                    end_date: string
                    location_summary?: string | null
                    slug: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    type?: 'wedding' | 'trip' | 'party' | 'corporate' | 'other'
                    description?: string | null
                    start_date?: string
                    end_date?: string
                    location_summary?: string | null
                    slug?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            event_themes: {
                Row: {
                    id: string
                    event_id: string
                    primary_color: string
                    secondary_color: string
                    background_style: 'light' | 'dark' | 'photo' | 'minimal'
                    font_style: 'serif' | 'sans' | 'mixed'
                    logo_url: string | null
                    hero_image_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    primary_color?: string
                    secondary_color?: string
                    background_style?: 'light' | 'dark' | 'photo' | 'minimal'
                    font_style?: 'serif' | 'sans' | 'mixed'
                    logo_url?: string | null
                    hero_image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    primary_color?: string
                    secondary_color?: string
                    background_style?: 'light' | 'dark' | 'photo' | 'minimal'
                    font_style?: 'serif' | 'sans' | 'mixed'
                    logo_url?: string | null
                    hero_image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            guest_groups: {
                Row: {
                    id: string
                    event_id: string
                    name: string
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    name: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    name?: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            households: {
                Row: {
                    id: string
                    event_id: string
                    name: string
                    access_code: string
                    rsvp_token: string
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    name: string
                    access_code: string
                    rsvp_token: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    name?: string
                    access_code?: string
                    rsvp_token?: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            guests: {
                Row: {
                    id: string
                    event_id: string
                    household_id: string | null
                    guest_group_id: string | null
                    first_name: string
                    last_name: string
                    email: string | null
                    phone: string | null
                    role: 'primary' | 'plus_one' | 'child' | 'other'
                    side: 'partner_a' | 'partner_b' | 'joint' | 'other' | null
                    is_primary_contact: boolean
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    household_id?: string | null
                    guest_group_id?: string | null
                    first_name: string
                    last_name: string
                    email?: string | null
                    phone?: string | null
                    role?: 'primary' | 'plus_one' | 'child' | 'other'
                    side?: 'partner_a' | 'partner_b' | 'joint' | 'other' | null
                    is_primary_contact?: boolean
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    household_id?: string | null
                    guest_group_id?: string | null
                    first_name?: string
                    last_name?: string
                    email?: string | null
                    phone?: string | null
                    role?: 'primary' | 'plus_one' | 'child' | 'other'
                    side?: 'partner_a' | 'partner_b' | 'joint' | 'other' | null
                    is_primary_contact?: boolean
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            event_sessions: {
                Row: {
                    id: string
                    event_id: string
                    name: string
                    description: string | null
                    start_datetime: string
                    end_datetime: string | null
                    location_name: string | null
                    location_address: string | null
                    dress_code: string | null
                    is_required: boolean
                    visibility_rules: Json | null
                    display_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    name: string
                    description?: string | null
                    start_datetime: string
                    end_datetime?: string | null
                    location_name?: string | null
                    location_address?: string | null
                    dress_code?: string | null
                    is_required?: boolean
                    visibility_rules?: Json | null
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    name?: string
                    description?: string | null
                    start_datetime?: string
                    end_datetime?: string | null
                    location_name?: string | null
                    location_address?: string | null
                    dress_code?: string | null
                    is_required?: boolean
                    visibility_rules?: Json | null
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            session_invitations: {
                Row: {
                    id: string
                    event_session_id: string
                    guest_id: string
                    status: 'invited' | 'hidden'
                    created_at: string
                }
                Insert: {
                    id?: string
                    event_session_id: string
                    guest_id: string
                    status?: 'invited' | 'hidden'
                    created_at?: string
                }
                Update: {
                    id?: string
                    event_session_id?: string
                    guest_id?: string
                    status?: 'invited' | 'hidden'
                    created_at?: string
                }
            }
            rsvps: {
                Row: {
                    id: string
                    event_session_id: string
                    guest_id: string
                    status: 'attending' | 'not_attending' | 'maybe' | 'no_response'
                    responded_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    event_session_id: string
                    guest_id: string
                    status?: 'attending' | 'not_attending' | 'maybe' | 'no_response'
                    responded_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    event_session_id?: string
                    guest_id?: string
                    status?: 'attending' | 'not_attending' | 'maybe' | 'no_response'
                    responded_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            questions: {
                Row: {
                    id: string
                    event_id: string
                    event_session_id: string | null
                    label: string
                    description: string | null
                    type: 'single_choice' | 'multi_choice' | 'text' | 'number' | 'boolean'
                    is_required: boolean
                    options: Json | null
                    visibility_condition: Json | null
                    display_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    event_session_id?: string | null
                    label: string
                    description?: string | null
                    type: 'single_choice' | 'multi_choice' | 'text' | 'number' | 'boolean'
                    is_required?: boolean
                    options?: Json | null
                    visibility_condition?: Json | null
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    event_session_id?: string | null
                    label?: string
                    description?: string | null
                    type?: 'single_choice' | 'multi_choice' | 'text' | 'number' | 'boolean'
                    is_required?: boolean
                    options?: Json | null
                    visibility_condition?: Json | null
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            responses: {
                Row: {
                    id: string
                    question_id: string
                    guest_id: string
                    event_session_id: string | null
                    answer_text: string | null
                    answer_json: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    question_id: string
                    guest_id: string
                    event_session_id?: string | null
                    answer_text?: string | null
                    answer_json?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    question_id?: string
                    guest_id?: string
                    event_session_id?: string | null
                    answer_text?: string | null
                    answer_json?: Json | null
                    created_at?: string
                    updated_at?: string
                }
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
    }
}
