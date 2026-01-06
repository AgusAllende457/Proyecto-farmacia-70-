using Back.Data;
using Back.Models;
using Back.Repositories;

public class LocalityRepository : GenericRepository<Localidad>
{
    public LocalityRepository(AppDbContext context) : base(context) { }
}