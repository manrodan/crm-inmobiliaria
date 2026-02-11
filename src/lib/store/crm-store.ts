import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Property, Client, Agent, Visit, Interaction } from '@/types';
import {
    mockProperties,
    mockClients,
    mockAgents,
    mockVisits,
    mockInteractions
} from '@/lib/data/mock-data';

interface CRMStore {
    // Data
    properties: Property[];
    clients: Client[];
    agents: Agent[];
    visits: Visit[];
    interactions: Interaction[];

    // Property actions
    addProperty: (property: Property) => void;
    updateProperty: (id: string, property: Partial<Property>) => void;
    deleteProperty: (id: string) => void;

    // Client actions
    addClient: (client: Client) => void;
    updateClient: (id: string, client: Partial<Client>) => void;
    deleteClient: (id: string) => void;

    // Visit actions
    addVisit: (visit: Visit) => void;
    updateVisit: (id: string, visit: Partial<Visit>) => void;
    deleteVisit: (id: string) => void;

    // Interaction actions
    addInteraction: (interaction: Interaction) => void;

    // Getters
    getPropertyById: (id: string) => Property | undefined;
    getClientById: (id: string) => Client | undefined;
    getAgentById: (id: string) => Agent | undefined;
    getVisitsByPropertyId: (propertyId: string) => Visit[];
    getVisitsByClientId: (clientId: string) => Visit[];
    getVisitsByAgentId: (agentId: string) => Visit[];
    getInteractionsByClientId: (clientId: string) => Interaction[];
    getPropertiesByAgentId: (agentId: string) => Property[];
}

export const useCRMStore = create<CRMStore>()(
    persist(
        (set, get) => ({
            // Initial data from mocks
            properties: mockProperties,
            clients: mockClients,
            agents: mockAgents,
            visits: mockVisits,
            interactions: mockInteractions,

            // Property actions
            addProperty: (property) =>
                set((state) => ({ properties: [...state.properties, property] })),

            updateProperty: (id, updates) =>
                set((state) => ({
                    properties: state.properties.map((p) =>
                        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
                    ),
                })),

            deleteProperty: (id) =>
                set((state) => ({
                    properties: state.properties.filter((p) => p.id !== id),
                })),

            // Client actions
            addClient: (client) =>
                set((state) => ({ clients: [...state.clients, client] })),

            updateClient: (id, updates) =>
                set((state) => ({
                    clients: state.clients.map((c) =>
                        c.id === id ? { ...c, ...updates } : c
                    ),
                })),

            deleteClient: (id) =>
                set((state) => ({
                    clients: state.clients.filter((c) => c.id !== id),
                })),

            // Visit actions
            addVisit: (visit) =>
                set((state) => ({ visits: [...state.visits, visit] })),

            updateVisit: (id, updates) =>
                set((state) => ({
                    visits: state.visits.map((v) =>
                        v.id === id ? { ...v, ...updates } : v
                    ),
                })),

            deleteVisit: (id) =>
                set((state) => ({
                    visits: state.visits.filter((v) => v.id !== id),
                })),

            // Interaction actions
            addInteraction: (interaction) =>
                set((state) => ({ interactions: [...state.interactions, interaction] })),

            // Getters
            getPropertyById: (id) => get().properties.find((p) => p.id === id),
            getClientById: (id) => get().clients.find((c) => c.id === id),
            getAgentById: (id) => get().agents.find((a) => a.id === id),
            getVisitsByPropertyId: (propertyId) =>
                get().visits.filter((v) => v.propertyId === propertyId),
            getVisitsByClientId: (clientId) =>
                get().visits.filter((v) => v.clientId === clientId),
            getVisitsByAgentId: (agentId) =>
                get().visits.filter((v) => v.agentId === agentId),
            getInteractionsByClientId: (clientId) =>
                get().interactions.filter((i) => i.clientId === clientId),
            getPropertiesByAgentId: (agentId) =>
                get().properties.filter((p) => p.agentId === agentId),
        }),
        {
            name: 'crm-inmobiliario-storage',
        }
    )
);
