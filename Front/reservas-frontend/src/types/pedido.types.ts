export interface OrderSummaryDTO {
    idPedido: number;
    fecha: string;
    total: number;
    estadoNombre: string;
    clienteNombre: string;
    responsableNombre: string;
    fechaEntregaEstimada: string;
    estaDemorado: boolean;
    fechaEntregaReal?: string;
}

export interface OrderDetailDTO {
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
}

export interface CreateOrderDTO {
    idCliente: number;
    idSucursal: number;
    idUsuario: number;
    formaDePago: string;
    detalles: OrderDetailDTO[];
}

export interface AssignOperatorDTO {
    pedidoId: number;
    operarioId: number;
}

export interface AssignDeliveryDTO {
    pedidoId: number;
    cadeteId: number;
}

export interface ChangeOrderStatusDTO {
    idPedido: number;
    idNuevoEstado: number;
    idUsuario: number;
    observaciones?: string;
    motivoCancelacion?: string;
}

export interface OrderFilterDTO {
    idEstadoDePedido?: number;
    idUsuario?: number;
    idCliente?: number;
    fechaDesde?: string;
    fechaHasta?: string;
}