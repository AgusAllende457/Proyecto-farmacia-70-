import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, UserCheck, UserCog, X } from 'lucide-react';
import { usuariosService } from '../../service/usuariosService';
import { UserDTO } from '../../types/auth.types';

interface OrderFiltersProps {
    userRole: 'Administrador' | 'Operario' | 'Cadete';
    onFilterChange: (filters: any) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({ userRole, onFilterChange }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [operarios, setOperarios] = useState<UserDTO[]>([]);
    const [cadetes, setCadetes] = useState<UserDTO[]>([]);

    // Alineamos los nombres con el OrderFilterDTO de C#
    const [filters, setFilters] = useState({
        search: '',           // Mapea a 'Search' en C#
        estado: 'Todos',      // Se traduce a 'IDEstadoDePedido' en el Service
        idOperario: '',       // Mapea a 'IDUsuario'
        idCadete: '',         // Mapea a 'IDUsuario' (dependiendo del rol)
        fechaDesde: '',       // Mapea a 'FechaDesde'
        fechaHasta: ''        // Mapea a 'FechaHasta'
    });

    useEffect(() => {
        if (userRole === 'Administrador') {
            Promise.all([
                usuariosService.getUsuariosByRol('Operario'),
                usuariosService.getUsuariosByRol('Cadete')
            ]).then(([ops, cads]) => {
                setOperarios(ops);
                setCadetes(cads);
            });
        }
    }, [userRole]);

    const handleApplyFilters = (updatedFilters = filters) => {
        onFilterChange(updatedFilters);
    };

    const handleStatusClick = (status: string) => {
        const newFilters = { ...filters, estado: status };
        setFilters(newFilters);
        handleApplyFilters(newFilters);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleApplyFilters();
    };

    const statuses = ['Todos', 'Sin preparar', 'Preparar pedido', 'Demorado', 'Listo para despachar', 'En camino', 'Entregado', 'Cancelado'];

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Botones de Estado */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                    {statuses.map(status => (
                        <button
                            type="button"
                            key={status}
                            onClick={() => handleStatusClick(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                                ${filters.estado === status ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {/* Buscador Principal */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text"
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                            placeholder="ID o Nombre de cliente..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    {/* Botón Filtros Avanzados */}
                    {userRole === 'Administrador' && (
                        <button 
                            type="button" 
                            onClick={() => setShowAdvanced(!showAdvanced)} 
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition
                                ${showAdvanced ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            {showAdvanced ? <X size={18}/> : <Filter size={18}/>}
                            <span>Filtros</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Panel Avanzado */}
            {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                    {/* Selector Operarios */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            <UserCog size={14}/> OPERARIO
                        </label>
                        <select 
                            value={filters.idOperario} 
                            onChange={(e) => {
                                const nf = {...filters, idOperario: e.target.value};
                                setFilters(nf);
                                handleApplyFilters(nf);
                            }}
                            className="p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los operarios</option>
                            {operarios.map(op => <option key={op.id} value={op.id}>{op.nombreCompleto}</option>)}
                        </select>
                    </div>

                    {/* Selector Cadetes */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            <UserCheck size={14}/> CADETE
                        </label>
                        <select 
                            value={filters.idCadete} 
                            onChange={(e) => {
                                const nf = {...filters, idCadete: e.target.value};
                                setFilters(nf);
                                handleApplyFilters(nf);
                            }}
                            className="p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los cadetes</option>
                            {cadetes.map(cad => <option key={cad.id} value={cad.id}>{cad.nombreCompleto}</option>)}
                        </select>
                    </div>

                    {/* Fecha Desde */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            <Calendar size={14}/> DESDE
                        </label>
                        <input 
                            type="date"
                            value={filters.fechaDesde}
                            onChange={(e) => {
                                const nf = {...filters, fechaDesde: e.target.value};
                                setFilters(nf);
                                handleApplyFilters(nf);
                            }}
                            className="p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Fecha Hasta */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            <Calendar size={14}/> HASTA
                        </label>
                        <input 
                            type="date"
                            value={filters.fechaHasta}
                            onChange={(e) => {
                                const nf = {...filters, fechaHasta: e.target.value};
                                setFilters(nf);
                                handleApplyFilters(nf);
                            }}
                            className="p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}
        </form>
    );
};