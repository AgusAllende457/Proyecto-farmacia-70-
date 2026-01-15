import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@components/layout/DashboardLayout';
import { Card } from '@components/common/Card';
import { Badge } from '@components/common/Badge';
import { Button } from '@components/common/Button';
import { AsignarCadeteModal } from '../components/pedidos/AsignarCadeteModal';
import { pedidosService } from '../service/PedidosService';
import { OrderSummaryDTO } from '../types/pedido.types';
import { Truck } from 'lucide-react';

export const AsignarCadetePage: React.FC = () => {
    const [pedidos, setPedidos] = useState<OrderSummaryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPedido, setSelectedPedido] = useState<OrderSummaryDTO | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        loadPedidos();
    }, []);

    const loadPedidos = async () => {
        try {
            const data = await pedidosService.getFilteredOrders({
                idEstadoDePedido: 4, // Listo para despachar
            });
            setPedidos(data);
        } catch (error) {
            console.error('Error cargando pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAsignar = (pedido: OrderSummaryDTO) => {
        setSelectedPedido(pedido);
        setModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Truck className="w-8 h-8" />
                            Asignar Cadetes
                        </h1>
                        <p className="text-gray-600 mt-1">Pedidos listos para despacho (RF19)</p>
                    </div>
                    <Badge variant="success" size="md">
                        {pedidos.length} listos
                    </Badge>
                </div>

                <Card>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : pedidos.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No hay pedidos listos para despachar</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cliente</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Preparado por</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Acciones</th>
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
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {pedido.responsableNombre}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                ${pedido.total.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    onClick={() => handleAsignar(pedido)}
                                                >
                                                    Asignar Cadete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            {selectedPedido && (
                <AsignarCadeteModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    pedido={selectedPedido}
                    onSuccess={loadPedidos}
                />
            )}
        </DashboardLayout>
    );
};