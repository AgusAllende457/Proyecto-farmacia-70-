import { api } from './api';
import {
    OrderSummaryDTO,
    OrderFilterDTO,
    AssignOperatorDTO,
    AssignDeliveryDTO,
    ChangeOrderStatusDTO,
} from '@/types/pedido.types';

export const pedidosService = {
    // RF13 - Listar y filtrar pedidos
    async getFilteredOrders(filters: any): Promise<OrderSummaryDTO[]> {
        const cleanFilters: any = {};
        
        // Mapeo de nombres a IDs para evitar el error de tipos
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
        
        // Convertimos el texto del estado al ID numérico correspondiente
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