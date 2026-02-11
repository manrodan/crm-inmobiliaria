'use client';

import { Header } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCRMStore } from '@/lib/store/crm-store';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    MapPin,
    User,
    Building2,
} from 'lucide-react';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AgendaPage() {
    const { visits, properties, clients, agents } = useCRMStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [filterAgent, setFilterAgent] = useState<string>('todos');

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { locale: es });
    const calendarEnd = endOfWeek(monthEnd, { locale: es });

    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const filteredVisits = visits.filter(v => {
        if (filterAgent !== 'todos' && v.agentId !== filterAgent) return false;
        return true;
    });

    const getVisitsForDay = (date: Date) => {
        return filteredVisits.filter(v => isSameDay(new Date(v.scheduledAt), date));
    };

    const selectedDayVisits = selectedDate ? getVisitsForDay(selectedDate) : [];

    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'programada': return 'bg-blue-500';
            case 'realizada': return 'bg-green-500';
            case 'cancelada': return 'bg-red-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="flex flex-col h-full">
            <Header title="Agenda" />

            <div className="flex-1 p-6 overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <h2 className="text-xl font-bold capitalize">
                                        {format(currentDate, 'MMMM yyyy', { locale: es })}
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Select value={filterAgent} onValueChange={setFilterAgent}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filtrar agente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos los agentes</SelectItem>
                                            {agents.map(agent => (
                                                <SelectItem key={agent.id} value={agent.id}>
                                                    {agent.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Nueva Visita
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Week days header */}
                            <div className="grid grid-cols-7 mb-2">
                                {weekDays.map(day => (
                                    <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map(day => {
                                    const dayVisits = getVisitsForDay(day);
                                    const isCurrentMonth = isSameMonth(day, currentDate);
                                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                                    const isTodayDate = isToday(day);

                                    return (
                                        <div
                                            key={day.toISOString()}
                                            className={`
                        min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors
                        ${isCurrentMonth ? 'bg-white' : 'bg-slate-50 text-slate-400'}
                        ${isSelected ? 'ring-2 ring-blue-500' : ''}
                        ${isTodayDate ? 'border-blue-500' : 'border-slate-200'}
                        hover:bg-slate-50
                      `}
                                            onClick={() => setSelectedDate(day)}
                                        >
                                            <div className={`
                        text-sm font-medium mb-1
                        ${isTodayDate ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}
                      `}>
                                                {format(day, 'd')}
                                            </div>
                                            <div className="space-y-1">
                                                {dayVisits.slice(0, 3).map(visit => (
                                                    <div
                                                        key={visit.id}
                                                        className={`text-xs px-1.5 py-0.5 rounded text-white truncate ${getStatusColor(visit.status)}`}
                                                    >
                                                        {format(new Date(visit.scheduledAt), 'HH:mm')}
                                                    </div>
                                                ))}
                                                {dayVisits.length > 3 && (
                                                    <div className="text-xs text-slate-500 pl-1">
                                                        +{dayVisits.length - 3} más
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded bg-blue-500" />
                                    <span className="text-sm text-slate-600">Programada</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded bg-green-500" />
                                    <span className="text-sm text-slate-600">Realizada</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded bg-red-500" />
                                    <span className="text-sm text-slate-600">Cancelada</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Day Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {selectedDate
                                    ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })
                                    : 'Selecciona un día'
                                }
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!selectedDate ? (
                                <p className="text-slate-500 text-center py-8">
                                    Haz clic en un día del calendario para ver las visitas
                                </p>
                            ) : selectedDayVisits.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-slate-500 mb-4">No hay visitas para este día</p>
                                    <Button variant="outline">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Programar Visita
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedDayVisits
                                        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                                        .map(visit => {
                                            const property = properties.find(p => p.id === visit.propertyId);
                                            const client = clients.find(c => c.id === visit.clientId);
                                            const agent = agents.find(a => a.id === visit.agentId);

                                            return (
                                                <div
                                                    key={visit.id}
                                                    className={`p-4 rounded-lg border-l-4 bg-slate-50 ${visit.status === 'programada' ? 'border-blue-500' :
                                                            visit.status === 'realizada' ? 'border-green-500' : 'border-red-500'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-slate-500" />
                                                            <span className="font-bold">
                                                                {format(new Date(visit.scheduledAt), 'HH:mm')}
                                                            </span>
                                                        </div>
                                                        <Badge variant="outline">{visit.status}</Badge>
                                                    </div>

                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-start gap-2">
                                                            <Building2 className="h-4 w-4 text-slate-400 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium">{property?.title || 'Propiedad'}</p>
                                                                <p className="text-slate-500">{property?.address}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-slate-400" />
                                                            <span>{client?.name || 'Cliente'}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-slate-400" />
                                                            <span className="text-slate-500">{agent?.name}</span>
                                                        </div>

                                                        {visit.notes && (
                                                            <p className="text-slate-600 bg-white p-2 rounded text-xs">
                                                                {visit.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Visits */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Próximas Visitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {filteredVisits
                                .filter(v => v.status === 'programada' && new Date(v.scheduledAt) >= new Date())
                                .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                                .slice(0, 4)
                                .map(visit => {
                                    const property = properties.find(p => p.id === visit.propertyId);
                                    const client = clients.find(c => c.id === visit.clientId);
                                    const agent = agents.find(a => a.id === visit.agentId);

                                    return (
                                        <Card key={visit.id} className="bg-slate-50">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-bold">
                                                        {format(new Date(visit.scheduledAt), 'd MMM', { locale: es })}
                                                    </div>
                                                    <span className="font-medium">
                                                        {format(new Date(visit.scheduledAt), 'HH:mm')}
                                                    </span>
                                                </div>
                                                <p className="font-medium line-clamp-1">{property?.title}</p>
                                                <p className="text-sm text-slate-500">{client?.name}</p>
                                                <p className="text-xs text-slate-400 mt-1">{agent?.name}</p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
