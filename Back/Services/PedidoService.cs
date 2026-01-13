using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Back.DTOs;
using Back.Repositories.Interfaces;

namespace Back.Services
{
    using Back.Services.Interfaces;

    /// <summary>
    /// Implementación del servicio de pedidos.
    /// </summary>
    public class PedidoService : IPedidoService
    {
        private readonly IPedidoRepository _pedidoRepository;

        public PedidoService(IPedidoRepository pedidoRepository)
        {
            _pedidoRepository = pedidoRepository;
        }

        public async Task<IEnumerable<OrderSummaryDTO>> GetFilteredOrdersAsync(OrderFilterDTO filters)
        {
            // Aquí podrías agregar validaciones de negocio adicionales
            // Por ejemplo: verificar si la FechaDesde no es mayor a la FechaHasta
            if (filters.FechaDesde.HasValue && filters.FechaHasta.HasValue)
            {
                if (filters.FechaDesde > filters.FechaHasta)
                {
                    throw new ArgumentException("La fecha de inicio no puede ser posterior a la fecha de fin.");
                }
            }

            return await _pedidoRepository.GetFilteredOrdersAsync(filters);
        }
    }
}
