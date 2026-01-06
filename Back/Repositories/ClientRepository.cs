using Back.Data;
using Back.Models;
using Back.Repositories;

public class ClientRepository : GenericRepository<Cliente>
{
    public ClientRepository(AppDbContext context) : base(context) { }
}