'use client';

import { Header } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCRMStore } from '@/lib/store/crm-store';
import {
    Phone,
    Mail,
    Star,
    Building2,
    TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function AgentesPage() {
    const { agents, properties, visits } = useCRMStore();

    const getAgentStats = (agentId: string) => {
        const agentProperties = properties.filter(p => p.agentId === agentId);
        const agentVisits = visits.filter(v => v.agentId === agentId);
        const completedVisits = agentVisits.filter(v => v.status === 'realizada');

        return {
            activeListings: agentProperties.filter(p => p.status === 'disponible').length,
            totalListings: agentProperties.length,
            scheduledVisits: agentVisits.filter(v => v.status === 'programada').length,
            completedVisits: completedVisits.length,
        };
    };

    return (
        <div className="flex flex-col h-full">
            <Header title="Agentes" />

            <div className="flex-1 p-6 space-y-6 overflow-auto">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-slate-600">Total Agentes</p>
                            <p className="text-2xl font-bold">{agents.length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-slate-600">Ventas Totales</p>
                            <p className="text-2xl font-bold text-green-600">
                                {agents.reduce((acc, a) => acc + a.sales, 0)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-slate-600">Propiedades Activas</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {agents.reduce((acc, a) => acc + a.listings, 0)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-slate-600">Rating Promedio</p>
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                <span className="text-2xl font-bold">
                                    {(agents.reduce((acc, a) => acc + a.rating, 0) / agents.length).toFixed(1)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {agents.map(agent => {
                        const stats = getAgentStats(agent.id);

                        return (
                            <Card key={agent.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-20 bg-gradient-to-r from-blue-500 to-blue-600" />
                                <CardContent className="pt-0 -mt-10 relative">
                                    <Avatar className="h-20 w-20 border-4 border-white mx-auto">
                                        <AvatarImage src={agent.avatar} />
                                        <AvatarFallback className="text-xl">
                                            {agent.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="text-center mt-3">
                                        <h3 className="font-bold text-lg">{agent.name}</h3>
                                        <div className="flex items-center justify-center gap-1 mt-1">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm font-medium">{agent.rating}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                                        <div className="bg-green-50 rounded-lg p-3">
                                            <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                                            <p className="text-lg font-bold text-green-600">{agent.sales}</p>
                                            <p className="text-xs text-green-600">Ventas</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <Building2 className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                                            <p className="text-lg font-bold text-blue-600">{stats.activeListings}</p>
                                            <p className="text-xs text-blue-600">Activas</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm">
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

                                    <div className="mt-4 pt-4 border-t flex gap-2">
                                        <Badge variant="outline" className="flex-1 justify-center">
                                            {stats.scheduledVisits} visitas prog.
                                        </Badge>
                                        <Badge variant="outline" className="flex-1 justify-center">
                                            {stats.completedVisits} realizadas
                                        </Badge>
                                    </div>

                                    <Link href={`/agentes/${agent.id}`}>
                                        <Button className="w-full mt-4" variant="outline">
                                            Ver Perfil
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
