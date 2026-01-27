import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@components/layout/DashboardLayout';
import { Card } from '@components/common/Card';
import { Badge } from '@components/common/Badge';
import { DetallePedidoModal } from '../components/pedidos/DetallePedidoModal';
import { OrderFilters } from '@components/orders/OrderFilters';
import { pedidosService } from '../service/PedidosService';
import { OrderSummaryDTO } from '../types/pedido.types';
import { useAuth } from '@context/AuthContext';
import { Package, Clock, CheckCircle, Eye, AlertCircle } from 'lucide-react';

export const DashboardOperario: React.FC = () => {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState<OrderSummaryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPedidoDetalle, setSelectedPedidoDetalle] = useState<OrderSummaryDTO | null>(null);
    const [modalDetalleOpen, setModalDetalleOpen] = useState(false);

    useEffect(() => { 
        if (user?.id) loadPedidos(); 
    }, [user?.id]);

    const loadPedidos = async (filtros = {}) => {
        try {
            setLoading(true);
            // Ahora sí enviamos el objeto 'filtros' al servicio
            const data = await pedidosService.getPedidosByRol('Operario', user!.id, filtros);
            setPedidos(data);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerDetalle = (pedido: OrderSummaryDTO) => {
        setSelectedPedidoDetalle(pedido);
        setModalDetalleOpen(true);
    };

    const pedidosPreparando = pedidos.filter(p => p.estadoNombre === 'Preparar pedido');
    const pedidosListos = pedidos.filter(p => p.estadoNombre === 'Listo para despachar');

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
                    <p className="text-gray-600 mt-1">Panel de Preparación - {user?.nombreSucursal}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">En Preparación</p><p className="text-3xl font-bold text-gray-900 mt-2">{pedidosPreparando.length}</p></div><div className="bg-blue-100 p-3 rounded-full"><Package className="w-8 h-8 text-blue-600" /></div></div></Card>
                    <Card><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Listos</p><p className="text-3xl font-bold text-gray-900 mt-2">{pedidosListos.length}</p></div><div className="bg-green-100 p-3 rounded-full"><CheckCircle className="w-8 h-8 text-green-600" /></div></div></Card>
                    <Card><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Total Asignados</p><p className="text-3xl font-bold text-gray-900 mt-2">{pedidos.length}</p></div><div className="bg-purple-100 p-3 rounded-full"><Clock className="w-8 h-8 text-purple-600" /></div></div></Card>
                </div>

                {/* Este componente ahora dispara loadPedidos(filtros) correctamente */}
                <OrderFilters userRole="Operario" onFilterChange={loadPedidos} />

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
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pedidos.map((pedido) => (
                                    <tr 
                                        key={pedido.idPedido} 
                                        className={`hover:bg-gray-50 transition-colors ${pedido.estaDemorado ? 'bg-red-50/50' : ''}`}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            <div className="flex items-center gap-2">
                                                #{pedido.idPedido}
                                                {pedido.estaDemorado && (
                                                    <span title="Pedido Demorado">
                                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{pedido.clienteNombre}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <Badge variant={pedido.estadoNombre === 'Listo para despachar' ? 'success' : 'info'}>
                                                    {pedido.estadoNombre}
                                                </Badge>
                                                {pedido.estaDemorado && (
                                                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Demorado</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">${pedido.total.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => handleVerDetalle(pedido)} 
                                                className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center justify-end gap-1 ml-auto"
                                            >
                                                <Eye className="w-4 h-4" /> Ver detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {pedidos.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            No se encontraron pedidos con los filtros aplicados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {selectedPedidoDetalle && (
                <DetallePedidoModal 
                    isOpen={modalDetalleOpen} 
                    onClose={() => { setModalDetalleOpen(false); setSelectedPedidoDetalle(null); }} 
                    pedido={selectedPedidoDetalle} 
                />
            )}
        </DashboardLayout>
    );
};