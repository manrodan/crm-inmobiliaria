'use client';

import { Header } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import {
    Send,
    CheckCircle,
    AlertCircle,
    Copy,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TestLeadPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [properties, setProperties] = useState<Array<{ reference: string; title: string }>>([]);

    const [formData, setFormData] = useState({
        name: 'Juan García Pérez',
        email: 'juan.garcia@email.com',
        phone: '+34 666 777 888',
        message: 'Hola, estoy interesado en el inmueble. ¿Podría darme más información y concertar una visita?',
        property_reference: '',
        source: 'idealista',
    });

    useEffect(() => {
        // Fetch properties for the dropdown
        const fetchProperties = async () => {
            const { data } = await supabase
                .from('properties')
                .select('reference, title')
                .eq('status', 'disponible');

            if (data) {
                setProperties(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, property_reference: data[0].reference }));
                }
            }
        };
        fetchProperties();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer crm-marvic-webhook-secret-2024',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setResult({
                    success: true,
                    message: `Lead creado correctamente. ID: ${data.lead_id}`,
                });
                // Reset form
                setFormData(prev => ({
                    ...prev,
                    name: `Cliente Test ${Date.now().toString().slice(-4)}`,
                    email: `test${Date.now()}@email.com`,
                }));
            } else {
                setResult({
                    success: false,
                    message: data.error || 'Error al crear el lead',
                });
            }
        } catch (error) {
            setResult({
                success: false,
                message: 'Error de conexión',
            });
        }

        setLoading(false);
    };

    const webhookUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/api/leads`
        : '/api/leads';

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="flex flex-col h-full">
            <Header title="Test de Leads" />

            <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Info Card */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">
                                🧪 Página de Pruebas
                            </h3>
                            <p className="text-sm text-blue-700">
                                Esta página simula el envío de leads desde Make (Integromat).
                                Usa el formulario para probar la captura de leads o copia la URL del webhook para configurar Make.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Test Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Simular Lead de Idealista</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre del interesado</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Teléfono</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="property">Propiedad</Label>
                                        <Select
                                            value={formData.property_reference}
                                            onValueChange={(v) => setFormData({ ...formData, property_reference: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar propiedad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {properties.map(p => (
                                                    <SelectItem key={p.reference} value={p.reference}>
                                                        {p.reference} - {p.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Mensaje</Label>
                                        <textarea
                                            id="message"
                                            className="w-full min-h-[100px] p-3 border rounded-md text-sm"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        <Send className="h-4 w-4 mr-2" />
                                        {loading ? 'Enviando...' : 'Enviar Lead de Prueba'}
                                    </Button>

                                    {result && (
                                        <div className={`p-3 rounded-lg flex items-center gap-2 ${result.success
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                            {result.success ? (
                                                <CheckCircle className="h-5 w-5" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5" />
                                            )}
                                            {result.message}
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>

                        {/* Webhook Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuración para Make</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-slate-500">Webhook URL</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Input value={webhookUrl} readOnly className="font-mono text-sm" />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyToClipboard(webhookUrl)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-slate-500">Method</Label>
                                    <Input value="POST" readOnly className="mt-1" />
                                </div>

                                <div>
                                    <Label className="text-slate-500">Headers</Label>
                                    <div className="mt-1 p-3 bg-slate-50 rounded font-mono text-sm">
                                        <p>Content-Type: application/json</p>
                                        <p>Authorization: Bearer crm-marvic-webhook-secret-2024</p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-slate-500">Body (JSON)</Label>
                                    <pre className="mt-1 p-3 bg-slate-900 text-green-400 rounded text-xs overflow-x-auto">
                                        {`{
  "name": "Nombre del cliente",
  "email": "email@ejemplo.com",
  "phone": "+34 666 777 888",
  "message": "Mensaje del formulario",
  "property_reference": "MV-2024-001",
  "source": "idealista"
}`}
                                    </pre>
                                </div>

                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                                    <strong>Nota:</strong> Para usar Make en producción, necesitarás desplegar
                                    la app en Vercel u otro hosting. Mientras tanto, puedes usar ngrok para
                                    exponer tu localhost.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
