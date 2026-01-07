using AutoMapper;
using Back.DTOs;
using Back.Repositories.Interfaces;
using Back.Services.Interfaces;

namespace Back.Services
{
    public class TrackingService : ITrackingService
    {
        private readonly ITrackingRepository _repository;
        private readonly IMapper _mapper;

        public TrackingService(ITrackingRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<OrderTrackingDTO?> ObtenerSeguimientoAsync(int idPedido)
        {
            // Buscamos el pedido con todo su historial
            var pedido = await _repository.ObtenerSeguimientoCompletoAsync(idPedido);

            if (pedido == null) return null;

            // Convertimos el pedido (y su lista de estados) al DTO de seguimiento
            return _mapper.Map<OrderTrackingDTO>(pedido);
        }
    }
}