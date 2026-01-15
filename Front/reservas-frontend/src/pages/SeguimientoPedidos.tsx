import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@components/layout/DashboardLayout';
import { Card } from '@components/common/Card';
import { Input } from '@components/common/Input';
import { Select } from '@components/common/Select';
import { Button } from '@components/common/Button';
import { Badge } from '@components/common/Badge';
import { Alert } from '@components/common/Alert';
import { Modal } from '@components/common/Modal';
import { TrackingTimeline } from '@components/seguimiento/TrackingTimeline';
import { pedidosService } from '../service/PedidosService';
import { trackingService } from '../service/trackingService';
import { OrderSummaryDTO, OrderFilterDTO } from '../types/pedido.types';
import { OrderTrackingDTO } from '../types/tracking.types';
import { Search, Filter, Eye, Calendar } from 'lucide-react';

export const SeguimientoPedidos: React.FC = () => {
    const [pedidos, setPedidos] = useState<OrderSummaryDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<OrderFilterDTO>({});
    const [selectedTracking, setSelectedTracking] = useState<OrderTrackingDTO | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const estadosOptions = [
        { value: '1', label: 'Sin preparar' },
        { value: '2', label: 'Preparar pedido' },
        { value: '3', label: 'Demorado' },
        { value: '4', label: 'Listo para despachar' },
        { value: '5', label: 'Despachando' },
        { value: '6', label: 'En camino' },
        { value: '7', label: 'Entregado' },
        { value: '8', label: 'Entrega fallida' },
        { value: '10', label: 'Cancelado' },
    ];

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await pedidosService.getFilteredOrders(filters);
            setPedidos(data);
        } catch (error) {
            console.error('Error al buscar pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerSeguimiento = async (idPedido: number) => {
        try {
            const tracking = await trackingService.getSeguimiento(idPedido);
            setSelectedTracking(tracking);
            setModalOpen(true);
        } catch (error) {
            console.error('Error al obtener seguimiento:', error);
        }
    };

    const handleFilterChange = (field: keyof OrderFilterDTO, value: any) => {
        setFilters(prev => ({
            ...prev,
            [field]: value || undefined,
        }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Search className="w-8 h-8" />
                        Seguimiento de Pedidos
                    </h1>
                    <p className="text-gray-600 mt-1">Historial completo y trazabilidad (RF6, RF13)</p>
                </div>

                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            label="Estado"
                            value={filters.idEstadoDePedido?.toString() || ''}
                            onChange={(e) => handleFilterChange('idEstadoDePedido', e.target.value ? parseInt(e.target.value) : undefined)}
                            options={estadosOptions}
                        />

                        <Input
                            type="date"
                            label="Fecha Desde"
                            value={filters.fechaDesde || ''}
                            onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                        />

                        <Input
                            type="date"
                            label="Fecha Hasta"
                            value={filters.fechaHasta || ''}
                            onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 mt-4">
                        <Button variant="primary" onClick={handleSearch} isLoading={loading}>
                            <Search className="w-4 h-4 mr-2" />
                            Buscar
                        </Button>
                        <Button variant="secondary" onClick={clearFilters}>
                            Limpiar Filtros
                        </Button>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Resultados de la Búsqueda
                        </h2>
                        <Badge variant="info">{pedidos.length} pedidos</Badge>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : pedidos.length === 0 ? (
                        <Alert type="info">
                            No se encontraron pedidos con los filtros aplicados.
                        </Alert>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fecha</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cliente</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Responsable</th>
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
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(pedido.fecha).toLocaleDateString('es-AR')}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {pedido.clienteNombre}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={
                                                    pedido.estadoNombre === 'Entregado' ? 'success' :
                                                    pedido.estadoNombre === 'Cancelado' ? 'danger' :
                                                    pedido.estaDemorado ? 'warning' : 'info'
                                                }>
                                                    {pedido.estadoNombre}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {pedido.responsableNombre}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                ${pedido.total.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => handleVerSeguimiento(pedido.idPedido)}
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Ver Historial
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

            {selectedTracking && (
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={`Historial del Pedido #${selectedTracking.idPedido}`}
                    size="lg"
                >
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-800">Estado Actual</p>
                                    <p className="text-xl font-bold text-blue-900">{selectedTracking.estadoActual}</p>
                                </div>
                                <Calendar className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-sm text-blue-700 mt-2">
                                Última actualización: {new Date(selectedTracking.ultimaActualizacion).toLocaleString('es-AR')}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Historial de Estados
                            </h3>
                            <TrackingTimeline tracking={selectedTracking} />
                        </div>
                    </div>
                </Modal>
            )}
        </DashboardLayout>
    );
};