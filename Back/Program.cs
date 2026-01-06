using AutoMapper;
using Back.Data;
using Back.Repositories;
using Back.Repositories.Interfaces;
using Back.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;

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

            // Con esta sola línea basta para registrar LoginValidator, UserValidator y CreateOrderValidator
            // siempre que estén en el mismo proyecto/carpeta.
            builder.Services.AddValidatorsFromAssemblyContaining<LoginValidator>();
            //conexion de generic repository
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            //registro de repositorios específicos
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IAuthRepository, AuthRepository>();

            // Registro de implementaciones específicas para inyección directa si fuera necesario
            builder.Services.AddScoped<ClientRepository>();
            builder.Services.AddScoped<ProductRepository>();
            builder.Services.AddScoped<LocalityRepository>();
           

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
