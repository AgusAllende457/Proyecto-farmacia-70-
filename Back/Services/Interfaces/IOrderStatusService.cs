using Back.DTOs;

namespace Back.Services.Interfaces
{
    public interface IOrderStatusService
    {
        // Métodos de asignación para el Admin
        Task<bool> AsignarOperarioAsync(AssignOperatorDTO dto);
        Task<bool> AsignarCadeteAsync(AssignDeliveryDTO dto);

        // Método general de cambio de estado (Cadete/Admin)
        Task<bool> CambiarEstadoAsync(ChangeOrderStatusDTO changeStatusDto);
    }
}