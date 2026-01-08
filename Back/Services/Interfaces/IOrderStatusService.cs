using Back.DTOs;

namespace Back.Services.Interfaces
{
    public interface IOrderStatusService
    {
        Task<bool> CambiarEstadoAsync(ChangeOrderStatusDTO changeStatusDto);
    }
}