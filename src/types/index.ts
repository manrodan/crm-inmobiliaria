// Types for CRM Inmobiliario

export type PropertyType = 'piso' | 'casa' | 'chalet' | 'local' | 'oficina' | 'terreno' | 'atico';
export type PropertyOperation = 'venta' | 'alquiler';
export type PropertyStatus = 'disponible' | 'reservado' | 'vendido' | 'alquilado';

export interface Property {
    id: string;
    reference: string;
    title: string;
    operation: PropertyOperation;
    propertyType: PropertyType;
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
    status: PropertyStatus;
    agentId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ClientType = 'comprador' | 'vendedor' | 'inquilino' | 'propietario';

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: ClientType;
    preferences: string;
    budgetMin?: number;
    budgetMax?: number;
    zones: string[];
    notes: string;
    createdAt: Date;
}

export interface Agent {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    sales: number;
    listings: number;
    rating: number;
}

export type VisitStatus = 'programada' | 'realizada' | 'cancelada';

export interface Visit {
    id: string;
    propertyId: string;
    clientId: string;
    agentId: string;
    scheduledAt: Date;
    status: VisitStatus;
    notes: string;
}

export interface Interaction {
    id: string;
    clientId: string;
    type: 'llamada' | 'email' | 'visita' | 'whatsapp';
    description: string;
    date: Date;
}

export interface DashboardStats {
    totalProperties: number;
    propertiesForSale: number;
    propertiesForRent: number;
    totalClients: number;
    scheduledVisits: number;
    monthlySales: number;
    monthlyRentals: number;
}
