'use client';

import { Header } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCRMStore } from '@/lib/store/crm-store';
import {
    Building2,
    Users,
    Calendar,
    TrendingUp,
    Euro,
    Home,
    Key,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function DashboardPage() {
    const { properties, clients, visits, agents } = useCRMStore();

    // Calculate stats
    const availableProperties = properties.filter(p => p.status === 'disponible');
    const forSale = availableProperties.filter(p => p.operation === 'venta');
    const forRent = availableProperties.filter(p => p.operation === 'alquiler');
    const scheduledVisits = visits.filter(v => v.status === 'programada');
    const soldThisMonth = properties.filter(p => p.status === 'vendido').length;
    const rentedThisMonth = properties.filter(p => p.status === 'alquilado').length;

    // Recent activity (visits)
    const recentVisits = visits
        .filter(v => v.status === 'programada')
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
        .slice(0, 5);

    // Top agents
    const topAgents = [...agents].sort((a, b) => b.sales - a.sales).slice(0, 4);

    const stats = [
        {
            title: 'Propiedades Activas',
            value: availableProperties.length,
            icon: Building2,
            change: '+3',
            changeType: 'positive',
            color: 'bg-blue-500',
        },
        {
            title: 'Clientes',
            value: clients.length,
            icon: Users,
            change: '+5',
            changeType: 'positive',
            color: 'bg-green-500',
        },
        {
            title: 'Visitas Programadas',
            value: scheduledVisits.length,
            icon: Calendar,
            change: '+2',
            changeType: 'positive',
            color: 'bg-purple-500',
        },
        {
            title: 'Ventas Este Mes',
            value: soldThisMonth,
            icon: TrendingUp,
            change: '+1',
            changeType: 'positive',
            color: 'bg-orange-500',
        },
    ];

    return (
        <div className="flex flex-col h-full">
            <Header title="Dashboard" />

            <div className="flex-1 p-6 space-y-6 overflow-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <Card key={stat.title} className="relative overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">{stat.title}</p>
                                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                        <div className="flex items-center mt-2">
                                            {stat.changeType === 'positive' ? (
                                                <ArrowUpRight className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <ArrowDownRight className="h-4 w-4 text-red-500" />
                                            )}
                                            <span className={`text-sm ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                                                {stat.change} este mes
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.color}`}>
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Properties Overview */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Resumen de Propiedades
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Home className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-blue-600">{forSale.length}</p>
                                            <p className="text-sm text-blue-600">En Venta</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-blue-600">
                                        Valor: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(forSale.reduce((acc, p) => acc + p.price, 0))}
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Key className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-green-600">{forRent.length}</p>
                                            <p className="text-sm text-green-600">En Alquiler</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-green-600">
                                        Renta media: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(forRent.length > 0 ? forRent.reduce((acc, p) => acc + p.price, 0) / forRent.length : 0)}/mes
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Euro className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-purple-600">{soldThisMonth + rentedThisMonth}</p>
                                            <p className="text-sm text-purple-600">Operaciones</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-purple-600">
                                        {soldThisMonth} ventas, {rentedThisMonth} alquileres
                                    </div>
                                </div>
                            </div>

                            {/* Properties by Type */}
                            <div className="mt-6">
                                <h4 className="text-sm font-medium text-slate-700 mb-3">Por Tipo</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['piso', 'casa', 'chalet', 'atico', 'local', 'oficina', 'terreno'].map(type => {
                                        const count = properties.filter(p => p.propertyType === type && p.status === 'disponible').length;
                                        if (count === 0) return null;
                                        return (
                                            <Badge key={type} variant="secondary" className="capitalize">
                                                {type}: {count}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Agents */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Agentes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {topAgents.map((agent, index) => (
                                <div key={agent.id} className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-slate-400 w-6">{index + 1}</span>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={agent.avatar} />
                                        <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{agent.name}</p>
                                        <p className="text-xs text-slate-500">{agent.listings} propiedades</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">{agent.sales}</p>
                                        <p className="text-xs text-slate-500">ventas</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Visits */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Próximas Visitas
                            </CardTitle>
                            <Link
                                href="/dashboard/agenda"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Ver todas
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentVisits.length === 0 ? (
                                <p className="text-slate-500 text-center py-4">No hay visitas programadas</p>
                            ) : (
                                recentVisits.map(visit => {
                                    const property = properties.find(p => p.id === visit.propertyId);
                                    const client = useCRMStore.getState().getClientById(visit.clientId);
                                    const agent = agents.find(a => a.id === visit.agentId);

                                    return (
                                        <div key={visit.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                                            <div className="w-20 text-center">
                                                <p className="text-lg font-bold text-blue-600">
                                                    {format(new Date(visit.scheduledAt), 'd', { locale: es })}
                                                </p>
                                                <p className="text-xs text-slate-500 uppercase">
                                                    {format(new Date(visit.scheduledAt), 'MMM', { locale: es })}
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{property?.title || 'Sin título'}</p>
                                                <p className="text-sm text-slate-500">
                                                    Cliente: {client?.name || 'N/A'} • Agente: {agent?.name.split(' ')[0] || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {format(new Date(visit.scheduledAt), 'HH:mm', { locale: es })}
                                                </p>
                                                <Badge variant="outline" className="text-xs">
                                                    {visit.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
