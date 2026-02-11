'use client';

import { Header } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCRMStore } from '@/lib/store/crm-store';
import { PropertyType, PropertyOperation, PropertyStatus } from '@/types';
import {
    Search,
    Grid3X3,
    List,
    Bed,
    Bath,
    Maximize,
    MapPin,
    Euro,
    Plus,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PropiedadesPage() {
    const { properties, agents } = useCRMStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOperation, setFilterOperation] = useState<PropertyOperation | 'todas'>('todas');
    const [filterType, setFilterType] = useState<PropertyType | 'todos'>('todos');
    const [filterStatus, setFilterStatus] = useState<PropertyStatus | 'todos'>('todos');

    // Filter properties
    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.reference.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesOperation = filterOperation === 'todas' || property.operation === filterOperation;
        const matchesType = filterType === 'todos' || property.propertyType === filterType;
        const matchesStatus = filterStatus === 'todos' || property.status === filterStatus;

        return matchesSearch && matchesOperation && matchesType && matchesStatus;
    });

    const getStatusColor = (status: PropertyStatus) => {
        switch (status) {
            case 'disponible': return 'bg-green-100 text-green-700';
            case 'reservado': return 'bg-yellow-100 text-yellow-700';
            case 'vendido': return 'bg-blue-100 text-blue-700';
            case 'alquilado': return 'bg-purple-100 text-purple-700';
        }
    };

    const formatPrice = (price: number, operation: PropertyOperation) => {
        const formatted = new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(price);
        return operation === 'alquiler' ? `${formatted}/mes` : formatted;
    };

    return (
        <div className="flex flex-col h-full">
            <Header title="Propiedades" />

            <div className="flex-1 p-6 space-y-4 overflow-auto">
                {/* Filters Bar */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar por título, dirección o referencia..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Select value={filterOperation} onValueChange={(v) => setFilterOperation(v as PropertyOperation | 'todas')}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Operación" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todas</SelectItem>
                            <SelectItem value="venta">Venta</SelectItem>
                            <SelectItem value="alquiler">Alquiler</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterType} onValueChange={(v) => setFilterType(v as PropertyType | 'todos')}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="piso">Piso</SelectItem>
                            <SelectItem value="casa">Casa</SelectItem>
                            <SelectItem value="chalet">Chalet</SelectItem>
                            <SelectItem value="atico">Ático</SelectItem>
                            <SelectItem value="local">Local</SelectItem>
                            <SelectItem value="oficina">Oficina</SelectItem>
                            <SelectItem value="terreno">Terreno</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as PropertyStatus | 'todos')}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="disponible">Disponible</SelectItem>
                            <SelectItem value="reservado">Reservado</SelectItem>
                            <SelectItem value="vendido">Vendido</SelectItem>
                            <SelectItem value="alquilado">Alquilado</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 ml-auto">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <Link href="/dashboard/propiedades/nueva">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Propiedad
                        </Button>
                    </Link>
                </div>

                {/* Results Count */}
                <p className="text-sm text-slate-500">
                    Mostrando {filteredProperties.length} de {properties.length} propiedades
                </p>

                {/* Properties Grid/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProperties.map(property => {
                            const agent = agents.find(a => a.id === property.agentId);

                            return (
                                <Link key={property.id} href={`/dashboard/propiedades/${property.id}`}>
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                                        <div className="relative h-48">
                                            <img
                                                src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                                                alt={property.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 left-2 flex gap-2">
                                                <Badge className={property.operation === 'venta' ? 'bg-blue-600' : 'bg-green-600'}>
                                                    {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
                                                </Badge>
                                                <Badge className={getStatusColor(property.status)}>
                                                    {property.status}
                                                </Badge>
                                            </div>
                                            <div className="absolute bottom-2 right-2">
                                                <span className="bg-black/70 text-white px-2 py-1 rounded text-sm font-bold">
                                                    {formatPrice(property.price, property.operation)}
                                                </span>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <p className="text-xs text-slate-500 mb-1">{property.reference}</p>
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                                            <div className="flex items-center text-slate-500 text-sm mb-3">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                <span className="line-clamp-1">{property.zone}, {property.city}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-600 text-sm">
                                                {property.bedrooms > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Bed className="h-4 w-4" />
                                                        {property.bedrooms}
                                                    </span>
                                                )}
                                                {property.bathrooms > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Bath className="h-4 w-4" />
                                                        {property.bathrooms}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Maximize className="h-4 w-4" />
                                                    {property.area}m²
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredProperties.map(property => {
                            const agent = agents.find(a => a.id === property.agentId);

                            return (
                                <Link key={property.id} href={`/dashboard/propiedades/${property.id}`}>
                                    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="flex">
                                            <div className="w-48 h-32 relative shrink-0">
                                                <img
                                                    src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                                                    alt={property.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <CardContent className="flex-1 p-4 flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-xs text-slate-500">{property.reference}</p>
                                                        <Badge className={property.operation === 'venta' ? 'bg-blue-600' : 'bg-green-600'}>
                                                            {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
                                                        </Badge>
                                                        <Badge className={getStatusColor(property.status)}>
                                                            {property.status}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-semibold text-lg">{property.title}</h3>
                                                    <div className="flex items-center text-slate-500 text-sm mt-1">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {property.address}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-slate-600 text-sm mt-2">
                                                        {property.bedrooms > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <Bed className="h-4 w-4" />
                                                                {property.bedrooms} hab
                                                            </span>
                                                        )}
                                                        {property.bathrooms > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <Bath className="h-4 w-4" />
                                                                {property.bathrooms} baños
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Maximize className="h-4 w-4" />
                                                            {property.area}m²
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-blue-600">
                                                        {formatPrice(property.price, property.operation)}
                                                    </p>
                                                    {agent && (
                                                        <p className="text-sm text-slate-500 mt-1">
                                                            Agente: {agent.name.split(' ')[0]}
                                                        </p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
