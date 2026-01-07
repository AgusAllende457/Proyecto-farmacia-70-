using AutoMapper;
using Back.Data;
using Back.Repositories;
using Back.Repositories.Interfaces;
using Back.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Back.Services; 
using Back.Services.Interfaces; 
namespace Back
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // --- CONFIGURACIÓN DE SERVICIOS ---

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Configuración de Base de Datos - Núcleo del sistema (RF1, RF2, RF17)
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // AutoMapper: Transformación de Entidades a DTOs (Seguridad y Trazabilidad)
            builder.Services.AddAutoMapper(typeof(Back.Mappings.MappingProfile));

            // FluentValidation: Validación automática de reglas de negocio
            builder.Services.AddFluentValidationAutoValidation();

            // Registro de Validadores
            builder.Services.AddValidatorsFromAssemblyContaining<LoginValidator>();

            // Conexión de Generic Repository
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

            // Registro de repositorios específicos
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IAuthRepository, AuthRepository>();

            // --- NUEVOS REPOSITORIOS (Seguimiento y Estados - Florencia) ---
            builder.Services.AddScoped<IOrderStatusRepository, OrderStatusRepository>();
            builder.Services.AddScoped<ITrackingRepository, TrackingRepository>();

            // Registro de implementaciones específicas para inyección directa
            builder.Services.AddScoped<ClientRepository>();
            builder.Services.AddScoped<ProductRepository>();
            builder.Services.AddScoped<LocalityRepository>();
            // --- REGISTRO DE LA CAPA DE SERVICIOS ---
            builder.Services.AddScoped<IOrderService, OrderService>();
            builder.Services.AddScoped<IClientService, ClientService>();
            builder.Services.AddScoped<IProductService, ProductService>();

            var app = builder.Build();

            // --- PIPELINE DE SOLICITUDES HTTP ---

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Ref: RF8 - El sistema controlará el acceso mediante perfiles (Authorization)
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
