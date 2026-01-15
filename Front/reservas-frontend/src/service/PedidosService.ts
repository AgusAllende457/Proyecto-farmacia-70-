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
    await api.put(`/orders/${data.idPedido}/estado`, data);
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