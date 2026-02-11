'use client';

import { Header } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useCRMStore } from '@/lib/store/crm-store';
import { ClientType } from '@/types';
import {
    Search,
    Plus,
    Phone,
    Mail,
    Euro,
    MapPin,
    Eye,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ClientesPage() {
    const { clients, visits, interactions } = useCRMStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<ClientType | 'todos'>('todos');

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm);
        const matchesType = filterType === 'todos' || client.type === filterType;
        return matchesSearch && matchesType;
    });

    const getTypeColor = (type: ClientType) => {
        switch (type) {
            case 'comprador': return 'bg-blue-100 text-blue-700';
            case 'vendedor': return 'bg-green-100 text-green-700';
            case 'inquilino': return 'bg-purple-100 text-purple-700';
            case 'propietario': return 'bg-orange-100 text-orange-700';
        }
    };

    const getClientVisits = (clientId: string) => {
        return visits.filter(v => v.clientId === clientId).length;
    };

    const getClientInteractions = (clientId: string) => {
        return interactions.filter(i => i.clientId === clientId).length;
    };

    return (
        <div className="flex flex-col h-full">
            <Header title="Clientes" />

            <div className="flex-1 p-6 space-y-4 overflow-auto">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Clientes', value: clients.length, color: 'bg-slate-100' },
                        { label: 'Compradores', value: clients.filter(c => c.type === 'comprador').length, color: 'bg-blue-50' },
                        { label: 'Vendedores', value: clients.filter(c => c.type === 'vendedor').length, color: 'bg-green-50' },
                        { label: 'Inquilinos', value: clients.filter(c => c.type === 'inquilino').length, color: 'bg-purple-50' },
                    ].map(stat => (
                        <Card key={stat.label} className={stat.color}>
                            <CardContent className="p-4">
                                <p className="text-sm text-slate-600">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar por nombre, email o teléfono..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Select value={filterType} onValueChange={(v) => setFilterType(v as ClientType | 'todos')}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos los tipos</SelectItem>
                            <SelectItem value="comprador">Comprador</SelectItem>
                            <SelectItem value="vendedor">Vendedor</SelectItem>
                            <SelectItem value="inquilino">Inquilino</SelectItem>
                            <SelectItem value="propietario">Propietario</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button className="ml-auto bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Cliente
                    </Button>
                </div>

                {/* Clients Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Contacto</TableHead>
                                <TableHead>Presupuesto</TableHead>
                                <TableHead>Zonas</TableHead>
                                <TableHead>Visitas</TableHead>
                                <TableHead>Interacciones</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.map(client => (
                                <TableRow key={client.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-slate-200">
                                                    {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{client.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    Desde {format(new Date(client.createdAt), "MMM yyyy", { locale: es })}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getTypeColor(client.type)}>
                                            {client.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <a href={`tel:${client.phone}`} className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600">
                                                <Phone className="h-3 w-3" />
                                                {client.phone}
                                            </a>
                                            <a href={`mailto:${client.email}`} className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600">
                                                <Mail className="h-3 w-3" />
                                                {client.email}
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {client.budgetMin || client.budgetMax ? (
                                            <div className="flex items-center gap-1 text-sm">
                                                <Euro className="h-3 w-3 text-slate-400" />
                                                {client.budgetMin && client.budgetMax
                                                    ? `${(client.budgetMin / 1000).toFixed(0)}k - ${(client.budgetMax / 1000).toFixed(0)}k`
                                                    : client.budgetMax
                                                        ? `Hasta ${(client.budgetMax / 1000).toFixed(0)}k`
                                                        : `Desde ${(client.budgetMin! / 1000).toFixed(0)}k`
                                                }
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {client.zones.slice(0, 2).map(zone => (
                                                <Badge key={zone} variant="outline" className="text-xs">
                                                    {zone}
                                                </Badge>
                                            ))}
                                            {client.zones.length > 2 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{client.zones.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{getClientVisits(client.id)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{getClientInteractions(client.id)}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/clientes/${client.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
