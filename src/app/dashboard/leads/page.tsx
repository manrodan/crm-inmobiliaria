'use client';

import { Header } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import {
    Bell,
    Building2,
    User,
    Mail,
    Phone,
    MessageSquare,
    Clock,
    CheckCircle,
    XCircle,
    UserPlus,
    RefreshCw,
    Send,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Lead {
    id: string;
    property_id: string | null;
    client_id: string | null;
    source: string;
    original_email: string | null;
    message: string | null;
    status: 'nuevo' | 'contactado' | 'convertido' | 'descartado';
    assigned_agent_id: string | null;
    created_at: string;
    properties?: {
        id: string;
        reference: string;
        title: string;
    } | null;
    clients?: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
    } | null;
    agents?: {
        id: string;
        name: string;
    } | null;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('todos');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('leads')
                .select(`
          *,
          properties (id, reference, title),
          clients (id, name, email, phone),
          agents:assigned_agent_id (id, name)
        `)
                .order('created_at', { ascending: false });

            if (filterStatus !== 'todos') {
                query = query.eq('status', filterStatus);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching leads:', error);
            } else {
                setLeads(data || []);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLeads();

        // Subscribe to realtime updates
        const channel = supabase
            .channel('leads-changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'leads' },
                (payload) => {
                    console.log('New lead received:', payload);
                    fetchLeads();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [filterStatus]);

    const updateLeadStatus = async (leadId: string, newStatus: string) => {
        const { error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', leadId);

        if (!error) {
            fetchLeads();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'nuevo': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'contactado': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'convertido': return 'bg-green-100 text-green-700 border-green-200';
            case 'descartado': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'nuevo': return <Bell className="h-4 w-4" />;
            case 'contactado': return <Phone className="h-4 w-4" />;
            case 'convertido': return <CheckCircle className="h-4 w-4" />;
            case 'descartado': return <XCircle className="h-4 w-4" />;
            default: return null;
        }
    };

    const stats = {
        total: leads.length,
        nuevos: leads.filter(l => l.status === 'nuevo').length,
        contactados: leads.filter(l => l.status === 'contactado').length,
        convertidos: leads.filter(l => l.status === 'convertido').length,
    };

    return (
        <div className="flex flex-col h-full">
            <Header title="Leads" />

            <div className="flex-1 p-6 space-y-6 overflow-auto">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Bell className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-600">Nuevos</p>
                                <p className="text-2xl font-bold text-blue-700">{stats.nuevos}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Phone className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-yellow-600">Contactados</p>
                                <p className="text-2xl font-bold text-yellow-700">{stats.contactados}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <UserPlus className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-green-600">Convertidos</p>
                                <p className="text-2xl font-bold text-green-700">{stats.convertidos}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-slate-100 rounded-full">
                                <MessageSquare className="h-6 w-6 text-slate-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Total Leads</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos los estados</SelectItem>
                            <SelectItem value="nuevo">Nuevos</SelectItem>
                            <SelectItem value="contactado">Contactados</SelectItem>
                            <SelectItem value="convertido">Convertidos</SelectItem>
                            <SelectItem value="descartado">Descartados</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={fetchLeads} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>

                    <div className="ml-auto text-sm text-slate-500">
                        {leads.length} leads encontrados
                    </div>
                </div>

                {/* Leads List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-slate-400" />
                            <p className="text-slate-500 mt-2">Cargando leads...</p>
                        </div>
                    ) : leads.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Bell className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500">No hay leads todavía</p>
                                <p className="text-sm text-slate-400 mt-1">
                                    Los leads de Idealista aparecerán aquí automáticamente
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        leads.map(lead => (
                            <Card key={lead.id} className={`transition-all hover:shadow-md ${lead.status === 'nuevo' ? 'border-l-4 border-l-blue-500' : ''}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        {/* Status indicator */}
                                        <div className={`p-2 rounded-full ${getStatusColor(lead.status)}`}>
                                            {getStatusIcon(lead.status)}
                                        </div>

                                        {/* Main content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold">
                                                            {lead.clients?.name || 'Lead sin nombre'}
                                                        </h3>
                                                        <Badge className={getStatusColor(lead.status)}>
                                                            {lead.status}
                                                        </Badge>
                                                        <Badge variant="outline">{lead.source}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                        {lead.clients?.email && (
                                                            <span className="flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {lead.clients.email}
                                                            </span>
                                                        )}
                                                        {lead.clients?.phone && (
                                                            <span className="flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />
                                                                {lead.clients.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right text-sm text-slate-500">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {format(new Date(lead.created_at), "d MMM, HH:mm", { locale: es })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Property info */}
                                            {lead.properties && (
                                                <div className="flex items-center gap-2 mt-2 p-2 bg-slate-50 rounded">
                                                    <Building2 className="h-4 w-4 text-slate-400" />
                                                    <span className="text-sm font-medium">{lead.properties.reference}</span>
                                                    <span className="text-sm text-slate-500">- {lead.properties.title}</span>
                                                </div>
                                            )}

                                            {/* Message */}
                                            {lead.message && (
                                                <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded">
                                                    "{lead.message}"
                                                </p>
                                            )}

                                            {/* Assigned agent */}
                                            {lead.agents && (
                                                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                                                    <User className="h-3 w-3" />
                                                    Asignado a: {lead.agents.name}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            {lead.status === 'nuevo' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateLeadStatus(lead.id, 'contactado')}
                                                >
                                                    <Phone className="h-4 w-4 mr-1" />
                                                    Contactar
                                                </Button>
                                            )}
                                            {lead.status === 'contactado' && (
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => updateLeadStatus(lead.id, 'convertido')}
                                                >
                                                    <UserPlus className="h-4 w-4 mr-1" />
                                                    Convertir
                                                </Button>
                                            )}
                                            {(lead.status === 'nuevo' || lead.status === 'contactado') && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600"
                                                    onClick={() => updateLeadStatus(lead.id, 'descartado')}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Descartar
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
