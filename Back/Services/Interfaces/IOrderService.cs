using Back.DTOs;

namespace Back.Services.Interfaces
{
    public interface IOrderService
    {
        // Para crear el pedido inicial (RF17, RF1, RF2)
        Task<int> CreateOrderAsync(CreateOrderDTO orderDto);

        // Para ver el seguimiento/tracking (Mandato de la Farmacia)
        Task<OrderTrackingDTO> GetOrderTrackingAsync(int id);

        // Para cuando necesitemos cambiar el estado más adelante (Opcional)
        Task<bool> UpdateOrderStatusAsync(ChangeOrderStatusDTO changeDto);
    }
}