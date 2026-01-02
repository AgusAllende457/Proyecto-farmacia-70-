using Microsoft.EntityFrameworkCore;
using Back.Models;

namespace Back.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

 
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurar las claves primarias (PK) según tu diagrama
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

            base.OnModelCreating(modelBuilder);
        }
    }
}