using Back.Data;
using Back.Models;
using Back.Repositories;
using Back.Repositories.Interfaces;

public class ClientRepository : GenericRepository<Cliente>, IClientRepository
{
    public ClientRepository(AppDbContext context) : base(context) { }
}

