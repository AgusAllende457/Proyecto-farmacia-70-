using AutoMapper;
using Back.Models;
using Back.DTOs;

namespace Back.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Este es el mapa para crear el pedido (RF17)
            CreateMap<CreateOrderDTO, Pedido>();
            CreateMap<OrderDetailDTO, DetalleDePedido>();
        }
    }
}