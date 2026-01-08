using Back.DTOs;
using Back.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Podés descomentar esto si querés que solo usuarios logueados lo usen
    public class OrdersController : ControllerBase
    {
        private readonly IOrderStatusService _statusService;
        private readonly ITrackingService _trackingService;

        public OrdersController(IOrderStatusService statusService, ITrackingService trackingService)
        {
            _statusService = statusService;
            _trackingService = trackingService;
        }

        // 1. PUT: /api/orders/{id}/estado (RF2 - Cambiar Estado)
        [HttpPut("{id}/estado")]
        public async Task<IActionResult> CambiarEstado(int id, [FromBody] ChangeOrderStatusDTO changeStatusDto)
        {
            if (id != changeStatusDto.IDPedido)
            {
                return BadRequest("El ID del pedido no coincide.");
            }

            var resultado = await _statusService.CambiarEstadoAsync(changeStatusDto);

            if (!resultado)
            {
                return NotFound($"No se encontró el pedido con ID {id} o no se pudo actualizar.");
            }

            return Ok(new { message = "Estado del pedido actualizado correctamente." });
        }

        // 2. GET: /api/orders/{id}/seguimiento (RF6 - Tablero/Seguimiento)
        // Nota: Lo llamamos seguimiento porque es el término técnico para el historial completo solicitado
        [HttpGet("{id}/seguimiento")]
        public async Task<ActionResult<OrderTrackingDTO>> GetSeguimiento(int id)
        {
            var seguimiento = await _trackingService.ObtenerSeguimientoAsync(id);

            if (seguimiento == null)
            {
                return NotFound($"No se encontró historial para el pedido con ID {id}.");
            }

            return Ok(seguimiento);
        }
    }
}
