'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Building2,
    Users,
    UserCircle,
    Calendar,
    Settings,
    ChevronLeft,
    ChevronRight,
    Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
{ name: 'Leads', href: '/dashboard/leads', icon: Bell },
{ name: 'Propiedades', href: '/dashboard/propiedades', icon: Building2 },
{ name: 'Clientes', href: '/dashboard/clientes', icon: Users },
{ name: 'Agentes', href: '/dashboard/agentes', icon: UserCircle },
{ name: 'Agenda', href: '/dashboard/agenda', icon: Calendar },

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                'flex flex-col bg-slate-900 text-white transition-all duration-300',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <Building2 className="h-8 w-8 text-blue-500" />
                        <span className="font-bold text-lg">InmoMarvic</span>
                    </div>
                )}
                {collapsed && <Building2 className="h-8 w-8 text-blue-500 mx-auto" />}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4">
                <ul className="space-y-1 px-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                                        isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    )}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {!collapsed && <span>{item.name}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Settings & Collapse */}
            <div className="border-t border-slate-800 p-2">
                <Link
                    href="/dashboard/configuracion"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <Settings className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>Configuración</span>}
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-slate-400 hover:text-white hover:bg-slate-800"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            <span>Colapsar</span>
                        </>
                    )}
                </Button>
            </div>
        </aside>
    );
}
