export interface TrackingHistoryItemDTO {
    nombreEstado: string;
    fechaHora: string;
    responsable: string;
    motivoCancelacion?: string;
    observaciones?: string;
}

export interface OrderTrackingDTO {
    idPedido: number;
    estadoActual: string;
    ultimaActualizacion: string;
    historial: TrackingHistoryItemDTO[];
}