using Back.Models;
using Back.Repositories.Interfaces;
using Back.Services.Interfaces;

namespace Back.Services
{
    public class ProductService : IProductService
    {
        private readonly IGenericRepository<Producto> _productRepository;

        public ProductService(IGenericRepository<Producto> productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<Producto>> GetAllProductsAsync()
        {
            return await _productRepository.GetAllAsync();
        }
    }
}