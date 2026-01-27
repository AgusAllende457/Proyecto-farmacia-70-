import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@components/layout/DashboardLayout';
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

    // Funciones auxiliares para avatar
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const getAvatarColor = (name: string) => {
        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
        return colors[name.length % colors.length];
    };

    const pedidosPreparando = pedidos.filter(p => p.estadoNombre === 'Preparar pedido');
    const pedidosListos = pedidos.filter(p => p.estadoNombre === 'Listo para despachar');

    return (
        <DashboardLayout>
            <div className="space-y-8 font-sans">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hola, {user?.nombreCompleto?.split(' ')[0]}</h1>
                    <p className="text-gray-500 mt-1">Panel de Preparación - {user?.nombreSucursal}</p>
                </div>

                {/* Estadísticas Visuales (Estilo Bordeado) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* En Preparación - Azul */}
                    <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                        <div className="relative z-10">
                            <p className="text-blue-600 text-sm font-medium mb-1">En Preparación</p>
                            <h3 className="text-4xl font-bold mb-2 text-blue-900">{pedidosPreparando.length}</h3>
                            <p className="text-gray-500 text-xs">Pedidos pendientes de armar</p>
                        </div>
                        <div className="absolute right-4 top-4 bg-blue-100/50 p-3 rounded-xl backdrop-blur-sm">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>

                    {/* Listos - Verde */}
                    <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                        <div className="relative z-10">
                            <p className="text-emerald-600 text-sm font-medium mb-1">Listos</p>
                            <h3 className="text-4xl font-bold mb-2 text-emerald-900">{pedidosListos.length}</h3>
                            <p className="text-gray-500 text-xs">Esperando cadete</p>
                        </div>
                        <div className="absolute right-4 top-4 bg-emerald-100/50 p-3 rounded-xl backdrop-blur-sm">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>

                    {/* Total - Violeta */}
                    <div className="bg-white border-2 border-purple-500 rounded-2xl p-6 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                        <div className="relative z-10">
                            <p className="text-purple-600 text-sm font-medium mb-1">Total Asignados</p>
                            <h3 className="text-4xl font-bold mb-2 text-purple-900">{pedidos.length}</h3>
                            <p className="text-gray-500 text-xs">Historial reciente</p>
                        </div>
                        <div className="absolute right-4 top-4 bg-purple-100/50 p-3 rounded-xl backdrop-blur-sm">
                            <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                    <OrderFilters userRole="Operario" onFilterChange={loadPedidos} />
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-800">Mis Pedidos Asignados</h2>
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Últimos actualizados</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                    <tr>
                                        <th className="p-5">ID</th>
                                        <th className="p-5">Cliente</th>
                                        <th className="p-5">Estado</th>
                                        <th className="p-5">Total</th>
                                        <th className="p-5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pedidos.map((pedido) => (
                                        <tr key={pedido.idPedido} className={`hover:bg-gray-50 transition-colors ${pedido.estaDemorado ? 'bg-red-50/30' : ''}`}>
                                            <td className="p-5 font-bold text-gray-700">
                                                #{pedido.idPedido}
                                                {pedido.estaDemorado && <AlertCircle className="w-4 h-4 text-red-500 inline ml-2" />}
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full ${getAvatarColor(pedido.clienteNombre)} text-white flex items-center justify-center font-bold text-xs`}>
                                                        {getInitials(pedido.clienteNombre)}
                                                    </div>
                                                    <span className="font-medium text-gray-800">{pedido.clienteNombre}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <Badge variant={pedido.estadoNombre === 'Listo para despachar' ? 'success' : 'info'}>
                                                    {pedido.estadoNombre}
                                                </Badge>
                                                {pedido.estaDemorado && <span className="block text-[10px] text-red-500 font-bold mt-1 uppercase">Demorado</span>}
                                            </td>
                                            <td className="p-5 text-gray-600 font-mono">${pedido.total.toFixed(2)}</td>
                                            <td className="p-5 text-right">
                                                <button 
                                                    onClick={() => handleVerDetalle(pedido)} 
                                                    className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center justify-end gap-1 ml-auto"
                                                >
                                                    <Eye className="w-4 h-4" /> Ver detalle
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pedidos.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-400">No hay pedidos asignados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
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