using Back.Data;
using Back.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Back.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // 1. Asegurar esquema
            context.Database.EnsureCreated();

            // --- TABLA: ESTADOS DE PEDIDOS ---
            // Actualizado con el ciclo de vida completo solicitado
            if (!context.EstadosDePedidos.Any())
            {
                context.EstadosDePedidos.AddRange(
                    new EstadoDePedido { NombreEstado = "Sin preparar", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "Preparar pedido", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "Demorado", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "Listo para despachar", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "Despachando", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "En camino", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "Entregado", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "Entrega fallida", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "Devolución", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "Cancelado", motivo_cancelacion = "Falta de stock o solicitud cliente" }
                );
                context.SaveChanges();
            }

            // --- TABLA: LOCALIDADES Y BARRIOS ---
            if (!context.Localidades.Any())
            {
                var cordoba = new Localidad { Ciudad = "Córdoba", Provincia = "Córdoba", CodigoPostal = "5000" };
                var rosario = new Localidad { Ciudad = "Rosario", Provincia = "Santa Fe", CodigoPostal = "2000" };

                context.Localidades.AddRange(cordoba, rosario);
                context.SaveChanges();

                context.Barrios.AddRange(
                    new Barrio { Nombre = "Nueva Córdoba", IDLocalidad = cordoba.IDLocalidad },
                    new Barrio { Nombre = "Centro", IDLocalidad = cordoba.IDLocalidad },
                    new Barrio { Nombre = "General Paz", IDLocalidad = cordoba.IDLocalidad }
                );
                context.SaveChanges();
            }

            // --- TABLA: SUCURSALES ---
            if (!context.Sucursales.Any())
            {
                context.Sucursales.AddRange(
                    new Sucursal { NombreSucursal = "Farmacia Centro", Dirección = "Av. Colon 123", Teléfono = "3514445566" },
                    new Sucursal { NombreSucursal = "Farmacia Nueva Cba", Dirección = "Estrada 456", Teléfono = "3517778899" }
                );
                context.SaveChanges();
            }

            // --- TABLA: USUARIOS ---
            if (!context.Usuarios.Any())
            {
                var sucursal = context.Sucursales.First();
                context.Usuarios.Add(new Usuario
                {
                    Nombre = "Admin",
                    Apellido = "Sistema",
                    UsuarioNombre = "admin",
                    Contraseña = "123",
                    Rol = "Administrador",
                    Mail = "admin@farmacia.com",
                    IDSucursal = sucursal.IDSucursal
                });
                context.SaveChanges();
            }

            // --- TABLA: CLIENTES ---
            if (!context.Clientes.Any())
            {
                var barrio = context.Barrios.First();
                var localidad = context.Localidades.First();

                context.Clientes.Add(new Cliente
                {
                    Nombre = "Juan",
                    Apellido = "Perez",
                    DNI = "30123456",
                    Telefono = "3510001122",
                    Mail = "juanperez@gmail.com",
                    Direccion = "Belgrano 800",
                    IDBarrio = barrio.IDBarrio,
                    IDLocalidad = localidad.IDLocalidad
                });
                context.SaveChanges();
            }

            // --- TABLA: PRODUCTOS ---
            if (!context.Productos.Any())
            {
                context.Productos.AddRange(
                    new Producto { NombreProducto = "Amoxidal 500", Descripcion = "Antibiótico", Categoria = "Farmacia", CantidadProducto = 50, PrecioProducto = 1500.50m },
                    new Producto { NombreProducto = "Ibuprofeno 600", Descripcion = "Analgésico", Categoria = "Venta Libre", CantidadProducto = 100, PrecioProducto = 800.00m },
                    new Producto { NombreProducto = "Vitamina C", Descripcion = "Suplemento", Categoria = "Vitamins", CantidadProducto = 30, PrecioProducto = 2500.00m }
                );
                context.SaveChanges();
            }
            // --- CARGA DE PEDIDO INICIAL (SEED DATA) ---
            if (!context.Pedidos.Any())
            {
                // 1. Obtener datos necesarios (Aseguramos que existan)
                var cliente = context.Clientes.First();
                var producto = context.Productos.First();
                var estadoInicial = context.EstadosDePedidos.First(e => e.NombreEstado == "Sin preparar");
                var sucursal = context.Sucursales.First();
                var localidad = context.Localidades.First();
                var usuarioSistema = context.Usuarios.First();

                // 2. Crear el Pedido
                var pedido = new Pedido
                {
                    Fecha = DateTime.Now,
                    Total = producto.PrecioProducto * 2,
                    FormaDePago = "Efectivo",
                    EstadoActual = "Sin preparar",
                    DireccionEntrega = cliente.Direccion,
                    IDLocalidad = localidad.IDLocalidad,
                    FechaEntregaEstimada = DateTime.Now.AddDays(1),
                    HoraEntregaEstimada = DateTime.Now.TimeOfDay,
                    IDCliente = cliente.IDCliente,
                    IDEstadoDePedido = estadoInicial.IDEstadoDePedido,
                    IDUsuario = usuarioSistema.IDUsuario,
                    IDSucursal = sucursal.IDSucursal
                };

                context.Pedidos.Add(pedido);
                context.SaveChanges(); // Guardamos para obtener el IDPedido generado

                // 3. Crear el Detalle del Pedido
                // Nota: Ya NO usamos PedidoIDPedido ni ProductoIDProducto
                context.DetallesDePedidos.Add(new DetalleDePedido
                {
                    IDPedido = pedido.IDPedido,
                    IDProducto = producto.IDProducto,
                    Cantidad = 2,
                    PrecioUnitario = producto.PrecioProducto
                });

                // 4. Crear el Historial de Estado inicial
                // Nota: Ya NO usamos las propiedades duplicadas (sombras de EF)
                context.HistorialesDeEstados.Add(new HistorialDeEstados
                {
                    IDPedido = pedido.IDPedido,
                    IDEstadoDePedido = estadoInicial.IDEstadoDePedido,
                    IDUsuario = usuarioSistema.IDUsuario,
                    fecha_hora_inicio = DateTime.Now,
                    fecha_hora_fin = null,
                    Observaciones = "Pedido recibido por el sistema"
                });

                context.SaveChanges();
            }

            Console.WriteLine("--- Semillado completo incluyendo Pedidos e Historial realizado con éxito ---");
        }
    }
}