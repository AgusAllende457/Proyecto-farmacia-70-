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
            // 1. MAPPING PARA ChangeOrderStatusDTO (De DTO a Modelo)
            CreateMap<ChangeOrderStatusDTO, HistorialDeEstados>()
                .ForMember(dest => dest.IDPedido, opt => opt.MapFrom(src => src.IDPedido))
                .ForMember(dest => dest.IDEstadoDePedido, opt => opt.MapFrom(src => src.IDNuevoEstado))
                .ForMember(dest => dest.IDUsuario, opt => opt.MapFrom(src => src.IDUsuario))
                .ForMember(dest => dest.fecha_hora_inicio, opt => opt.MapFrom(src => DateTime.Now));

            // 2. MAPPING PARA OrderTrackingDTO (De Modelo Pedido a DTO)
            CreateMap<Pedido, OrderTrackingDTO>()
                .ForMember(dest => dest.IDPedido, opt => opt.MapFrom(src => src.IDPedido))
                .ForMember(dest => dest.EstadoActual, opt => opt.MapFrom(src => src.EstadoDePedido.NombreEstado))
                .ForMember(dest => dest.UltimaActualizacion, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.Historial, opt => opt.MapFrom(src => src.HistorialDeEstados));

            // 3. MAPPING PARA LOS ITEMS DEL HISTORIAL
            CreateMap<HistorialDeEstados, TrackingHistoryItemDTO>()
                .ForMember(dest => dest.NombreEstado, opt => opt.MapFrom(src => src.EstadoDePedido.NombreEstado))
                .ForMember(dest => dest.FechaHora, opt => opt.MapFrom(src => src.fecha_hora_inicio))
                .ForMember(dest => dest.Responsable, opt => opt.MapFrom(src => src.Usuario.Nombre + " " + src.Usuario.Apellido))
                .ForMember(dest => dest.MotivoCancelacion, opt => opt.MapFrom(src => src.EstadoDePedido.motivo_cancelacion));
        }
    }
}