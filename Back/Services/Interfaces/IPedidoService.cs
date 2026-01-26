using System.Collections.Generic;
using System.Threading.Tasks;
using Back.DTOs;

namespace Back.Services.Interfaces
{
    public interface IPedidoService
    {
        Task<IEnumerable<OrderSummaryDTO>> GetFilteredOrdersAsync(OrderFilterDTO filters);
        Task<bool> ActualizarEstadoPedidoAsync(int id, ChangeOrderStatusDTO datos);
    }
}