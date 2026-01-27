import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout.tsx';
import { Card } from '../components/common/Card.tsx';
import { Badge } from '@components/common/Badge.tsx';
import { Button } from '@components/common/Button';
import { AsignarOperarioModal } from '@components/pedidos/AsignarOperarioModal';
import { AsignarCadeteModal } from '@components/pedidos/AsignarCadeteModal';
import { DetallePedidoModal } from '@components/pedidos/DetallePedidoModal';
import { OrderFilters } from '@components/orders/OrderFilters';
import { pedidosService } from '../service/PedidosService';
import { OrderSummaryDTO } from '../types/pedido.types';
import { useAuth } from '@context/AuthContext';
import { 
    Package, 
    AlertTriangle, 
    CheckCircle, 
    XCircle,
    Users,
    Truck,
    Eye,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardAdmin: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState<OrderSummaryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para Modales
    const [selectedPedido, setSelectedPedido] = useState<OrderSummaryDTO | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    
    const [selectedPedidoCadete, setSelectedPedidoCadete] = useState<OrderSummaryDTO | null>(null);
    const [modalCadeteOpen, setModalCadeteOpen] = useState(false);

    const [selectedPedidoDetalle, setSelectedPedidoDetalle] = useState<OrderSummaryDTO | null>(null);
    const [modalDetalleOpen, setModalDetalleOpen] = useState(false);

    const [stats, setStats] = useState({ activos: 0, demorados: 0, entregados: 0, cancelados: 0 });

    useEffect(() => { 
        loadDashboardData(); 
    }, []);

    const loadDashboardData = async (filtros = {}) => {
        try {
            setLoading(true);
            const data = await pedidosService.getFilteredOrders(filtros);
            setPedidos(data);
            
            setStats({
                activos: data.filter(p => !['Entregado', 'Cancelado'].includes(p.estadoNombre)).length,
                // Nota: Asegúrate que en tu pedido.types.ts coincida el casing (estaDemorado o EstaDemorado)
                demorados: data.filter(p => p.estaDemorado || (p as any).EstaDemorado).length,
                entregados: data.filter(p => p.estadoNombre === 'Entregado').length,
                cancelados: data.filter(p => p.estadoNombre === 'Cancelado').length,
            });
        } catch (error) { 
            console.error("Error cargando pedidos:", error); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {user?.nombreCompleto}</h1>
                        <p className="text-gray-600 mt-1">Panel de Administración - {user?.nombreSucursal}</p>
                    </div>
                    <Button onClick={() => navigate('/pedidos/nuevo')} className="flex items-center gap-2">
                        <Plus size={20} /> Nuevo Pedido
                    </Button>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div><p className="text-sm text-gray-600">Activos</p><p className="text-2xl font-bold">{stats.activos}</p></div>
                            <Package className="text-blue-600"/>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div><p className="text-sm text-gray-600">Demorados</p><p className="text-2xl font-bold text-yellow-600">{stats.demorados}</p></div>
                            <AlertTriangle className="text-yellow-600"/>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div><p className="text-sm text-gray-600">Entregados</p><p className="text-2xl font-bold">{stats.entregados}</p></div>
                            <CheckCircle className="text-green-600"/>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div><p className="text-sm text-gray-600">Cancelados</p><p className="text-2xl font-bold">{stats.cancelados}</p></div>
                            <XCircle className="text-red-600"/>
                        </div>
                    </Card>
                </div>

                <OrderFilters 
                    userRole="Administrador" 
                    onFilterChange={(filtros) => loadDashboardData(filtros)} 
                />

                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Columna: Pendientes de Operario */}
                            <Card>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Users className="w-5 h-5" /> Pendientes de Operario</h2>
                                <div className="space-y-3">
                                    {pedidos.filter(p => p.estadoNombre === 'Sin preparar').length > 0 ? (
                                        pedidos.filter(p => p.estadoNombre === 'Sin preparar').map((pedido) => (
                                            <div key={pedido.idPedido} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div><p className="font-medium">#{pedido.idPedido}</p><p className="text-sm text-gray-500">{pedido.clienteNombre}</p></div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setSelectedPedidoDetalle(pedido); setModalDetalleOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Eye className="w-5 h-5"/></button>
                                                    <Button size="sm" onClick={() => { setSelectedPedido(pedido); setModalOpen(true); }}>Asignar</Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">No hay pedidos para asignar operario.</p>
                                    )}
                                </div>
                            </Card>
                            
                            {/* Columna: Listos para Cadete (EL BOTÓN QUE SOLICITASTE) */}
                            <Card>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Truck className="w-5 h-5" /> Listos para Cadete</h2>
                                <div className="space-y-3">
                                    {pedidos.filter(p => p.estadoNombre === 'Listo para despachar').length > 0 ? (
                                        pedidos.filter(p => p.estadoNombre === 'Listo para despachar').map((pedido) => (
                                            <div key={pedido.idPedido} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div><p className="font-medium">#{pedido.idPedido}</p><p className="text-sm text-gray-500">{pedido.clienteNombre}</p></div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setSelectedPedidoDetalle(pedido); setModalDetalleOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Eye className="w-5 h-5"/></button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="success" 
                                                        onClick={() => { setSelectedPedidoCadete(pedido); setModalCadeteOpen(true); }}
                                                    >
                                                        Asignar Cadete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">No hay pedidos listos para despacho.</p>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Tabla General */}
                        <Card>
                            <h2 className="text-xl font-semibold mb-4">Todos los Pedidos</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-sm">
                                        <tr>
                                            <th className="p-3 font-semibold text-gray-600">ID</th>
                                            <th className="p-3 font-semibold text-gray-600">Cliente</th>
                                            <th className="p-3 font-semibold text-gray-600">Responsable</th>
                                            <th className="p-3 font-semibold text-gray-600">Estado</th>
                                            <th className="p-3 text-right font-semibold text-gray-600">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidos.map((pedido) => (
                                            <tr key={pedido.idPedido} className="border-t hover:bg-gray-50 transition-colors">
                                                <td className="p-3">#{pedido.idPedido}</td>
                                                <td className="p-3 font-medium text-gray-800">{pedido.clienteNombre}</td>
                                                <td className="p-3 text-sm text-gray-500">{pedido.responsableNombre || 'No asignado'}</td>
                                                <td className="p-3">
                                                    <Badge variant={(pedido.estaDemorado || (pedido as any).EstaDemorado) ? 'warning' : 'info'}>
                                                        {pedido.estadoNombre}
                                                    </Badge>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <button 
                                                        onClick={() => { setSelectedPedidoDetalle(pedido); setModalDetalleOpen(true); }} 
                                                        className="text-blue-600 font-bold text-sm hover:underline"
                                                    >
                                                        Ver detalles
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </>
                )}
            </div>

            {/* Modales */}
            {selectedPedido && (
                <AsignarOperarioModal 
                    isOpen={modalOpen} 
                    onClose={() => { setModalOpen(false); setSelectedPedido(null); }} 
                    pedido={selectedPedido} 
                    onSuccess={() => loadDashboardData()} 
                />
            )}

            {selectedPedidoCadete && (
                <AsignarCadeteModal 
                    isOpen={modalCadeteOpen} 
                    onClose={() => { setModalCadeteOpen(false); setSelectedPedidoCadete(null); }} 
                    pedido={selectedPedidoCadete} 
                    onSuccess={() => loadDashboardData()} 
                />
            )}
            
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