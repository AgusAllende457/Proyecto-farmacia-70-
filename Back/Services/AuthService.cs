using AutoMapper;
using Back.DTOs;
using Back.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Back.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public AuthService(IAuthRepository authRepository, IMapper mapper, IConfiguration config)
        {
            _authRepository = authRepository;
            _mapper = mapper;
            _config = config;
        }

        public async Task<UserDTO?> Login(LoginDTO loginDto)
        {
            // Buscamos el usuario en la BD a través del repositorio
            var usuario = await _authRepository.Login(loginDto.Usuario, loginDto.Password);

            if (usuario == null) return null;

            // Usamos AutoMapper para devolver un DTO seguro (sin la contraseña)
            return _mapper.Map<UserDTO>(usuario);
        }

        public string GenerateToken(UserDTO user)
        {
            // Ref: RF8 - Definición de Claims para control de acceso por Rol
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Usuario),
                new Claim(ClaimTypes.Role, user.Rol), // Indispensable para RF1.1 y RF1.2
                new Claim("Sucursal", user.NombreSucursal)
            };

            // La clave debe estar en tu appsettings.json
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}