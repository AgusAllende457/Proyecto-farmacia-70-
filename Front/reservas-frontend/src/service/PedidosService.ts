import { api } from './api';
import {
    OrderSummaryDTO,
    OrderFilterDTO,
    AssignOperatorDTO,
    AssignDeliveryDTO,
    ChangeOrderStatusDTO,
} from '@/types/pedido.types';

export const pedidosService = {
    // --- NUEVOS MÉTODOS FILTRADOS ---

    /**
     * Trae SOLO pedidos en estado "Sin preparar" (ID 1)
     * Úsalo en la pantalla de Asignar Operario
     */
    async getPendientesOperario(): Promise<OrderSummaryDTO[]> {
        const response = await api.get<OrderSummaryDTO[]>('/orders/pendientes-operario');
        return response.data;
    },

    /**
     * Trae SOLO pedidos en estado "Preparado" (ID 2)
     * Úsalo en la pantalla de Asignar Cadete
     */
    async getPendientesCadete(): Promise<OrderSummaryDTO[]> {
        const response = await api.get<OrderSummaryDTO[]>('/orders/pendientes-cadete');
        return response.data;
    },

    // --- MÉTODOS EXISTENTES ---

    async getFilteredOrders(filters: any): Promise<OrderSummaryDTO[]> {
        const cleanFilters: any = {};
        
        const estadoMap: { [key: string]: number } = {
            'Sin preparar': 1,
            'Preparar pedido': 2,
            'Demorado': 3,
            'Listo para despachar': 4,
            'Despachando': 5,
            'En camino': 6,
            'Entregado': 7,
            'Entrega fallida': 8,
            'Cancelado': 9
        };

        if (filters.search) cleanFilters.search = filters.search;
        
        if (filters.estado && filters.estado !== 'Todos') {
            cleanFilters.idEstado = estadoMap[filters.estado];
        }
        
        if (filters.idOperario) cleanFilters.idOperario = filters.idOperario;
        if (filters.idCadete) cleanFilters.idCadete = filters.idCadete;
        if (filters.fecha) cleanFilters.fecha = filters.fecha;
        if (filters.idUsuario) cleanFilters.idUsuario = filters.idUsuario;

        const response = await api.get<OrderSummaryDTO[]>('/filtrarpedidos/reporte', {
            params: cleanFilters,
        });

        return response.data;
    },

    async asignarOperario(data: AssignOperatorDTO): Promise<void> {
        await api.patch('/orders/asignar-operario', data);
    },

    async asignarCadete(data: AssignDeliveryDTO): Promise<void> {
        await api.patch('/orders/asignar-cadete', data);
    },

    async cambiarEstado(data: ChangeOrderStatusDTO): Promise<void> {
        const payload = {
            IDPedido: data.idPedido,
            IDNuevoEstado: data.idNuevoEstado,
            IDUsuario: data.idUsuario,
            Observaciones: data.observaciones || "",
            MotivoCancelacion: data.idNuevoEstado === 8 ? data.observaciones : null
        };
        await api.put(`/orders/${data.idPedido}/estado`, payload);
    },

    async getPedidosByRol(rol: string, userId: number, otrosFiltros: any = {}): Promise<OrderSummaryDTO[]> {
        let filters = { ...otrosFiltros };
        if (rol === 'Operario' || rol === 'Cadete') {
            filters.idUsuario = userId;
        }
        return this.getFilteredOrders(filters);
    },
};