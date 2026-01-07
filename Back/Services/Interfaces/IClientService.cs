using Back.Models;

namespace Back.Services.Interfaces
{
    public interface IClientService
    {
        // Para listar clientes en el combo del frontend
        Task<IEnumerable<Cliente>> GetAllClientsAsync();
    }

    public interface IProductService
    {
        // Para listar productos y ver stock (Mandato)
        Task<IEnumerable<Producto>> GetAllProductsAsync();
    }
}