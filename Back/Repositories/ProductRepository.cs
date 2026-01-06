using Back.Data;
using Back.Models;
using Back.Repositories;

public class ProductRepository : GenericRepository<Producto>
{
    public ProductRepository(AppDbContext context) : base(context) { }
}