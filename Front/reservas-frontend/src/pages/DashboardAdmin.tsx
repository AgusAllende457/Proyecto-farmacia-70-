import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout.tsx';
import { Card } from '../components/common/Card.tsx';
import { Badge } from '@components/common/Badge.tsx';
import { Button } from '@components/common/Button';
import { AsignarOperarioModal } from '@components/pedidos/AsignarOperarioModal';
import { DetallePedidoModal } from '@components/pedidos/DetallePedidoModal';
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
    Eye
} from 'lucide-react';

export const DashboardAdmin: React.FC = () => {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState<OrderSummaryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedPedido, setSelectedPedido] = useState<OrderSummaryDTO | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPedidoDetalle, setSelectedPedidoDetalle] = useState<OrderSummaryDTO | null>(null);
    const [modalDetalleOpen, setModalDetalleOpen] = useState(false);

    const [stats, setStats] = useState({ activos: 0, demorados: 0, entregados: 0, cancelados: 0 });

    useEffect(() => { loadDashboardData(); }, []);

    const loadDashboardData = async () => {
        try {
            const data = await pedidosService.getFilteredOrders({});
            setPedidos(data);
            setStats({
                activos: data.filter(p => !['Entregado', 'Cancelado'].includes(p.estadoNombre)).length,
                demorados: data.filter(p => p.estaDemorado).length,
                entregados: data.filter(p => p.estadoNombre === 'Entregado').length,
                cancelados: data.filter(p => p.estadoNombre === 'Cancelado').length,
            });
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    if (loading) return <DashboardLayout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {user?.nombreCompleto}</h1>
                    <p className="text-gray-600 mt-1">Panel de Administración - {user?.nombreSucursal}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Activos</p><p className="text-2xl font-bold">{stats.activos}</p></div><Package className="text-blue-600"/></div></Card>
                    <Card><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Demorados</p><p className="text-2xl font-bold">{stats.demorados}</p></div><AlertTriangle className="text-yellow-600"/></div></Card>
                    <Card><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Entregados</p><p className="text-2xl font-bold">{stats.entregados}</p></div><CheckCircle className="text-green-600"/></div></Card>
                    <Card><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Cancelados</p><p className="text-2xl font-bold">{stats.cancelados}</p></div><XCircle className="text-red-600"/></div></Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Users className="w-5 h-5" /> Pendientes</h2>
                        <div className="space-y-3">
                            {pedidos.filter(p => p.estadoNombre === 'Sin preparar').map((pedido) => (
                                <div key={pedido.idPedido} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div><p className="font-medium">#{pedido.idPedido}</p><p className="text-sm text-gray-500">{pedido.clienteNombre}</p></div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setSelectedPedidoDetalle(pedido); setModalDetalleOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600"><Eye className="w-5 h-5"/></button>
                                        <Button size="sm" onClick={() => { setSelectedPedido(pedido); setModalOpen(true); }}>Asignar</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    
                    <Card>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Truck className="w-5 h-5" /> Listos Despacho</h2>
                        <div className="space-y-3">
                            {pedidos.filter(p => p.estadoNombre === 'Listo para despachar').map((pedido) => (
                                <div key={pedido.idPedido} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div><p className="font-medium">#{pedido.idPedido}</p></div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setSelectedPedidoDetalle(pedido); setModalDetalleOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600"><Eye className="w-5 h-5"/></button>
                                        <Button size="sm" variant="success">Asignar Cadete</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <Card>
                    <h2 className="text-xl font-semibold mb-4">Pedidos Recientes</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-sm">
                                <tr><th className="p-3">ID</th><th className="p-3">Cliente</th><th className="p-3">Estado</th><th className="p-3 text-right">Acciones</th></tr>
                            </thead>
                            <tbody>
                                {pedidos.slice(0, 10).map((pedido) => (
                                    <tr key={pedido.idPedido} className="border-t">
                                        <td className="p-3">#{pedido.idPedido}</td>
                                        <td className="p-3">{pedido.clienteNombre}</td>
                                        <td className="p-3"><Badge variant={pedido.estaDemorado ? 'warning' : 'info'}>{pedido.estadoNombre}</Badge></td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => { setSelectedPedidoDetalle(pedido); setModalDetalleOpen(true); }} className="text-blue-600 font-bold text-sm">Ver detalles</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {selectedPedido && (
                <AsignarOperarioModal isOpen={modalOpen} onClose={() => setModalOpen(false)} pedido={selectedPedido} onSuccess={loadDashboardData} />
            )}
            
            {selectedPedidoDetalle && (
                <DetallePedidoModal isOpen={modalDetalleOpen} onClose={() => setModalDetalleOpen(false)} pedido={selectedPedidoDetalle} />
            )}
        </DashboardLayout>
    );
};