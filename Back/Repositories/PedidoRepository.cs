using Back.Data;                     // Necesario para acceder a AppDbContext
using Back.DTOs;                     // Necesario para los DTOs
using Back.Models;                   // Necesario para las entidades
using Microsoft.EntityFrameworkCore; // Necesario para .Include() y .ToListAsync()
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Back.Repositories.Interfaces;

namespace Back.Repositories
{
    public class PedidoRepository : IPedidoRepository
    {
        // CAMBIO CLAVE: Usar AppDbContext en lugar de DbContext
        private readonly AppDbContext _context;

        public PedidoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderSummaryDTO>> GetFilteredOrdersAsync(OrderFilterDTO filters)
        {
            // Ahora _context.Pedidos será reconocido correctamente
            var query = _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.EstadoDePedido)
                .Include(p => p.Usuario)
                .AsNoTracking() // Recomendado para consultas de solo lectura
                .AsQueryable();

            // Lógica de filtrado dinámico
            if (filters.IDEstadoDePedido.HasValue)
                query = query.Where(p => p.IDEstadoDePedido == filters.IDEstadoDePedido.Value);

            if (filters.IDUsuario.HasValue)
                query = query.Where(p => p.IDUsuario == filters.IDUsuario.Value);

            if (filters.IDCliente.HasValue)
                query = query.Where(p => p.IDCliente == filters.IDCliente.Value);

            // Filtrado por fechas (usando Date para ignorar la hora si es necesario)
            if (filters.FechaDesde.HasValue)
                query = query.Where(p => p.Fecha.Date >= filters.FechaDesde.Value.Date);

            if (filters.FechaHasta.HasValue)
                query = query.Where(p => p.Fecha.Date <= filters.FechaHasta.Value.Date);

            // Proyección optimizada al DTO
            return await query
                .Select(p => new OrderSummaryDTO
                {
                    IDPedido = p.IDPedido,
                    Fecha = p.Fecha,
                    Total = p.Total,
                    // Usamos operadores condicionales por si alguna relación es nula
                    EstadoNombre = p.EstadoDePedido != null ? p.EstadoDePedido.NombreEstado : "Sin Estado",
                    ClienteNombre = p.Cliente != null ? p.Cliente.Nombre : "Sin Cliente",
                    ResponsableNombre = p.Usuario != null ? p.Usuario.Nombre : "Sin Asignar",
                    FechaEntregaEstimada = p.FechaEntregaEstimada,
                    FechaEntregaReal = p.FechaEntregaReal
                })
                .ToListAsync();
        }
    }
}