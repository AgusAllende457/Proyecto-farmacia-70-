using Back.DTOs;

namespace Back.Services
{
    public interface IUserService
    {
        // Ref: RF13 - Listado de usuarios/responsables
        Task<IEnumerable<UserDTO>> GetAllUsersAsync();
        Task<UserDTO?> GetUserByIdAsync(int id);
    }
}