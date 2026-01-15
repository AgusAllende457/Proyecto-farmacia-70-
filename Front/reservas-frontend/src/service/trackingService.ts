import { api } from './api';
import { OrderTrackingDTO } from '../types/tracking.types';

export const trackingService = {
    // RF6 - Consulta del historial de pedidos
    async getSeguimiento(idPedido: number): Promise<OrderTrackingDTO> {
        const response = await api.get<OrderTrackingDTO>(`/orders/${idPedido}/seguimiento`);
        return response.data;
    },

    // También se puede usar el endpoint de tracking
    async getTrackingAlternativo(idPedido: number): Promise<OrderTrackingDTO> {
        const response = await api.get<OrderTrackingDTO>(`/tracking/${idPedido}`);
        return response.data;
    },
};