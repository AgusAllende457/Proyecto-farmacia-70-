export interface ClientDTO {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
    idLocalidad: number;
    nombreLocalidad: string;
}

export interface ProductDTO {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
}

export interface LocalidadDTO {
    id: number;
    nombre: string;
    codigoPostal: string;
}

export interface EstadoPedido {
    id: number;
    nombre: string;
    color: string; // Para UI
    icono: string; // Para UI
}

export interface ApiError {
    message: string;
    detail?: string;
    statusCode?: number;
}

export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
    success: boolean;
}