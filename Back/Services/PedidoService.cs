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
            // 1. Normalización: Si el ID es 0 o nulo, tratamos como "Todos"
            if (filters.IDEstadoDePedido == 0)
            {
                filters.IDEstadoDePedido = null;
            }

            // 2. Validación de fechas
            if (filters.FechaDesde.HasValue && filters.FechaHasta.HasValue)
            {
                if (filters.FechaDesde > filters.FechaHasta)
                {
                    throw new ArgumentException("La fecha de inicio no puede ser posterior a la fecha de fin.");
                }
            }

            // 3. Pasamos los filtros al repositorio (Asegúrate de que el Repo use filters.IDEstadoDePedido)
            return await _pedidoRepository.GetFilteredOrdersAsync(filters);
        }

        public async Task<bool> ActualizarEstadoPedidoAsync(int id, ChangeOrderStatusDTO datos)
        {
            if (id != datos.IDPedido) return false;
            return await _pedidoRepository.ActualizarEstadoPedidoAsync(datos);
        }
    }
}