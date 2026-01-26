using Back.Models;
using Back.DTOs; // Asegúrate de agregar este using para ver el DTO
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Back.Repositories.Interfaces
{
    public interface IOrderRepository : IGenericRepository<Pedido>
    {
        // RF17: Crear el pedido con sus detalles
        Task<int> CreateOrderAsync(Pedido pedido);

        // Para ver el pedido con sus productos (Hoja de preparación)
        Task<Pedido> GetOrderWithDetailsAsync(int id);

        // MODIFICADO: Cambiamos Task<IEnumerable<Pedido>> por Task<IEnumerable<OrderSummaryDTO>>
        // Esto es vital para que el mapeo que hicimos en el Repository funcione
        Task<IEnumerable<OrderSummaryDTO>> GetOrdersByStatusAsync(int statusId);
    }
}