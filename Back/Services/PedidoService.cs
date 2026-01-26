using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Back.DTOs;
using Back.Repositories.Interfaces;
using Back.Services.Interfaces;

namespace Back.Services
{
    public class PedidoService : IPedidoService
    {
        private readonly IPedidoRepository _pedidoRepository;

        public PedidoService(IPedidoRepository pedidoRepository)
        {
            _pedidoRepository = pedidoRepository;
        }

        public async Task<IEnumerable<OrderSummaryDTO>> GetFilteredOrdersAsync(OrderFilterDTO filters)
        {
            // Validación de fechas
            if (filters.FechaDesde.HasValue && filters.FechaHasta.HasValue)
            {
                if (filters.FechaDesde > filters.FechaHasta)
                {
                    throw new ArgumentException("La fecha de inicio no puede ser posterior a la fecha de fin.");
                }
            }

            // Pasamos los filtros (incluyendo el nuevo Search) al repositorio
            return await _pedidoRepository.GetFilteredOrdersAsync(filters);
        }

        public async Task<bool> ActualizarEstadoPedidoAsync(int id, ChangeOrderStatusDTO datos)
        {
            if (id != datos.IDPedido) return false;
            return await _pedidoRepository.ActualizarEstadoPedidoAsync(datos);
        }
    }
}