import { api } from './api';
import { UserDTO } from '../types/auth.types.ts';

export const usuariosService = {
  async getAllUsuarios(): Promise<UserDTO[]> {
    const response = await api.get<UserDTO[]>('/usuarios');
    return response.data;
  },

  async getUsuarioById(id: number): Promise<UserDTO> {
    const response = await api.get<UserDTO>(`/usuarios/${id}`);
    return response.data;
  },

  // Filtrar usuarios por rol para asignaciones
  async getUsuariosByRol(rol: 'Operario' | 'Cadete'): Promise<UserDTO[]> {
    const usuarios = await this.getAllUsuarios();
    return usuarios.filter(u => u.rol === rol);
  },
};
