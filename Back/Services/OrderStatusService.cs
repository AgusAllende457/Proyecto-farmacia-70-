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
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;

        public OrderStatusService(IOrderStatusRepository repository, IOrderRepository orderRepository, IMapper mapper)
        {
            _repository = repository;
            _orderRepository = orderRepository;
            _mapper = mapper;
        }

        // 1. ASIGNAR OPERARIO (ADMIN) - Pasa de Ingresado (1) a Preparado (2)
        public async Task<bool> AsignarOperarioAsync(AssignOperatorDTO dto)
        {
            var pedido = await _orderRepository.GetByIdAsync(dto.PedidoId);

            // Validación: Solo si el pedido existe y está en estado Ingresado
            if (pedido == null || pedido.IDEstadoDePedido != 1) return false;

            // Actualizamos el pedido según tu modelo
            pedido.IDEstadoDePedido = 2; // Preparado
            pedido.IDUsuario = dto.OperarioId; // El responsable ahora es el Operario

            var historial = new HistorialDeEstados
            {
                IDPedido = pedido.IDPedido,
                IDEstadoDePedido = 2,
                IDUsuario = dto.OperarioId,
                fecha_hora_inicio = DateTime.Now,
                Observaciones = "Admin asignó operario para la preparación del pedido."
            };

            // Aquí el repositorio debe actualizar el Pedido y agregar el Historial
            return await _repository.ActualizarEstadoAsync(historial);
        }

        // 2. ASIGNAR CADETE (ADMIN) - Pasa de Preparado (2) a Despachado (3)
        public async Task<bool> AsignarCadeteAsync(AssignDeliveryDTO dto)
        {
            var pedido = await _orderRepository.GetByIdAsync(dto.PedidoId);

            // Validación: Solo si está Preparado
            if (pedido == null || pedido.IDEstadoDePedido != 2) return false;

            pedido.IDEstadoDePedido = 3; // Despachado
            pedido.IDUsuario = dto.CadeteId; // El responsable ahora es el Cadete

            var historial = new HistorialDeEstados
            {
                IDPedido = pedido.IDPedido,
                IDEstadoDePedido = 3,
                IDUsuario = dto.CadeteId,
                fecha_hora_inicio = DateTime.Now,
                Observaciones = "Admin asignó cadete. Pedido en camino."
            };

            return await _repository.ActualizarEstadoAsync(historial);
        }

        // 3. CAMBIO DE ESTADO FINAL (CADETE) - Entregado (4) o No Entregado (5)
        public async Task<bool> CambiarEstadoAsync(ChangeOrderStatusDTO changeStatusDto)
        {
            var pedido = await _orderRepository.GetByIdAsync(changeStatusDto.IDPedido);
            if (pedido == null) return false;

            // Regla: El cadete solo puede informar sobre pedidos Despachados (3)
            if (pedido.IDEstadoDePedido != 3) return false;

            // Actualizamos datos de entrega real si el estado es Entregado (4)
            if (changeStatusDto.IDNuevoEstado == 4)
            {
                pedido.FechaEntregaReal = DateTime.Now;
                pedido.HoraEntregaReal = DateTime.Now.TimeOfDay;
            }

            pedido.IDEstadoDePedido = changeStatusDto.IDNuevoEstado;

            var nuevoHistorial = new HistorialDeEstados
            {
                IDPedido = pedido.IDPedido,
                IDEstadoDePedido = changeStatusDto.IDNuevoEstado,
                IDUsuario = changeStatusDto.IDUsuario,
                fecha_hora_inicio = DateTime.Now,
                Observaciones = changeStatusDto.Observaciones ?? changeStatusDto.MotivoCancelacion
            };

            return await _repository.ActualizarEstadoAsync(nuevoHistorial);
        }
    }
}