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
    Bed,
    Bath,
    Maximize,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Edit,
    Trash2,
    Share2,
    Heart,
    CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { use } from 'react';

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { properties, agents, visits, clients } = useCRMStore();

    const property = properties.find(p => p.id === params.id);
    const agent = property ? agents.find(a => a.id === property.agentId) : null;
    const propertyVisits = property ? visits.filter(v => v.propertyId === property.id) : [];

    if (!property) {
        return (
            <div className="flex flex-col h-full">
                <Header title="Propiedad no encontrada" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-slate-500 mb-4">La propiedad que buscas no existe.</p>
                        <Link href="/propiedades">
                            <Button>Volver a Propiedades</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const formatPrice = (price: number, operation: string) => {
        const formatted = new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(price);
        return operation === 'alquiler' ? `${formatted}/mes` : formatted;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'disponible': return 'bg-green-100 text-green-700';
            case 'reservado': return 'bg-yellow-100 text-yellow-700';
            case 'vendido': return 'bg-blue-100 text-blue-700';
            case 'alquilado': return 'bg-purple-100 text-purple-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="flex flex-col h-full">
            <Header title={property.reference} />

            <div className="flex-1 p-6 overflow-auto">
                {/* Back Button */}
                <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <Card className="overflow-hidden">
                            <div className="relative h-[400px]">
                                <img
                                    src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <Badge className={property.operation === 'venta' ? 'bg-blue-600' : 'bg-green-600'}>
                                        {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
                                    </Badge>
                                    <Badge className={getStatusColor(property.status)}>
                                        {property.status}
                                    </Badge>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Button size="icon" variant="secondary">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="secondary">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            {property.images.length > 1 && (
                                <div className="flex gap-2 p-4 overflow-x-auto">
                                    {property.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`${property.title} ${idx + 1}`}
                                            className="w-24 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                                        />
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Property Info */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
                                        <div className="flex items-center text-slate-500">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {property.address}, {property.zone}, {property.city}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-blue-600">
                                            {formatPrice(property.price, property.operation)}
                                        </p>
                                        <p className="text-sm text-slate-500 capitalize">{property.propertyType}</p>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                {/* Specs */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {property.bedrooms > 0 && (
                                        <div className="text-center p-4 bg-slate-50 rounded-lg">
                                            <Bed className="h-6 w-6 mx-auto text-slate-600 mb-2" />
                                            <p className="text-2xl font-bold">{property.bedrooms}</p>
                                            <p className="text-sm text-slate-500">Habitaciones</p>
                                        </div>
                                    )}
                                    {property.bathrooms > 0 && (
                                        <div className="text-center p-4 bg-slate-50 rounded-lg">
                                            <Bath className="h-6 w-6 mx-auto text-slate-600 mb-2" />
                                            <p className="text-2xl font-bold">{property.bathrooms}</p>
                                            <p className="text-sm text-slate-500">Baños</p>
                                        </div>
                                    )}
                                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                                        <Maximize className="h-6 w-6 mx-auto text-slate-600 mb-2" />
                                        <p className="text-2xl font-bold">{property.area}</p>
                                        <p className="text-sm text-slate-500">m²</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <h3 className="font-semibold mb-2">Descripción</h3>
                                <p className="text-slate-600 mb-6">{property.description}</p>

                                {/* Features */}
                                {property.features.length > 0 && (
                                    <>
                                        <h3 className="font-semibold mb-3">Características</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {property.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-slate-600">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Visits */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Visitas ({propertyVisits.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {propertyVisits.length === 0 ? (
                                    <p className="text-slate-500 text-center py-4">No hay visitas registradas</p>
                                ) : (
                                    <div className="space-y-3">
                                        {propertyVisits.map(visit => {
                                            const client = clients.find(c => c.id === visit.clientId);
                                            const visitAgent = agents.find(a => a.id === visit.agentId);

                                            return (
                                                <div key={visit.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{client?.name || 'Cliente desconocido'}</p>
                                                        <p className="text-sm text-slate-500">
                                                            {format(new Date(visit.scheduledAt), "d 'de' MMMM, HH:mm", { locale: es })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline">{visit.status}</Badge>
                                                        <span className="text-sm text-slate-500">{visitAgent?.name.split(' ')[0]}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Agent Card */}
                        {agent && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Agente Responsable</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={agent.avatar} />
                                            <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{agent.name}</p>
                                            <p className="text-sm text-slate-500">{agent.sales} ventas</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <a
                                            href={`tel:${agent.phone}`}
                                            className="flex items-center gap-2 text-slate-600 hover:text-blue-600"
                                        >
                                            <Phone className="h-4 w-4" />
                                            {agent.phone}
                                        </a>
                                        <a
                                            href={`mailto:${agent.email}`}
                                            className="flex items-center gap-2 text-slate-600 hover:text-blue-600"
                                        >
                                            <Mail className="h-4 w-4" />
                                            {agent.email}
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full" variant="default">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Programar Visita
                                </Button>
                                <Button className="w-full" variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar Propiedad
                                </Button>
                                <Button className="w-full text-red-600 hover:text-red-700" variant="outline">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Meta Info */}
                        <Card>
                            <CardContent className="p-4 text-sm text-slate-500 space-y-1">
                                <p>Referencia: <span className="font-medium text-slate-700">{property.reference}</span></p>
                                <p>Publicado: <span className="font-medium text-slate-700">{format(new Date(property.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</span></p>
                                <p>Actualizado: <span className="font-medium text-slate-700">{format(new Date(property.updatedAt), "d 'de' MMMM, yyyy", { locale: es })}</span></p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
