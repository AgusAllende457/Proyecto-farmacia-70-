using Back.DTOs;
using Back.DTOS;
using Back.Services;
using Back.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers
{
    [Route("api/usuarios")]
    [ApiController]
    [Authorize(Roles = "Administrador")]
    public class UserManagementController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserManagementService _userManagementService;
        private readonly ILogger<UserManagementController> _logger;

        public UserManagementController(
            IUserService userService,
            IUserManagementService userManagementService,
            ILogger<UserManagementController> logger)
        {
            _userService = userService;
            _userManagementService = userManagementService;
            _logger = logger;
        }

        // ==========================================
        // MÉTODOS GET (Lectura)
        // ==========================================

        // 1. GET: Traer un usuario por ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // 2. GET: Listar TODOS los usuarios
        // (Este es el que rescatamos del controlador viejo)
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // ==========================================
        // MÉTODOS POST/PUT (Escritura)
        // ==========================================

        // 3. POST: Crear usuario
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] RegisterDTO registerDto)
        {
            try
            {
                var createdUser = await _userService.RegisterUserAsync(registerDto);
                // Usamos .Id según tu UserDTO
                return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creando usuario");
                // Mostramos el error interno si existe (útil para ver problemas de SQL/Foreign Keys)
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : "";
                return BadRequest($"Error: {ex.Message} || Detalle: {innerMessage}");
            }
        }

        // 4. PUT: Actualizar datos básicos
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDTO updateDto)
        {
            try
            {
                if (id != updateDto.IDUsuario)
                    return BadRequest("El ID de la URL no coincide con el ID del cuerpo.");

                var result = await _userService.UpdateUserAsync(id, updateDto);

                if (!result) return NotFound($"Usuario con ID {id} no encontrado.");

                return Ok(new { message = "Usuario actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error actualizando: {ex.Message}");
            }
        }

        // 5. PUT: Cambiar Rol
        [HttpPut("{id}/rol")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] ChangeRoleDTO roleDto)
        {
            try
            {
                bool result = await _userManagementService.ChangeUserRoleAsync(id, roleDto.NewRole);

                if (!result) return NotFound("Usuario no encontrado.");

                return Ok(new { message = $"Rol actualizado a {roleDto.NewRole} correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error cambiando rol: {ex.Message}");
            }
        }
    }
}