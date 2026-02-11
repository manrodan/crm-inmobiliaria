import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database
export type Database = {
    public: {
        Tables: {
            agents: {
                Row: {
                    id: string;
                    name: string;
                    email: string;
                    phone: string | null;
                    avatar_url: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['agents']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['agents']['Insert']>;
            };
            properties: {
                Row: {
                    id: string;
                    reference: string;
                    title: string;
                    operation: 'venta' | 'alquiler';
                    property_type: string;
                    price: number;
                    area: number;
                    bedrooms: number;
                    bathrooms: number;
                    address: string;
                    city: string;
                    zone: string;
                    description: string;
                    features: string[];
                    images: string[];
                    status: string;
                    agent_id: string | null;
                    idealista_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['properties']['Insert']>;
            };
            clients: {
                Row: {
                    id: string;
                    name: string;
                    email: string | null;
                    phone: string | null;
                    type: 'comprador' | 'vendedor' | 'inquilino' | 'propietario' | 'lead';
                    source: string;
                    preferences: string | null;
                    budget_min: number | null;
                    budget_max: number | null;
                    zones: string[];
                    notes: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['clients']['Insert']>;
            };
            leads: {
                Row: {
                    id: string;
                    property_id: string | null;
                    client_id: string | null;
                    source: string;
                    original_email: string | null;
                    message: string | null;
                    status: 'nuevo' | 'contactado' | 'convertido' | 'descartado';
                    assigned_agent_id: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['leads']['Insert']>;
            };
            visits: {
                Row: {
                    id: string;
                    property_id: string;
                    client_id: string;
                    agent_id: string;
                    scheduled_at: string;
                    status: string;
                    notes: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['visits']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['visits']['Insert']>;
            };
            interactions: {
                Row: {
                    id: string;
                    client_id: string;
                    type: 'llamada' | 'email' | 'visita' | 'whatsapp' | 'idealista';
                    description: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['interactions']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['interactions']['Insert']>;
            };
        };
    };
};
