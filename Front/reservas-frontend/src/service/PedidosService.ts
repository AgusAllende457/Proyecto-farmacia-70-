import { api } from './api';
import {
    OrderSummaryDTO,
    AssignOperatorDTO,
    AssignDeliveryDTO,
    ChangeOrderStatusDTO,
} from '@/types/pedido.types';

export const pedidosService = {
    async getFilteredOrders(filters: any): Promise<OrderSummaryDTO[]> {
        // Construimos el objeto params con las llaves exactas que espera C# en el OrderFilterDTO
        const params: any = {};
        
        const estadoMap: { [key: string]: number } = {
            'Sin preparar': 1,
            'Preparar pedido': 2,
            'Demorado': 3,
            'Listo para despachar': 4,
            'Despachando': 5,
            'En camino': 6,
            'Entregado': 7,
            'Entrega fallida': 8,
            'Cancelado': 10 
        };

        // 1. Mapeo de búsqueda (Search)
        if (filters.search) {
            params.Search = filters.search;
        }
        
        // 2. Mapeo de Estado (IDEstadoDePedido)
        if (filters.idEstadoDePedido && filters.idEstadoDePedido > 0) {
            params.IDEstadoDePedido = filters.idEstadoDePedido;
        } 
        else if (filters.estadoNombre && filters.estadoNombre !== 'Todos') {
            params.IDEstadoDePedido = estadoMap[filters.estadoNombre];
        } else if (filters.estado && filters.estado !== 'Todos') {
            params.IDEstadoDePedido = estadoMap[filters.estado];
        }
        
        // 3. Mapeo de Usuario (IDUsuario)
        // Unificamos idOperario/idCadete al nombre de propiedad que espera el Repository: IDUsuario
        if (filters.idOperario) params.IDUsuario = filters.idOperario;
        else if (filters.idCadete) params.IDUsuario = filters.idCadete;
        else if (filters.idUsuario) params.IDUsuario = filters.idUsuario;

        // 4. Mapeo de Fechas (FechaDesde / FechaHasta)
        if (filters.fechaDesde) params.FechaDesde = filters.fechaDesde;
        if (filters.fechaHasta) params.FechaHasta = filters.fechaHasta;

        // DEBUG: Verifica en la consola que IDEstadoDePedido cambie al tocar los botones
        console.log("Filtros enviados al Backend:", params);

        // Cambiamos la ruta para que coincida con OrdersController.cs [HttpGet("reporte")]
        const response = await api.get<OrderSummaryDTO[]>('/Orders/reporte', {
            params: params,
        });

        return response.data;
    },

    async getPedidosByRol(rol: string, userId: number, otrosFiltros: any = {}): Promise<OrderSummaryDTO[]> {
        let filters = { ...otrosFiltros };
        
        // Asignamos el ID del usuario logueado según su rol para que el filtrado sea automático
        if (rol === 'Operario') {
            filters.idOperario = userId;
        } else if (rol === 'Cadete') {
            filters.idCadete = userId;
        }
        
        return this.getFilteredOrders(filters);
    },

    async getPendientesOperario(): Promise<OrderSummaryDTO[]> {
        const response = await api.get<OrderSummaryDTO[]>('/Orders/pendientes-operario');
        return response.data;
    },

    async getPendientesCadete(): Promise<OrderSummaryDTO[]> {
        const response = await api.get<OrderSummaryDTO[]>('/Orders/pendientes-cadete');
        return response.data;
    },

    async asignarOperario(data: AssignOperatorDTO): Promise<void> {
        await api.patch('/Orders/asignar-operario', data);
    },

    async asignarCadete(data: AssignDeliveryDTO): Promise<void> {
        await api.patch('/Orders/asignar-cadete', data);
    },

    async cambiarEstado(data: ChangeOrderStatusDTO): Promise<void> {
        const payload = {
            IDPedido: data.idPedido,
            IDNuevoEstado: data.idNuevoEstado,
            IDUsuario: data.idUsuario
        };
        await api.put(`/Orders/${data.idPedido}/estado`, payload);
    },

    async createOrder(orderData: any): Promise<any> {
        const response = await api.post('/Orders', orderData);
        return response.data;
    }
};