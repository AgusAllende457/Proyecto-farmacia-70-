import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@components/layout/DashboardLayout';
import { Card } from '@components/common/Card';
import { Badge } from '@components/common/Badge';
import { Button } from '@components/common/Button';
import { Alert } from '@components/common/Alert';
import { ConfirmarEntregaModal } from '../components/pedidos/ConfirmarEntregaModal';
import { DetallePedidoModal } from '../components/pedidos/DetallePedidoModal';
import { pedidosService } from '../service/PedidosService';
import { OrderSummaryDTO } from '../types/pedido.types';
import { useAuth } from '@context/AuthContext';
import { 
    Truck, 
    MapPin, 
    Package, 
    CheckCircle, 
    XCircle,
    Clock,
    Navigation,
    Eye 
} from 'lucide-react';

export const DashboardCadete: React.FC = () => {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState<OrderSummaryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPedido, setSelectedPedido] = useState<OrderSummaryDTO | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [selectedPedidoDetalle, setSelectedPedidoDetalle] = useState<OrderSummaryDTO | null>(null);
    const [modalDetalleOpen, setModalDetalleOpen] = useState(false);

    useEffect(() => {
        loadPedidos();
    }, []);

    const loadPedidos = async () => {
        try {
            const data = await pedidosService.getPedidosByRol('Cadete', user!.id);
            setPedidos(data);
        } catch (error) {
            console.error('Error cargando pedidos:', error);
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

    const handleSuccess = () => {
        loadPedidos();
    };

    const pedidosEnCamino = pedidos.filter(p => p.estadoNombre === 'En camino');
    const pedidosDespachando = pedidos.filter(p => p.estadoNombre === 'Despachando');
    const pedidosEntregados = pedidos.filter(p => p.estadoNombre === 'Entregado');
    const pedidosFallidos = pedidos.filter(p => p.estadoNombre === 'Entrega fallida');

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Bienvenido, {user?.nombreCompleto}
                    </h1>
                    <p className="text-gray-600 mt-1">Panel de Entregas - {user?.nombreSucursal}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">En Camino</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{pedidosEnCamino.length}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <Truck className="w-8 h-8 text-yellow-600" />
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Por Despachar</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{pedidosDespachando.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Package className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Entregados Hoy</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{pedidosEntregados.length}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Entregas Fallidas</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{pedidosFallidos.length}</p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-full">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Pedidos en Camino */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-yellow-600" />
                            Pedidos en Camino
                        </h2>
                        <Badge variant="warning">{pedidosEnCamino.length}</Badge>
                    </div>

                    {pedidosEnCamino.length === 0 ? (
                        <Alert type="info">No tienes pedidos en camino en este momento.</Alert>
                    ) : (
                        <div className="space-y-3">
                            {pedidosEnCamino.map((pedido) => (
                                <div key={pedido.idPedido} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="font-semibold text-gray-900">Pedido #{pedido.idPedido}</p>
                                            <p className="text-sm text-gray-600">{pedido.clienteNombre}</p>
                                        </div>
                                        <Badge variant="warning">{pedido.estadoNombre}</Badge>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>Estimado: {new Date(pedido.fechaEntregaEstimada).toLocaleString('es-AR')}</span>
                                        </div>
                                    </div>

                                    {/* ORDEN CAMBIADO AQUÍ: Confirmar primero */}
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="primary" 
                                            size="sm" 
                                            onClick={() => handleConfirmarEntrega(pedido)} 
                                            className="flex-1"
                                        >
                                            <Navigation className="w-4 h-4 mr-2" />
                                            Confirmar Entrega
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            onClick={() => handleVerDetalle(pedido)}
                                            title="Ver detalles"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Tabla de Todos los Pedidos */}
                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Todos Mis Pedidos</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cliente</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fecha Estimada</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.idPedido} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">#{pedido.idPedido}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{pedido.clienteNombre}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={
                                                pedido.estadoNombre === 'Entregado' ? 'success' :
                                                pedido.estadoNombre === 'Entrega fallida' ? 'danger' :
                                                pedido.estadoNombre === 'En camino' ? 'warning' : 'info'
                                            }>
                                                {pedido.estadoNombre}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(pedido.fechaEntregaEstimada).toLocaleDateString('es-AR')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end items-center gap-3">
                                                {/* ORDEN CAMBIADO AQUÍ: Confirmar primero si está en camino */}
                                                {pedido.estadoNombre === 'En camino' && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="primary" 
                                                        onClick={() => handleConfirmarEntrega(pedido)}
                                                    >
                                                        Confirmar
                                                    </Button>
                                                )}
                                                <button 
                                                    onClick={() => handleVerDetalle(pedido)}
                                                    className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" /> Ver detalle
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Modales */}
            {selectedPedido && (
                <ConfirmarEntregaModal
                    isOpen={modalOpen}
                    onClose={() => setSelectedPedido(null)}
                    pedido={selectedPedido}
                    onSuccess={handleSuccess}
                />
            )}

            {selectedPedidoDetalle && (
                <DetallePedidoModal 
                    isOpen={modalDetalleOpen} 
                    onClose={() => {
                        setModalDetalleOpen(false);
                        setSelectedPedidoDetalle(null);
                    }} 
                    pedido={selectedPedidoDetalle} 
                />
            )}
        </DashboardLayout>
    );
};