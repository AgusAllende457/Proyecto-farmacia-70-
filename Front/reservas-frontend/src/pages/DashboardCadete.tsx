import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@components/layout/DashboardLayout';
import { Card } from '@components/common/Card';
import { Badge } from '@components/common/Badge';
import { Button } from '@components/common/Button';
import { Alert } from '@components/common/Alert';
import { ConfirmarEntregaModal } from '../components/pedidos/ConfirmarEntregaModal';
import { DetallePedidoModal } from '../components/pedidos/DetallePedidoModal';
import { OrderFilters } from '@components/orders/OrderFilters';
import { pedidosService } from '../service/PedidosService';
import { OrderSummaryDTO } from '../types/pedido.types';
import { useAuth } from '@context/AuthContext';
import { Truck, MapPin, CheckCircle, Clock, Navigation, Eye, AlertCircle } from 'lucide-react';

export const DashboardCadete: React.FC = () => {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState<OrderSummaryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPedido, setSelectedPedido] = useState<OrderSummaryDTO | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPedidoDetalle, setSelectedPedidoDetalle] = useState<OrderSummaryDTO | null>(null);
    const [modalDetalleOpen, setModalDetalleOpen] = useState(false);

    useEffect(() => { 
        if (user?.id) loadPedidos(); 
    }, [user?.id]);

    const loadPedidos = async (filtros = {}) => {
        try {
            setLoading(true);
            // CORRECCIÓN: Ahora pasamos el objeto filtros al servicio
            const data = await pedidosService.getPedidosByRol('Cadete', user!.id, filtros);
            setPedidos(data);
        } catch (error) {
            console.error('Error al cargar pedidos del cadete:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmarEntrega = (pedido: OrderSummaryDTO) => {
        setSelectedPedido(pedido);
        setModalOpen(true);
    };

    const handleVerDetalle = (pedido: OrderSummaryDTO) => {
        setSelectedPedidoDetalle(pedido);
        setModalDetalleOpen(true);
    };

    const pedidosEnCamino = pedidos.filter(p => p.estadoNombre === 'En camino');

    if (loading && pedidos.length === 0) return (
        <DashboardLayout>
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {user?.nombreCompleto}</h1>
                    <p className="text-gray-600 mt-1">Panel de Entregas - {user?.nombreSucursal}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">En Camino</p><p className="text-2xl font-bold">{pedidosEnCamino.length}</p></div><Truck className="text-yellow-600"/></div></Card>
                    <Card><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Entregados Hoy</p><p className="text-2xl font-bold">{pedidos.filter(p => p.estadoNombre === 'Entregado').length}</p></div><CheckCircle className="text-green-600"/></div></Card>
                </div>

                {/* Filtros para el Cadete - Asegúrate que el componente filtre internamente por los estados de logística */}
                <OrderFilters userRole="Cadete" onFilterChange={loadPedidos} />

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-yellow-600" /> Pedidos en Camino
                        </h2>
                    </div>

                    {pedidosEnCamino.length === 0 ? (
                        <Alert type="info">No tienes pedidos en camino actualmente.</Alert>
                    ) : (
                        <div className="space-y-3">
                            {pedidosEnCamino.map((pedido) => (
                                <div key={pedido.idPedido} className={`border rounded-lg p-4 transition-colors ${pedido.estaDemorado ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <p className="font-semibold text-gray-900">Pedido #{pedido.idPedido}</p>
                                                <p className="text-sm text-gray-600">{pedido.clienteNombre}</p>
                                            </div>
                                            {pedido.estaDemorado && (
                                                <span title="Pedido Demorado">
                                                    <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
                                                </span>
                                            )}
                                        </div>
                                        <Badge variant="warning">{pedido.estadoNombre}</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="primary" size="sm" onClick={() => handleConfirmarEntrega(pedido)} className="flex-1">
                                            <Navigation className="w-4 h-4 mr-2" /> Confirmar Entrega
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={() => handleVerDetalle(pedido)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de Mis Entregas</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Cliente</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.idPedido} className={`hover:bg-gray-50 ${pedido.estaDemorado ? 'bg-red-50/30' : ''}`}>
                                        <td className="px-4 py-3 text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                #{pedido.idPedido}
                                                {pedido.estaDemorado && (
                                                    <span title="Pedido Demorado">
                                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{pedido.clienteNombre}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <Badge variant={pedido.estadoNombre === 'Entregado' ? 'success' : 'info'}>
                                                    {pedido.estadoNombre}
                                                </Badge>
                                                {pedido.estaDemorado && <span className="text-[10px] text-red-600 font-bold uppercase">Demorado</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleVerDetalle(pedido)} className="text-blue-600 font-bold text-sm hover:underline">Detalles</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {selectedPedido && (
                <ConfirmarEntregaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} pedido={selectedPedido} onSuccess={loadPedidos} />
            )}
            
            {selectedPedidoDetalle && (
                <DetallePedidoModal isOpen={modalDetalleOpen} onClose={() => setModalDetalleOpen(false)} pedido={selectedPedidoDetalle} />
            )}
        </DashboardLayout>
    );
};