export interface DashboardStats {
    pedidosActivos: number;
    pedidosDemorados: number;
    pedidosEntregados: number;
    pedidosCancelados: number;
}

export interface AlertasPedido {
    id: number;
    mensaje: string;
    tipo: 'warning' | 'error' | 'info';
    pedidoId: number;
    fecha: string;
}