using Back.Models;
namespace Back.Repositories.Interfaces
{
    public interface IOrderRepository : IGenericRepository<Pedido>
    {
        // RF17: Crear el pedido con sus detalles
        // RF1 y RF2: La implementación se encargará del estado y la fecha
        Task<int> CreateOrderAsync(Pedido pedido);

        // Para ver el pedido con sus productos (Hoja de preparación)
        Task<Pedido> GetOrderWithDetailsAsync(int id);
    }
}