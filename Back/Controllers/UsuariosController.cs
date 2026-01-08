using Microsoft.AspNetCore.Mvc;
using Back.Services;
using Microsoft.AspNetCore.Authorization;

namespace Back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize] // Opcional: Descomentá esto si querés que solo usuarios logueados entren aquí
    public class UsuariosController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsuariosController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/usuarios/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsuario(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
                return NotFound(new { message = "Usuario no encontrado." });

            return Ok(user);
        }

        // GET: api/usuarios (Opcional, pero útil para listar responsables)
        [HttpGet]
        public async Task<IActionResult> GetUsuarios()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
    }
}