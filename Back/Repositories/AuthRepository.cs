using Back.Data;
using Back.Models;
using Microsoft.EntityFrameworkCore;

namespace Back.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _context;

        public AuthRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> Login(string username, string password)
        {
            // Ref: RF7 - El sistema debe permitir la autenticación de usuarios.
            // Buscamos por UsuarioNombre y Contraseña según tu modelo.
            var user = await _context.Usuarios
                .Include(u => u.Sucursal) // Importante para el UserDTO después
                .FirstOrDefaultAsync(x => x.UsuarioNombre == username && x.Contraseña == password);

            return user;
        }

        public async Task<bool> UserExists(string username)
        {
            return await _context.Usuarios.AnyAsync(x => x.UsuarioNombre == username);
        }
    }
}