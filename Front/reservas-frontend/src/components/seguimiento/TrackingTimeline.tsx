import React from 'react';
import { OrderTrackingDTO } from '../../types/tracking.types';
import { 

CheckCircle, 
Clock, 
AlertCircle,
Package,
Truck,
User
} from 'lucide-react';

interface TrackingTimelineProps {
tracking: OrderTrackingDTO;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ tracking }) => {
const getEstadoIcon = (nombreEstado: string) => {
    const icons: Record<string, any> = {
        'Sin preparar': Package,
        'Preparar pedido': Package,
        'Listo para despachar': CheckCircle,
        'Despachando': Truck,
        'En camino': Truck,
        'Entregado': CheckCircle,
        'Entrega fallida': AlertCircle,
        'Cancelado': AlertCircle,
    };
    return icons[nombreEstado] || Clock;
};

const getEstadoColor = (nombreEstado: string) => {
    const colors: Record<string, string> = {
        'Sin preparar': 'bg-gray-400',
        'Preparar pedido': 'bg-blue-500',
        'Listo para despachar': 'bg-green-500',
        'Despachando': 'bg-yellow-500',
        'En camino': 'bg-yellow-500',
        'Entregado': 'bg-green-600',
        'Entrega fallida': 'bg-red-500',
        'Cancelado': 'bg-red-600',
    };
    return colors[nombreEstado] || 'bg-gray-400';
};

return (
    <div className="space-y-4">
        {tracking.historial.map((item, index) => {
            const Icon = getEstadoIcon(item.nombreEstado);
            const isLast = index === tracking.historial.length - 1;

            return (
                <div key={index} className="relative flex gap-4">
                    {/* Timeline Line */}
                    {!isLast && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
                    )}

                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getEstadoColor(item.nombreEstado)} flex items-center justify-center shadow-lg z-10`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{item.nombreEstado}</h4>
                            <span className="text-sm text-gray-500">
                                {new Date(item.fechaHora).toLocaleString('es-AR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <User className="w-4 h-4" />
                            <span>{item.responsable}</span>
                        </div>

                        {item.observaciones && (
                            <p className="text-sm text-gray-700 bg-gray-50 rounded p-2 mt-2">
                                {item.observaciones}
                            </p>
                        )}

                        {item.motivoCancelacion && item.motivoCancelacion !== 'N/A' && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                <p className="text-sm font-medium text-red-800">
                                    Motivo: {item.motivoCancelacion}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        })}
    </div>
);
};