using Back.Data;
using Back.Models;
using Back.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Back.Repositories
{
    public class OrderStatusRepository : IOrderStatusRepository
    {
        private readonly AppDbContext _context; 

        public OrderStatusRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ActualizarEstadoAsync(HistorialDeEstados nuevoHistorial)
        {
            var pedido = await _context.Pedidos.FindAsync(nuevoHistorial.IDPedido);
            if (pedido == null) return false;

            pedido.IDEstadoDePedido = nuevoHistorial.IDEstadoDePedido;

            // Nombre de la tabla según tu AppDbContext: HistorialesDeEstados
            _context.HistorialesDeEstados.Add(nuevoHistorial);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}