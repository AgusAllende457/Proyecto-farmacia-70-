using Back.Data;
using Back.Interfaces;
using Back.Models;
using Back.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Back.Repositories
{
    public class OrderRepository : GenericRepository<Pedido>, IOrderRepository
    {
        public OrderRepository(AppDbContext context) : base(context) { }

        public async Task<int> CreateOrderAsync(Pedido pedido)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // RF2: Fecha en el servidor
                pedido.Fecha = DateTime.Now;

                // RF1: Estado inicial "Sin preparar"
                pedido.IDEstadoDePedido = 1;
                pedido.EstadoActual = "Sin preparar";

                // CORRECCIÓN: Usamos ".Detalles" (que es como está en tu modelo Pedido)
                if (pedido.Detalles != null && pedido.Detalles.Any())
                {
                    pedido.Total = pedido.Detalles.Sum(d => d.Cantidad * d.PrecioUnitario);
                }

                _context.Pedidos.Add(pedido);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return pedido.IDPedido;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<Pedido> GetOrderWithDetailsAsync(int id)
        {
            // CORRECCIÓN: Usamos ".Detalles" aquí también (RF17)
            return await _context.Pedidos
                .Include(p => p.Detalles)
                .ThenInclude(d => d.Producto)
                .FirstOrDefaultAsync(p => p.IDPedido == id);
        }
    }
}