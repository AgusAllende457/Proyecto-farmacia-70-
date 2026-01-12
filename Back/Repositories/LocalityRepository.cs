using Back.Data;
using Back.Models;
using Back.Repositories;
using Back.Repositories.Interfaces;

public class LocalityRepository : GenericRepository<Localidad>, ILocalityRepository
{
    public LocalityRepository(AppDbContext context) : base(context) { }
}