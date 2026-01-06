using Back.Models;

namespace Back.Repositories
{
    public interface IAuthRepository
    {
        Task<Usuario?> Login(string username, string password);
        Task<bool> UserExists(string username);
    }
}