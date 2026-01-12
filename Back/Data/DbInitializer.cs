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
            // 1. Asegurar esquema (No borra si ya existe tras comentar EnsureDeleted en Program)
            context.Database.EnsureCreated();

            // --- TABLA: ESTADOS DE PEDIDOS ---
            if (!context.EstadosDePedidos.Any())
            {
                context.EstadosDePedidos.AddRange(
                    new EstadoDePedido { NombreEstado = "Pendiente", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "En Preparación", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "Entregado", motivo_cancelacion = "N/A" },
                    new EstadoDePedido { NombreEstado = "Cancelado", motivo_cancelacion = "Falta de stock" }
                );
                context.SaveChanges();
            }

            // --- TABLA: LOCALIDADES Y BARRIOS ---
            if (!context.Localidades.Any())
            {
                var cordoba = new Localidad { Ciudad = "Córdoba", Provincia = "Córdoba", CodigoPostal = "5000" };
                var rosario = new Localidad { Ciudad = "Rosario", Provincia = "Santa Fe", CodigoPostal = "2000" };

                context.Localidades.AddRange(cordoba, rosario);
                context.SaveChanges(); // Guardamos para tener el IDLocalidad

                // Barrios vinculados a Córdoba (ID 1 aprox)
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
                    Contraseña = "123", // Recuerda usar Hash en producción
                    Rol = "Administrador",
                    Mail = "admin@farmacia.com",
                    IDSucursal = sucursal.IDSucursal,
                   
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

            Console.WriteLine("--- Semillado completo de todas las tablas realizado con éxito ---");
        }
    }
}