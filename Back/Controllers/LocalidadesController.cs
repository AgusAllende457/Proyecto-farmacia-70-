using Microsoft.AspNetCore.Mvc;
using Back.Services.Interfaces;

namespace Back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocalidadesController : ControllerBase
    {
        private readonly ILocalidadService _localidadservice;

        public LocalidadesController(ILocalidadService localidadService)
        {
            _localidadservice = localidadService;
        }

        // GET: api/localidades
        // Motivo: Cargar el listado de localidades para formularios (RF6)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Usamos el método definido en tu interfaz ILocationService
            var localidades = await _localidadservice.GetAllLocalidadesAsync();
            return Ok(localidades);
        }
    }
}