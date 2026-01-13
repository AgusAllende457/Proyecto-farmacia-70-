using Back.DTOs;
using Back.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderStatusService _statusService;
        private readonly ITrackingService _trackingService;

        public OrdersController(IOrderStatusService statusService, ITrackingService trackingService)
        {
            _statusService = statusService;
            _trackingService = trackingService;
        }

        // --- SECCIÓN ADMINISTRADOR: ASIGNACIÓN DE RESPONSABLES ---

        /// <summary>
        /// El Administrador asigna un Operario (Ingresado -> Preparado)
        /// </summary>
        [Authorize(Roles = "Administrador")]
        [HttpPatch("asignar-operario")]
        public async Task<IActionResult> AsignarOperario([FromBody] AssignOperatorDTO dto)
        {
            var resultado = await _statusService.AsignarOperarioAsync(dto);
            if (!resultado)
            {
                return BadRequest(new { message = "No se pudo asignar el operario. Verifique que el pedido esté 'Ingresado'." });
            }
            return Ok(new { message = "Operario asignado y pedido en estado 'Preparado'." });
        }

        /// <summary>
        /// El Administrador asigna un Cadete (Preparado -> Despachado)
        /// </summary>
        [Authorize(Roles = "Administrador")]
        [HttpPatch("asignar-cadete")]
        public async Task<IActionResult> AsignarCadete([FromBody] AssignDeliveryDTO dto)
        {
            var resultado = await _statusService.AsignarCadeteAsync(dto);
            if (!resultado)
            {
                return BadRequest(new { message = "No se pudo asignar el cadete. Verifique que el pedido esté 'Preparado'." });
            }
            return Ok(new { message = "Cadete asignado y pedido en estado 'Despachado'." });
        }


        // --- SECCIÓN OPERATIVA: CAMBIOS DE ESTADO (CADETE / GENERAL) ---

        /// <summary>
        /// RF2 - Cambiar Estado (Principalmente para Entregado/No Entregado por el Cadete)
        /// </summary>
        [Authorize(Roles = "Cadete,Administrador")]
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
                return BadRequest(new { message = $"No se pudo actualizar el estado. Verifique el flujo lógico del pedido." });
            }

            return Ok(new { message = "Estado del pedido actualizado correctamente." });
        }


        // --- SECCIÓN CONSULTAS: TRAZABILIDAD ---

        /// <summary>
        /// RF6 - Tablero de Seguimiento (Historial completo de estados)
        /// </summary>
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
