using Microsoft.AspNetCore.Mvc;
using Back.Services.Interfaces;
using Back.DTOs;
using System;
using System.Threading.Tasks;

namespace Back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FiltrarPedidosController : ControllerBase
    {
        private readonly IPedidoService _pedidoService;

        public FiltrarPedidosController(IPedidoService pedidoService)
        {
            _pedidoService = pedidoService;
        }

        [HttpGet("reporte")]
        public async Task<IActionResult> GetFilteredOrders([FromQuery] OrderFilterDTO filters)
        {
            try
            {
                // El [FromQuery] mapeará automáticamente el ?search=... de la URL al DTO
                var result = await _pedidoService.GetFilteredOrdersAsync(filters);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Ocurrió un error interno al procesar el reporte.",
                    detail = ex.Message
                });
            }
        }
    }
}