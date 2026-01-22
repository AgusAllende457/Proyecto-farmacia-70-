using Back.DTOs;

namespace Back.Repositories.Interfaces
{
    /// <summary>
    /// Interfaz que define las operaciones de datos para los Pedidos (RF13, RF14).
    /// </summary>
    public interface IPedidoRepository
    {
        Task<IEnumerable<OrderSummaryDTO>> GetFilteredOrdersAsync(OrderFilterDTO filters);

        Task<bool> ActualizarEstadoPedidoAsync(ChangeOrderStatusDTO datos);
    }
}