using Back.Data;
using Back.DTOs;
using Back.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Back.Repositories.Interfaces;

namespace Back.Repositories
{
    public class PedidoRepository : IPedidoRepository
    {
        private readonly AppDbContext _context;

        public PedidoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderSummaryDTO>> GetFilteredOrdersAsync(OrderFilterDTO filters)
        {
            var query = _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.EstadoDePedido)
                .Include(p => p.Usuario)
                .AsNoTracking()
                .AsQueryable();

            // 1. Filtrado por Búsqueda (ID o Nombre de Cliente)
            if (!string.IsNullOrEmpty(filters.Search))
            {
                string term = filters.Search.ToLower();
                query = query.Where(p =>
                    p.IDPedido.ToString().Contains(term) ||
                    (p.Cliente != null && p.Cliente.Nombre.ToLower().Contains(term)) ||
                    (p.Cliente != null && p.Cliente.Apellido.ToLower().Contains(term))
                );
            }

            // 2. Filtrado por Estado (IDEstadoDePedido coincide con tu OrderFilterDTO)
            if (filters.IDEstadoDePedido.HasValue && filters.IDEstadoDePedido.Value > 0)
                query = query.Where(p => p.IDEstadoDePedido == filters.IDEstadoDePedido.Value);

            // 3. Otros filtros (Usuario, Cliente y Fechas)
            if (filters.IDUsuario.HasValue)
                query = query.Where(p => p.IDUsuario == filters.IDUsuario.Value);

            if (filters.IDCliente.HasValue)
                query = query.Where(p => p.IDCliente == filters.IDCliente.Value);

            if (filters.FechaDesde.HasValue)
                query = query.Where(p => p.Fecha.Date >= filters.FechaDesde.Value.Date);

            if (filters.FechaHasta.HasValue)
                query = query.Where(p => p.Fecha.Date <= filters.FechaHasta.Value.Date);

            // 4. Proyección al DTO de salida
            return await query
                .OrderByDescending(p => p.Fecha) // Los más recientes primero
                .Select(p => new OrderSummaryDTO
                {
                    IDPedido = p.IDPedido,
                    Fecha = p.Fecha,
                    Total = p.Total,
                    // ASIGNACIÓN FUNDAMENTAL PARA EL FRONT-END:
                    IDEstadoDePedido = p.IDEstadoDePedido, 
                    EstadoNombre = p.EstadoDePedido != null ? p.EstadoDePedido.NombreEstado : "Sin Estado",
                    ClienteNombre = p.Cliente != null ? $"{p.Cliente.Nombre} {p.Cliente.Apellido}" : "Sin Cliente",
                    ResponsableNombre = p.Usuario != null ? p.Usuario.Nombre : "Sin Asignar",
                    FechaEntregaEstimada = p.FechaEntregaEstimada,
                    FechaEntregaReal = p.FechaEntregaReal
                })
                .ToListAsync();
        }

        public async Task<bool> ActualizarEstadoPedidoAsync(ChangeOrderStatusDTO datos)
        {
            var pedido = await _context.Pedidos.FindAsync(datos.IDPedido);
            if (pedido == null) return false;

            // Actualizamos el estado y el usuario responsable
            pedido.IDEstadoDePedido = datos.IDNuevoEstado;
            pedido.IDUsuario = datos.IDUsuario;

            // Registro de fecha real si el estado es Entregado (ID 7)
            if (datos.IDNuevoEstado == 7)
            {
                pedido.FechaEntregaReal = DateTime.Now;
            }

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}