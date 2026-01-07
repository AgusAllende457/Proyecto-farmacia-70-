using AutoMapper;
using Back.DTOs;
using Back.Models;
using Back.Repositories.Interfaces;
using Back.Services.Interfaces;

namespace Back.Services
{
    public class OrderStatusService : IOrderStatusService
    {
        private readonly IOrderStatusRepository _repository;
        private readonly IMapper _mapper;

        public OrderStatusService(IOrderStatusRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<bool> CambiarEstadoAsync(ChangeOrderStatusDTO changeStatusDto)
        {
            // Convertimos el DTO en el modelo de la base de datos
            var nuevoHistorial = _mapper.Map<HistorialDeEstados>(changeStatusDto);

            // Le pedimos al repo que guarde el cambio
            return await _repository.ActualizarEstadoAsync(nuevoHistorial);
        }
    }
}