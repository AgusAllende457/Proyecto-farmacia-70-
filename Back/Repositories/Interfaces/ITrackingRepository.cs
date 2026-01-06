using Back.Models;

namespace Back.Repositories.Interfaces
{
    public interface ITrackingRepository
    {
        Task<Pedido?> ObtenerSeguimientoCompletoAsync(int idPedido);
    }
}