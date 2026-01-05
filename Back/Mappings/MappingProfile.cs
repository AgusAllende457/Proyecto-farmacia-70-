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

            // Ref: RF7 - Autenticación de usuarios.
            // Ref: RF8 - Asignar permisos diferenciados según perfil.
            // Ref: RF11/RF12 - Especialización en roles (Admin, Operario, Cadete).
            CreateMap<Usuario, UserDTO>()
                // Usamos IDUsuario porque así está en tu modelo de Usuario
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.IDUsuario))
                .ForMember(dest => dest.Usuario, opt => opt.MapFrom(src => src.UsuarioNombre))
                // Mapeamos el Mail (en el DTO se llama Email)
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Mail))
                .ForMember(dest => dest.NombreCompleto,
                           opt => opt.MapFrom(src => $"{src.Nombre} {src.Apellido}"))
                .ForMember(dest => dest.Rol, opt => opt.MapFrom(src => src.Rol))
                .ForMember(dest => dest.NombreSucursal,
                           opt => opt.MapFrom(src => src.Sucursal != null ? src.Sucursal.NombreSucursal : "Sin Sucursal"));
        }
    }
}