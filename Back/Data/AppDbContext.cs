using Back.Models;
using Microsoft.EntityFrameworkCore;

namespace Back.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // 1. Las Tablas (DbSets)
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<DetalleDePedido> DetallesDePedidos { get; set; }
        public DbSet<Sucursal> Sucursales { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Localidad> Localidades { get; set; }
        public DbSet<EstadoDePedido> EstadosDePedidos { get; set; }
        public DbSet<IntentoDeEntrega> IntentosDeEntregas { get; set; }
        public DbSet<HistorialDeEstados> HistorialesDeEstados { get; set; }

        // 2. La Configuración 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Definir Claves Primarias (PKs)
            modelBuilder.Entity<Usuario>().HasKey(u => u.IDUsuario);
            modelBuilder.Entity<Producto>().HasKey(p => p.IDProducto);
            modelBuilder.Entity<Pedido>().HasKey(p => p.IDPedido);
            modelBuilder.Entity<DetalleDePedido>().HasKey(d => d.IDDetalleDePedido);
            modelBuilder.Entity<Sucursal>().HasKey(s => s.IDSucursal);
            modelBuilder.Entity<Cliente>().HasKey(c => c.IDCliente);
            modelBuilder.Entity<Localidad>().HasKey(l => l.IDLocalidad);
            modelBuilder.Entity<EstadoDePedido>().HasKey(e => e.IDEstadoDePedido);
            modelBuilder.Entity<IntentoDeEntrega>().HasKey(i => i.IDIntentoDeEntrega);
            modelBuilder.Entity<HistorialDeEstados>().HasKey(h => h.IDHistorialEstados);

            // --- CONFIGURACIÓN DE PRECISIÓN DECIMAL ---
            modelBuilder.Entity<DetalleDePedido>()
                .Property(d => d.PrecioUnitario)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Pedido>()
                .Property(p => p.Total)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Producto>()
                .Property(p => p.PrecioProducto)
                .HasPrecision(18, 2);

            // --- RELACIONES (PREVENCIÓN DE BORRADO EN CASCADA) ---
            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Usuario)
                .WithMany(u => u.Pedidos)
                .HasForeignKey(p => p.IDUsuario)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Sucursal)
                .WithMany(s => s.Pedidos)
                .HasForeignKey(p => p.IDSucursal)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Cliente)
                .WithMany(c => c.Pedidos)
                .HasForeignKey(p => p.IDCliente)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.EstadoDePedido)
                .WithMany(e => e.Pedidos)
                .HasForeignKey(p => p.IDEstadoDePedido)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<HistorialDeEstados>()
                .HasOne(h => h.EstadoDePedido)
                .WithMany(e => e.Historiales)
                .HasForeignKey(h => h.IDEstadoDePedido)
                .OnDelete(DeleteBehavior.NoAction);

            // --- CARGA DE DATOS INICIALES (15 REGISTROS TOTALES) ---

            // Estados de Pedido (6 registros)
            modelBuilder.Entity<EstadoDePedido>().HasData(
                new EstadoDePedido { IDEstadoDePedido = 1, NombreEstado = "Pendiente" },
                new EstadoDePedido { IDEstadoDePedido = 2, NombreEstado = "En Preparación" },
                new EstadoDePedido { IDEstadoDePedido = 3, NombreEstado = "En Camino" },
                new EstadoDePedido { IDEstadoDePedido = 4, NombreEstado = "Entregado" },
                new EstadoDePedido { IDEstadoDePedido = 5, NombreEstado = "Cancelado" },
                new EstadoDePedido { IDEstadoDePedido = 6, NombreEstado = "Rechazado" }
            );

            // Localidades (6 registros)
            modelBuilder.Entity<Localidad>().HasData(
                new Localidad { IDLocalidad = 1, Provincia = "Córdoba", Ciudad = "Córdoba", Barrio = "Centro", CodigoPostal = "5000" },
                new Localidad { IDLocalidad = 2, Provincia = "Córdoba", Ciudad = "Córdoba", Barrio = "Nueva Córdoba", CodigoPostal = "5000" },
                new Localidad { IDLocalidad = 3, Provincia = "Córdoba", Ciudad = "Córdoba", Barrio = "General Paz", CodigoPostal = "5000" },
                new Localidad { IDLocalidad = 4, Provincia = "Córdoba", Ciudad = "Villa Carlos Paz", Barrio = "Centro", CodigoPostal = "5152" },
                new Localidad { IDLocalidad = 5, Provincia = "Córdoba", Ciudad = "Alta Gracia", Barrio = "Solares", CodigoPostal = "5186" },
                new Localidad { IDLocalidad = 6, Provincia = "Buenos Aires", Ciudad = "CABA", Barrio = "Palermo", CodigoPostal = "1425" }
            );

            // Sucursales (3 registros)
            modelBuilder.Entity<Sucursal>().HasData(
                new Sucursal { IDSucursal = 1, NombreSucursal = "Sucursal Córdoba Centro", Dirección = "Av. Colón 123", Teléfono = "0351-4444444" },
                new Sucursal { IDSucursal = 2, NombreSucursal = "Sucursal Carlos Paz", Dirección = "9 de Julio 50", Teléfono = "03541-555555" },
                new Sucursal { IDSucursal = 3, NombreSucursal = "Sucursal Buenos Aires", Dirección = "Av. Santa Fe 2500", Teléfono = "011-6666666" }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}