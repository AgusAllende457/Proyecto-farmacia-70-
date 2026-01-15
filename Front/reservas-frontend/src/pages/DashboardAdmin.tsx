import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout.tsx';
import { Card } from '../components/common/Card.tsx';
import { Badge } from '@components/common/Badge.tsx';
import { Alert } from '@components/common/Alert';
import { pedidosService } from '../service/PedidosService';
import { OrderSummaryDTO } from '../types/pedido.types';
import { useAuth } from '@context/AuthContext';
import { 

Package, 
TrendingUp, 
AlertTriangle, 
CheckCircle, 
XCircle,
Clock,
Users,
Truck
} from 'lucide-react';

export const DashboardAdmin: React.FC = () => {
const { user } = useAuth();
const [pedidos, setPedidos] = useState<OrderSummaryDTO[]>([]);
const [loading, setLoading] = useState(true);
const [stats, setStats] = useState({
    activos: 0,
    demorados: 0,
    entregados: 0,
    cancelados: 0,
});

useEffect(() => {
    loadDashboardData();
}, []);

const loadDashboardData = async () => {
    try {
        const data = await pedidosService.getFilteredOrders({});
        setPedidos(data);
        
        // Calcular estadísticas (RF14)
        setStats({
            activos: data.filter(p => !['Entregado', 'Cancelado'].includes(p.estadoNombre)).length,
            demorados: data.filter(p => p.estaDemorado).length,
            entregados: data.filter(p => p.estadoNombre === 'Entregado').length,
            cancelados: data.filter(p => p.estadoNombre === 'Cancelado').length,
        });
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    } finally {
        setLoading(false);
    }
};

// RF14: Pedidos demorados
const pedidosDemorados = pedidos.filter(p => p.estaDemorado);
const pedidosSinPreparar = pedidos.filter(p => p.estadoNombre === 'Sin preparar');
const pedidosListosDespachar = pedidos.filter(p => p.estadoNombre === 'Listo para despachar');

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
                <p className="text-gray-600 mt-1">Panel de Administración - {user?.nombreSucursal}</p>
            </div>

            {/* Stats Cards (RF9) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pedidos Activos</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activos}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-blue-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>En proceso</span>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Demorados</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.demorados}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <AlertTriangle className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-yellow-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Requieren atención</span>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Entregados Hoy</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.entregados}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>Completados</span>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Cancelados</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.cancelados}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        <span>No completados</span>
                    </div>
                </Card>
            </div>

            {/* Alertas Destacadas (RF14) */}
            {pedidosDemorados.length > 0 && (
                <Alert type="warning" title="Atención: Pedidos Demorados">
                    Hay {pedidosDemorados.length} pedido(s) que superaron el tiempo de entrega estimado.
                </Alert>
            )}

            {/* Secciones de Acción Rápida */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Pedidos Sin Preparar (RF18 - Asignar Operario) */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Pendientes de Asignación
                        </h2>
                        <Badge variant="info">{pedidosSinPreparar.length}</Badge>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {pedidosSinPreparar.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No hay pedidos pendientes</p>
                        ) : (
                            pedidosSinPreparar.slice(0, 5).map((pedido) => (
                                <div key={pedido.idPedido} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">Pedido #{pedido.idPedido}</p>
                                        <p className="text-sm text-gray-600">{pedido.clienteNombre}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                                        Asignar Operario
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Pedidos Listos para Despachar (RF19 - Asignar Cadete) */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            Listos para Despacho
                        </h2>
                        <Badge variant="success">{pedidosListosDespachar.length}</Badge>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {pedidosListosDespachar.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No hay pedidos listos</p>
                        ) : (
                            pedidosListosDespachar.slice(0, 5).map((pedido) => (
                                <div key={pedido.idPedido} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">Pedido #{pedido.idPedido}</p>
                                        <p className="text-sm text-gray-600">{pedido.clienteNombre}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                                        Asignar Cadete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Tabla de Pedidos Recientes */}
            <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pedidos Recientes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cliente</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Responsable</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pedidos.slice(0, 10).map((pedido) => (
                                <tr key={pedido.idPedido} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        #{pedido.idPedido}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{pedido.clienteNombre}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={
                                            pedido.estadoNombre === 'Entregado' ? 'success' :
                                            pedido.estadoNombre === 'Cancelado' ? 'danger' :
                                            pedido.estaDemorado ? 'warning' : 'info'
                                        }>
                                            {pedido.estadoNombre}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{pedido.responsableNombre}</td>
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