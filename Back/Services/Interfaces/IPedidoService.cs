using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Back.DTOs;
using Back.Repositories.Interfaces;

namespace Back.Services.Interfaces
{
    /// <summary>
    /// Interfaz para el servicio de lógica de negocio de pedidos.
    /// </summary>
    public interface IPedidoService
    {
        Task<IEnumerable<OrderSummaryDTO>> GetFilteredOrdersAsync(OrderFilterDTO filters);
        
        Task<bool> ActualizarEstadoPedidoAsync(int id, ChangeOrderStatusDTO datos);

    }
}