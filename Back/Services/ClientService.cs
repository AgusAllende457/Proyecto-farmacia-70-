using Back.Models;
using Back.Repositories.Interfaces;
using Back.Services.Interfaces;

namespace Back.Services
{
    public class ClientService : IClientService
    {
        private readonly IGenericRepository<Cliente> _clientRepository;

        public ClientService(IGenericRepository<Cliente> clientRepository)
        {
            _clientRepository = clientRepository;
        }

        public async Task<IEnumerable<Cliente>> GetAllClientsAsync()
        {
            return await _clientRepository.GetAllAsync();
        }
    }
}