using Back.Data;
using Back.Models;
using Back.Repositories;
using Back.Repositories.Interfaces;

public class ProductRepository : GenericRepository<Producto>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context) { }
}

