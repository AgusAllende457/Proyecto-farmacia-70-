using Microsoft.AspNetCore.Mvc;
using Back.Services.Interfaces;
using Back.DTOs;

namespace Back.Controllers
{
    /// <summary>
    /// Controlador para la gestión de pedidos y reportes filtrados.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class FiltrarPedidosController : ControllerBase
    {
        private readonly IPedidoService _pedidoService;

        public FiltrarPedidosController(IPedidoService pedidoService)
        {
            _pedidoService = pedidoService;
        }

        /// <summary>
        /// Obtiene una lista de pedidos basada en los filtros proporcionados.
        /// </summary>
        /// <param name="filters">DTO con los criterios de búsqueda (fechas, cliente, estado).</param>
        /// <returns>Colección de resúmenes de pedidos.</returns>
        [HttpGet("reporte")]
        public async Task<IActionResult> GetFilteredOrders([FromQuery] OrderFilterDTO filters)
        {
            try
            {
                // El FromQuery permite mapear los parámetros de la URL directamente al DTO
                var result = await _pedidoService.GetFilteredOrdersAsync(filters);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                // Maneja la validación de fechas que pusimos en el servicio
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Error genérico para logs internos y respuesta segura al cliente
                return StatusCode(500, new { message = "Ocurrió un error interno al procesar el reporte.", detail = ex.Message });
            }
        }
    }
}
