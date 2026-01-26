using Back.Data;
using Back.Models;
using Back.DTOs; // Asegúrate de importar tus DTOs
using Back.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Back.Repositories
{
    public class OrderRepository : GenericRepository<Pedido>, IOrderRepository
    {
        public OrderRepository(AppDbContext context) : base(context) { }

        // MÉTODO CORREGIDO: Ahora devuelve OrderSummaryDTO y hace el mapeo
        public async Task<IEnumerable<OrderSummaryDTO>> GetOrdersByStatusAsync(int statusId)
        {
            return await _context.Pedidos
                .Include(p => p.Cliente) // Necesario para ClienteNombre
                .Where(p => p.IDEstadoDePedido == statusId)
                .Select(p => new OrderSummaryDTO
                {
                    IDPedido = p.IDPedido,
                    Fecha = p.Fecha,
                    Total = p.Total,
                    IDEstadoDePedido = p.IDEstadoDePedido, // CLAVE: Aquí pasamos el ID al DTO
                    EstadoNombre = p.EstadoActual,
                    ClienteNombre = p.Cliente != null ? p.Cliente.Nombre : "Consumidor Final",
                    ResponsableNombre = p.Usuario != null ? p.Usuario.Nombre : "Sin asignar"
                })
                .ToListAsync();
        }

        public async Task<int> CreateOrderAsync(Pedido pedido)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                pedido.Fecha = DateTime.Now;
                pedido.IDEstadoDePedido = 1; // "Sin preparar"
                pedido.EstadoActual = "Sin preparar";

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
            return await _context.Pedidos
                .Include(p => p.Detalles)
                .ThenInclude(d => d.Producto)
                .FirstOrDefaultAsync(p => p.IDPedido == id);
        }
    }
}