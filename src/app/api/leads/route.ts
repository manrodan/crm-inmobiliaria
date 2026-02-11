import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// API Key validation (for webhook security)
const API_SECRET = process.env.API_SECRET_KEY || 'crm-marvic-webhook-secret-2024';

export async function POST(request: NextRequest) {
    try {
        // Validate API key
        const authHeader = request.headers.get('authorization');
        const apiKey = authHeader?.replace('Bearer ', '');

        if (apiKey !== API_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Expected payload from Make (Integromat)
        const {
            name,
            email,
            phone,
            message,
            property_reference,
            source = 'idealista',
            original_email = null,
        } = body;

        // Validate required fields
        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        // Find property by reference (if provided)
        let propertyId = null;
        let assignedAgentId = null;

        if (property_reference) {
            const { data: property } = await supabase
                .from('properties')
                .select('id, agent_id')
                .eq('reference', property_reference)
                .single();

            if (property) {
                propertyId = property.id;
                assignedAgentId = property.agent_id;
            }
        }

        // If no agent assigned, get a random one
        if (!assignedAgentId) {
            const { data: agents } = await supabase
                .from('agents')
                .select('id')
                .limit(1);

            if (agents && agents.length > 0) {
                assignedAgentId = agents[0].id;
            }
        }

        // Create or find client
        let clientId = null;

        if (email) {
            // Check if client exists
            const { data: existingClient } = await supabase
                .from('clients')
                .select('id')
                .eq('email', email)
                .single();

            if (existingClient) {
                clientId = existingClient.id;
            } else {
                // Create new client
                const { data: newClient, error: clientError } = await supabase
                    .from('clients')
                    .insert({
                        name,
                        email,
                        phone,
                        type: 'lead',
                        source,
                        notes: message,
                    })
                    .select('id')
                    .single();

                if (newClient) {
                    clientId = newClient.id;
                }
            }
        }

        // Create lead
        const { data: lead, error: leadError } = await supabase
            .from('leads')
            .insert({
                property_id: propertyId,
                client_id: clientId,
                source,
                original_email,
                message,
                status: 'nuevo',
                assigned_agent_id: assignedAgentId,
            })
            .select('id')
            .single();

        if (leadError) {
            console.error('Error creating lead:', leadError);
            return NextResponse.json(
                { error: 'Failed to create lead', details: leadError.message },
                { status: 500 }
            );
        }

        // Create interaction record
        if (clientId) {
            await supabase
                .from('interactions')
                .insert({
                    client_id: clientId,
                    type: 'idealista',
                    description: `Lead recibido desde ${source}: ${message?.substring(0, 100)}...`,
                });
        }

        return NextResponse.json({
            success: true,
            lead_id: lead.id,
            client_id: clientId,
            property_id: propertyId,
            message: 'Lead created successfully',
        });

    } catch (error) {
        console.error('Error processing lead:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint to list leads (for testing)
export async function GET(request: NextRequest) {
    try {
        const { data: leads, error } = await supabase
            .from('leads')
            .select(`
        *,
        properties (id, reference, title),
        clients (id, name, email, phone),
        agents:assigned_agent_id (id, name)
      `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ leads });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
