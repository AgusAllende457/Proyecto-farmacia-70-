import React, { useState } from 'react';
import { X, AlertTriangle, Printer, Bell, History, Ban, Calendar } from 'lucide-react';
import { OrderSummaryDTO } from '../../types/pedido.types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal'; // Asegúrate de que la ruta sea correcta
import { TrackingTimeline } from '../seguimiento/TrackingTimeline';
import { trackingService } from '../../service/trackingService';
import { OrderTrackingDTO } from '../../types/tracking.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    pedido: OrderSummaryDTO | null;
}

export const DetallePedidoModal: React.FC<Props> = ({ isOpen, onClose, pedido }) => {
    // Estados para el sub-modal de historial
    const [selectedTracking, setSelectedTracking] = useState<OrderTrackingDTO | null>(null);
    const [modalTrackingOpen, setModalTrackingOpen] = useState(false);
    const [loadingTracking, setLoadingTracking] = useState(false);

    if (!isOpen || !pedido) return null;

    const handleVerHistorial = async () => {
        setLoadingTracking(true);
        try {
            const tracking = await trackingService.getSeguimiento(pedido.idPedido);
            setSelectedTracking(tracking);
            setModalTrackingOpen(true);
        } catch (error) {
            console.error('Error al obtener seguimiento:', error);
        } finally {
            setLoadingTracking(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="p-4 border-b flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Detalle del Pedido</h2>
                            <p className="text-sm text-gray-500">Información completa del pedido {pedido.idPedido}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-4 overflow-y-auto space-y-4">
                        {/* Alerta de Demora */}
                        {pedido.estaDemorado && (
                            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-orange-800">Pedido demorado</p>
                                    <p className="text-xs text-orange-700">Este pedido se acerca a las 48 horas hábiles sin completarse.</p>
                                </div>
                            </div>
                        )}

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">N° de Pedido</p>
                                <p className="font-semibold">{pedido.idPedido}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Estado</p>
                                <Badge variant={pedido.estaDemorado ? 'warning' : 'info'}>{pedido.estadoNombre}</Badge>
                            </div>
                            <div>
                                <p className="text-gray-500">Cliente</p>
                                <p className="font-semibold">{pedido.clienteNombre}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Sucursal</p>
                                <p className="font-semibold">Casa Central</p>
                            </div>
                        </div>

                        {/* Productos */}
                        <div>
                            <p className="text-sm font-bold text-gray-900 mb-2">Productos</p>
                            <div className="space-y-2">
                                <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium">Items del pedido</p>
                                        <p className="text-xs text-gray-500">Verificar en sistema de facturación</p>
                                    </div>
                                    <p className="text-sm font-bold">${pedido.total.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-2 border-t flex justify-between items-center">
                                <p className="font-bold">Total del Pedido</p>
                                <p className="text-lg font-bold text-blue-600">${pedido.total.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="space-y-2 pt-4">
                            <div className="grid grid-cols-2 gap-2">
                                <button className="flex items-center justify-center gap-2 border p-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                                    <Printer className="w-4 h-4" /> Imprimir Hoja
                                </button>
                                <button className="flex items-center justify-center gap-2 border p-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                                    <Bell className="w-4 h-4" /> Notificar Cliente
                                </button>
                            </div>
                            
                            <button 
                                onClick={handleVerHistorial}
                                disabled={loadingTracking}
                                className="w-full flex items-center justify-center gap-2 border p-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                            >
                                <History className={`w-4 h-4 ${loadingTracking ? 'animate-spin' : ''}`} /> 
                                {loadingTracking ? 'Cargando...' : 'Ver Historial de Estados'}
                            </button>

                            <button className="w-full flex items-center justify-center gap-2 bg-red-600 text-white p-2 rounded-lg text-sm font-bold hover:bg-red-700 mt-2">
                                <Ban className="w-4 h-4" /> Cancelar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Seguimiento (Timeline) */}
            {selectedTracking && (
                <Modal
                    isOpen={modalTrackingOpen}
                    onClose={() => setModalTrackingOpen(false)}
                    title={`Historial del Pedido #${pedido.idPedido}`}
                    size="lg"
                >
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-800">Estado Actual</p>
                                <p className="text-xl font-bold text-blue-900">{selectedTracking.estadoActual}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto pr-2">
                            <TrackingTimeline tracking={selectedTracking} />
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};