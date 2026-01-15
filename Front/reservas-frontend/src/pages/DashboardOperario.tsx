import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@components/layout/DashboardLayout';
import { Card } from '@components/common/Card';
import { Badge } from '@components/common/Badge';
import { pedidosService } from '../service/PedidosService';
import { OrderSummaryDTO } from '../types/pedido.types';
import { useAuth } from '@context/AuthContext';
import { Package, Clock, CheckCircle } from 'lucide-react';

export const DashboardOperario: React.FC = () => {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState<OrderSummaryDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPedidos();
    }, []);

    const loadPedidos = async () => {
        try {
            const data = await pedidosService.getPedidosByRol('Operario', user!.id);
            setPedidos(data);
        } catch (error) {
            console.error('Error cargando pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const pedidosPreparando = pedidos.filter(p => p.estadoNombre === 'Preparar pedido');
    const pedidosListos = pedidos.filter(p => p.estadoNombre === 'Listo para despachar');

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Bienvenido, {user?.nombreCompleto}
                    </h1>
                    <p className="text-gray-600 mt-1">Panel de Preparación - {user?.nombreSucursal}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">En Preparación</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{pedidosPreparando.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Package className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Listos</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{pedidosListos.length}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Asignados</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{pedidos.length}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Clock className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Pedidos Asignados</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cliente</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.idPedido} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            #{pedido.idPedido}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {pedido.clienteNombre}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={
                                                pedido.estadoNombre === 'Listo para despachar' ? 'success' : 'info'
                                            }>
                                                {pedido.estadoNombre}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            ${pedido.total.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(pedido.fecha).toLocaleDateString('es-AR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};