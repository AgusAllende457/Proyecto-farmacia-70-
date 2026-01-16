import { api } from './api';
import { ClientDTO, ProductDTO, LocalidadDTO } from '../types/common.types';

export const catalogoService = {
    async getClientes(): Promise<ClientDTO[]> {
        const response = await api.get<ClientDTO[]>('/clientes');
        return response.data;
    },

    async getProductos(): Promise<ProductDTO[]> {
        const response = await api.get<ProductDTO[]>('/productos');
        return response.data;
    },

    async getLocalidades(): Promise<LocalidadDTO[]> {
        const response = await api.get<LocalidadDTO[]>('/localidades');
        return response.data;
    },
};