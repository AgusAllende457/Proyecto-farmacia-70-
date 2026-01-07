using Back.DTOs;

namespace Back.Services
{
    public interface IAuthService
    {
        // Ref: RF7 - Autenticación de usuarios
        Task<UserDTO?> Login(LoginDTO loginDto);

        // Ref: Mandato Ampliado - Seguridad mediante Tokens JWT
        string GenerateToken(UserDTO user);
    }
}
