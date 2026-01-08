using AutoMapper;
using Back.DTOs;
using Back.Models;
using Back.Repositories.Interfaces;
using Back.Services.Interfaces;

namespace Back.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository orderRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
        }

        public async Task<int> CreateOrderAsync(CreateOrderDTO orderDto)
        {
            // Convertimos DTO a Modelo
            var pedido = _mapper.Map<Pedido>(orderDto);

            // Lógica del Mandato: Registro inicial en el historial para trazabilidad
            var historialInicial = new HistorialDeEstados
            {
                IDEstadoDePedido = 1, // "Sin preparar"
                fecha_hora_inicio = DateTime.Now,
                IDUsuario = orderDto.IDUsuario,
                Observaciones = "Pedido recibido e ingresado al sistema."
            };

            pedido.HistorialDeEstados.Add(historialInicial);

            // El repo maneja la transacción y el guardado de detalles (RF17)
            return await _orderRepository.CreateOrderAsync(pedido);
        }

        public async Task<OrderTrackingDTO> GetOrderTrackingAsync(int id)
        {
            var pedido = await _orderRepository.GetOrderWithDetailsAsync(id);
            if (pedido == null) return null;

            return _mapper.Map<OrderTrackingDTO>(pedido);
        }

        public async Task<bool> UpdateOrderStatusAsync(ChangeOrderStatusDTO changeDto)
        {
            // Lógica para futuros cambios de estado
            throw new NotImplementedException();
        }
    }
}