using Back.Data;
using Back.Models;
using Microsoft.EntityFrameworkCore;

namespace Back.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            // Ref: RF13 - Listar pedidos y responsables. Necesitamos traer la sucursal.
            return await _context.Usuarios.Include(u => u.Sucursal).ToListAsync();
        }

        public async Task<Usuario?> GetByIdAsync(int id)
        {
            return await _context.Usuarios
                .Include(u => u.Sucursal)
                .FirstOrDefaultAsync(u => u.IDUsuario == id);
        }

        public async Task<bool> CreateAsync(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAsync(Usuario usuario)
        {
            _context.Usuarios.Update(usuario);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await GetByIdAsync(id);
            if (user == null) return false;
            _context.Usuarios.Remove(user);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}