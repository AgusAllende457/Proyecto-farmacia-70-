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
async getFilteredOrders(filters: OrderFilterDTO): Promise<OrderSummaryDTO[]> {
    const response = await api.get<OrderSummaryDTO[]>('/filtrarpedidos/reporte', {
        params: filters,
    });
    return response.data;
},

// RF18 - Asignar Operario (Admin)
async asignarOperario(data: AssignOperatorDTO): Promise<void> {
    await api.patch('/orders/asignar-operario', data);
},

// RF19 - Asignar Cadete (Admin)
async asignarCadete(data: AssignDeliveryDTO): Promise<void> {
    await api.patch('/orders/asignar-cadete', data);
},

// RF2 - Cambiar estado del pedido (principalmente Cadete)
async cambiarEstado(data: ChangeOrderStatusDTO): Promise<void> {
    // 1. Preparamos el objeto con los nombres EXACTOS de tu DTO C#
    const payload = {
        IDPedido: data.idPedido,
        IDNuevoEstado: data.idNuevoEstado,
        IDUsuario: data.idUsuario,
        Observaciones: data.observaciones || "",
        // Agregamos el motivo de cancelación para el reporte de Agustina
        MotivoCancelacion: data.idNuevoEstado === 8 ? data.observaciones : null
    };

    // 2. Enviamos la petición
    // La URL usa idPedido (minúscula, es solo para la ruta)
    // El Body usa payload (Mayúsculas, para que .NET lo entienda)
    await api.put(`/orders/${data.idPedido}/estado`, payload);
},

// Obtener pedidos por rol
async getPedidosByRol(rol: string, userId: number): Promise<OrderSummaryDTO[]> {
    let filters: OrderFilterDTO = {};
    
    if (rol === 'Operario' || rol === 'Cadete') {
        filters.idUsuario = userId;
    }
    
    return this.getFilteredOrders(filters);
},
};