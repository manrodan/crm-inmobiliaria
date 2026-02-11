'use client';

import { Bell, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface HeaderProps {
    title?: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                {title && <h1 className="text-xl font-semibold text-slate-900">{title}</h1>}
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="search"
                        placeholder="Buscar..."
                        className="pl-9 bg-slate-50 border-slate-200"
                    />
                </div>

                {/* Quick Add */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-1" />
                            Nuevo
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/propiedades/nueva">Nueva Propiedad</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/clientes/nuevo">Nuevo Cliente</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/agenda/nueva-visita">Nueva Visita</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-slate-600" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 px-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-slate-700">Admin</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Perfil</DropdownMenuItem>
                        <DropdownMenuItem>Configuración</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Cerrar Sesión</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
