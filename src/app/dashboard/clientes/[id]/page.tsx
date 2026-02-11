'use client';

import { Header } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useCRMStore } from '@/lib/store/crm-store';
import {
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    Euro,
    Calendar,
    Edit,
    MessageSquare,
    PhoneCall,
    Mail as MailIcon,
    Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ClientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { clients, visits, interactions, properties, agents } = useCRMStore();

    const client = clients.find(c => c.id === params.id);
    const clientVisits = client ? visits.filter(v => v.clientId === client.id) : [];
    const clientInteractions = client ? interactions.filter(i => i.clientId === client.id) : [];

    if (!client) {
        return (
            <div className="flex flex-col h-full">
                <Header title="Cliente no encontrado" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-slate-500 mb-4">El cliente que buscas no existe.</p>
                        <Link href="/dashboard/clientes">
                            <Button>Volver a Clientes</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'comprador': return 'bg-blue-100 text-blue-700';
            case 'vendedor': return 'bg-green-100 text-green-700';
            case 'inquilino': return 'bg-purple-100 text-purple-700';
            case 'propietario': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getInteractionIcon = (type: string) => {
        switch (type) {
            case 'llamada': return PhoneCall;
            case 'email': return MailIcon;
            case 'visita': return Eye;
            case 'whatsapp': return MessageSquare;
            default: return MessageSquare;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <Header title={client.name} />

            <div className="flex-1 p-6 overflow-auto">
                <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Client Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-6">
                                    <Avatar className="h-20 w-20">
                                        <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                                            {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-2xl font-bold">{client.name}</h1>
                                            <Badge className={getTypeColor(client.type)}>{client.type}</Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600">
                                            <a href={`tel:${client.phone}`} className="flex items-center gap-2 hover:text-blue-600">
                                                <Phone className="h-4 w-4" />
                                                {client.phone}
                                            </a>
                                            <a href={`mailto:${client.email}`} className="flex items-center gap-2 hover:text-blue-600">
                                                <Mail className="h-4 w-4" />
                                                {client.email}
                                            </a>
                                        </div>
                                    </div>
                                    <Button variant="outline">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar
                                    </Button>
                                </div>

                                <Separator className="my-6" />

                                {/* Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold mb-2">Preferencias</h3>
                                        <p className="text-slate-600">{client.preferences || 'No especificadas'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Presupuesto</h3>
                                        {client.budgetMin || client.budgetMax ? (
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Euro className="h-4 w-4" />
                                                {client.budgetMin && client.budgetMax
                                                    ? `${client.budgetMin.toLocaleString('es-ES')}€ - ${client.budgetMax.toLocaleString('es-ES')}€`
                                                    : client.budgetMax
                                                        ? `Hasta ${client.budgetMax.toLocaleString('es-ES')}€`
                                                        : `Desde ${client.budgetMin!.toLocaleString('es-ES')}€`
                                                }
                                            </div>
                                        ) : (
                                            <p className="text-slate-400">No especificado</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Zonas de interés</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {client.zones.length > 0 ? client.zones.map(zone => (
                                                <Badge key={zone} variant="secondary">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {zone}
                                                </Badge>
                                            )) : (
                                                <p className="text-slate-400">No especificadas</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Cliente desde</h3>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="h-4 w-4" />
                                            {format(new Date(client.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                                        </div>
                                    </div>
                                </div>

                                {client.notes && (
                                    <>
                                        <Separator className="my-6" />
                                        <div>
                                            <h3 className="font-semibold mb-2">Notas</h3>
                                            <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">{client.notes}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Visits */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Visitas ({clientVisits.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {clientVisits.length === 0 ? (
                                    <p className="text-slate-500 text-center py-4">No hay visitas registradas</p>
                                ) : (
                                    <div className="space-y-3">
                                        {clientVisits.map(visit => {
                                            const property = properties.find(p => p.id === visit.propertyId);
                                            const agent = agents.find(a => a.id === visit.agentId);

                                            return (
                                                <div key={visit.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        {property?.images[0] && (
                                                            <img
                                                                src={property.images[0]}
                                                                alt={property.title}
                                                                className="w-16 h-12 object-cover rounded"
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{property?.title || 'Propiedad'}</p>
                                                            <p className="text-sm text-slate-500">
                                                                {format(new Date(visit.scheduledAt), "d MMM yyyy, HH:mm", { locale: es })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline">{visit.status}</Badge>
                                                        <span className="text-sm text-slate-500">{agent?.name.split(' ')[0]}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Interactions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Historial</CardTitle>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-1" />
                                        Añadir
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {clientInteractions.length === 0 ? (
                                    <p className="text-slate-500 text-center py-4">No hay interacciones</p>
                                ) : (
                                    <div className="space-y-4">
                                        {clientInteractions
                                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                            .map(interaction => {
                                                const Icon = getInteractionIcon(interaction.type);
                                                return (
                                                    <div key={interaction.id} className="flex gap-3">
                                                        <div className="p-2 bg-slate-100 rounded-full h-fit">
                                                            <Icon className="h-4 w-4 text-slate-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm capitalize font-medium">{interaction.type}</p>
                                                            <p className="text-xs text-slate-500 mb-1">
                                                                {format(new Date(interaction.date), "d MMM yyyy, HH:mm", { locale: es })}
                                                            </p>
                                                            <p className="text-sm text-slate-600">{interaction.description}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full" variant="outline">
                                    <PhoneCall className="h-4 w-4 mr-2" />
                                    Registrar Llamada
                                </Button>
                                <Button className="w-full" variant="outline">
                                    <MailIcon className="h-4 w-4 mr-2" />
                                    Enviar Email
                                </Button>
                                <Button className="w-full" variant="outline">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Programar Visita
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}
