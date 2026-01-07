using Back.DTOs;

namespace Back.Services.Interfaces
{
    public interface ITrackingService
    {
        Task<OrderTrackingDTO?> ObtenerSeguimientoAsync(int idPedido);
    }
}
