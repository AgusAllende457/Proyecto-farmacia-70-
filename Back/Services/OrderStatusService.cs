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

        // 1. ASIGNAR OPERARIO (ADMIN) - Pasa de Sin preparar (1) a Preparar pedido (2)
        public async Task<bool> AsignarOperarioAsync(AssignOperatorDTO dto)
        {
            var pedido = await _orderRepository.GetByIdAsync(dto.PedidoId);

            if (pedido == null || pedido.IDEstadoDePedido != 1) return false;

            pedido.IDEstadoDePedido = 2; // Preparar pedido
            pedido.IDUsuario = dto.OperarioId; 

            var historial = new HistorialDeEstados
            {
                IDPedido = pedido.IDPedido,
                IDEstadoDePedido = 2,
                IDUsuario = dto.OperarioId,
                fecha_hora_inicio = DateTime.Now,
                Observaciones = "Admin asignó operario para la preparación del pedido."
            };

            return await _repository.ActualizarEstadoAsync(historial);
        }

        // 2. ASIGNAR CADETE (ADMIN) - Pasa de Listo para despachar (4) a En camino (6)
        public async Task<bool> AsignarCadeteAsync(AssignDeliveryDTO dto)
        {
            var pedido = await _orderRepository.GetByIdAsync(dto.PedidoId);

            // El pedido debe estar en 4 (Listo para despachar) 
            // para que un cadete sea asignado y pase a 6 (En camino)
            if (pedido == null || pedido.IDEstadoDePedido != 4) return false;

            pedido.IDEstadoDePedido = 6; // En camino
            pedido.IDUsuario = dto.CadeteId; 

            var historial = new HistorialDeEstados
            {
                IDPedido = pedido.IDPedido,
                IDEstadoDePedido = 6,
                IDUsuario = dto.CadeteId,
                fecha_hora_inicio = DateTime.Now,
                Observaciones = "Admin asignó cadete. Pedido en camino al domicilio."
            };

            return await _repository.ActualizarEstadoAsync(historial);
        }

        // 3. CAMBIO DE ESTADO FINAL (CADETE) - Entregado (7) o Entrega fallida (8)
        public async Task<bool> CambiarEstadoAsync(ChangeOrderStatusDTO changeStatusDto)
        {
            var pedido = await _orderRepository.GetByIdAsync(changeStatusDto.IDPedido);
            if (pedido == null) return false;

            // REGLA CLAVE: El cadete solo puede finalizar si el pedido está "En camino" (6)
            if (pedido.IDEstadoDePedido != 6) return false;

            // Actualizamos datos de entrega real si el estado es Entregado (7)
            if (changeStatusDto.IDNuevoEstado == 7)
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
                // Prioriza Motivo de Cancelación si es estado 8, sino usa Observaciones
                Observaciones = changeStatusDto.IDNuevoEstado == 8 
                                ? changeStatusDto.MotivoCancelacion 
                                : (changeStatusDto.Observaciones ?? "Estado actualizado por el cadete.")
            };

            return await _repository.ActualizarEstadoAsync(nuevoHistorial);
        }

        // 4. CANCELAR PEDIDO (ADMIN/OPERARIO) - Pasa a Cancelado (10)
        
        public async Task<bool> CancelarPedidoAsync(CancelarPedidoDTO dto, int userId)
        {
            var pedido = await _orderRepository.GetByIdAsync(dto.PedidoId);

            // No se puede cancelar si ya está entregado (7) o ya cancelado (10)
            if (pedido == null || pedido.IDEstadoDePedido == 7 || pedido.IDEstadoDePedido == 10)
                return false;

            pedido.IDEstadoDePedido = 10; // Estado Cancelado

            var historial = new HistorialDeEstados
            {
                IDPedido = pedido.IDPedido,
                IDEstadoDePedido = 10,
                IDUsuario = userId, // El ID del Admin/Operario que cancela
                fecha_hora_inicio = DateTime.Now,
                // Registramos el ID del motivo y la justificación en las observaciones
                Observaciones = $"Cancelación (Motivo ID: {dto.MotivoCancelacionId}). Justificación: {dto.Justificacion ?? "Sin justificación adicional."}"
            };

            return await _repository.ActualizarEstadoAsync(historial);
        }

        public async Task<bool> CancelarPedidoAsync(CancelarPedidoDTO dto)
        {
            // 1. Obtener el pedido
            var pedido = await _orderRepository.GetByIdAsync(dto.PedidoId);

            // 2. Validaciones: No cancelar si no existe, si ya se entregó (7) o ya se canceló (10)
            if (pedido == null || pedido.IDEstadoDePedido == 7 || pedido.IDEstadoDePedido == 10)
                return false;

            // 3. Actualizar el modelo Pedido con los datos del DTO
            pedido.IDEstadoDePedido = 10;
            pedido.MotivoCancelacionId = dto.MotivoCancelacionId;
            pedido.JustificacionCancelacion = dto.Justificacion;

            // 4. Crear el historial
            // Nota: Como la firma no recibe userId, usamos el IDUsuario actual del pedido 
            // o podrías agregar 'UsuarioId' al CancelarPedidoDTO para mayor precisión.
            var historial = new HistorialDeEstados
            {
                IDPedido = pedido.IDPedido,
                IDEstadoDePedido = 10,
                IDUsuario = pedido.IDUsuario, // Usuario responsable registrado
                fecha_hora_inicio = DateTime.Now,
                Observaciones = $"Cancelación. Motivo ID: {dto.MotivoCancelacionId}. Justificación: {dto.Justificacion ?? "Sin detalle."}"
            };

            // 5. Persistir cambios mediante el repositorio
            return await _repository.ActualizarEstadoAsync(historial); ;
        }
    }

}