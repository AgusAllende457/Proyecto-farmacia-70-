using Back.Data;
using Back.Models;
using Back.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Back.Repositories
{
    public class TrackingRepository : ITrackingRepository
    {
        private readonly AppDbContext _context; // <--- Nombre corregido

        public TrackingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Pedido?> ObtenerSeguimientoCompletoAsync(int idPedido)
        {
            return await _context.Pedidos
                .Include(p => p.EstadoDePedido)
                .Include(p => p.HistorialDeEstados) // Esta es la propiedad de navegación en el Model
                    .ThenInclude(h => h.EstadoDePedido)
                .Include(p => p.HistorialDeEstados)
                    .ThenInclude(h => h.Usuario)
                .FirstOrDefaultAsync(p => p.IDPedido == idPedido);
        }
    }
}
