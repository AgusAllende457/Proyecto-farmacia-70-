﻿using Back.Data;
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
                
                context.Usuarios.AddRange(
                    new Usuario
                    {
                        Nombre = "Admin",
                        Apellido = "Sistema",
                        UsuarioNombre = "admin",
                        Contraseña = "123",
                        Rol = "Administrador",
                        Mail = "admin@farmacia.com",
                        IDSucursal = sucursal.IDSucursal
                    },
                    new Usuario
                    {
                        Nombre = "Pepe",
                        Apellido = "Operario",
                        UsuarioNombre = "operario",
                        Contraseña = "123",
                        Rol = "Operario",
                        Mail = "operario@farmacia.com",
                        IDSucursal = sucursal.IDSucursal
                    },
                    new Usuario
                    {
                        Nombre = "Carlos",
                        Apellido = "Cadete",
                        UsuarioNombre = "cadete",
                        Contraseña = "123",
                        Rol = "Cadete",
                        Mail = "cadete@farmacia.com",
                        IDSucursal = sucursal.IDSucursal
                    }
                );
                
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

            // --- CARGA DE PEDIDOS (SEED DATA) ---
            if (!context.Pedidos.Any())
            {
                // 1. Obtener datos auxiliares
                var cliente = context.Clientes.First();
                var producto1 = context.Productos.OrderBy(p => p.IDProducto).First(); // Amoxidal
                var producto2 = context.Productos.OrderByDescending(p => p.IDProducto).First(); // Vitamina C
                var sucursal = context.Sucursales.First();
                var localidad = context.Localidades.First();
                
                // Usuarios
                var usuarioAdmin = context.Usuarios.First(u => u.Rol == "Administrador");
                var usuarioCadete = context.Usuarios.First(u => u.Rol == "Cadete"); // Recuperamos al cadete

                // Estados
                var estadoSinPreparar = context.EstadosDePedidos.First(e => e.NombreEstado == "Sin preparar");
                var estadoEnCamino = context.EstadosDePedidos.First(e => e.NombreEstado == "En camino");

                // --- PEDIDO 1: SIN PREPARAR (ADMIN) ---
                var pedido1 = new Pedido
                {
                    Fecha = DateTime.Now,
                    Total = producto1.PrecioProducto * 2,
                    FormaDePago = "Efectivo",
                    EstadoActual = "Sin preparar",
                    DireccionEntrega = cliente.Direccion,
                    IDLocalidad = localidad.IDLocalidad,
                    FechaEntregaEstimada = DateTime.Now.AddDays(1),
                    HoraEntregaEstimada = DateTime.Now.TimeOfDay,
                    IDCliente = cliente.IDCliente,
                    IDEstadoDePedido = estadoSinPreparar.IDEstadoDePedido,
                    IDUsuario = usuarioAdmin.IDUsuario, // Asignado al Admin o sin asignar
                    IDSucursal = sucursal.IDSucursal
                };

                context.Pedidos.Add(pedido1);
                context.SaveChanges(); // Guardamos para generar ID

                context.DetallesDePedidos.Add(new DetalleDePedido
                {
                    IDPedido = pedido1.IDPedido,
                    IDProducto = producto1.IDProducto,
                    Cantidad = 2,
                    PrecioUnitario = producto1.PrecioProducto
                });

                context.HistorialesDeEstados.Add(new HistorialDeEstados
                {
                    IDPedido = pedido1.IDPedido,
                    IDEstadoDePedido = estadoSinPreparar.IDEstadoDePedido,
                    IDUsuario = usuarioAdmin.IDUsuario,
                    fecha_hora_inicio = DateTime.Now,
                    Observaciones = "Pedido ingresado"
                });

                // --- PEDIDO 2: EN CAMINO (PARA EL CADETE) ---
                var pedidoCadete = new Pedido
                {
                    Fecha = DateTime.Now.AddHours(-1), // Se hizo hace una hora
                    Total = producto2.PrecioProducto,
                    FormaDePago = "Tarjeta",
                    EstadoActual = "En camino",
                    DireccionEntrega = "Obispo Oro 450", // Otra dirección
                    IDLocalidad = localidad.IDLocalidad,
                    FechaEntregaEstimada = DateTime.Now,
                    HoraEntregaEstimada = DateTime.Now.AddMinutes(30).TimeOfDay,
                    IDCliente = cliente.IDCliente,
                    IDEstadoDePedido = estadoEnCamino.IDEstadoDePedido,
                    IDUsuario = usuarioCadete.IDUsuario, // ✅ ASIGNADO AL CADETE
                    IDSucursal = sucursal.IDSucursal
                };

                context.Pedidos.Add(pedidoCadete);
                context.SaveChanges(); // Guardamos para generar ID

                context.DetallesDePedidos.Add(new DetalleDePedido
                {
                    IDPedido = pedidoCadete.IDPedido,
                    IDProducto = producto2.IDProducto,
                    Cantidad = 1,
                    PrecioUnitario = producto2.PrecioProducto
                });

                // Historial para el pedido del cadete
                context.HistorialesDeEstados.Add(new HistorialDeEstados
                {
                    IDPedido = pedidoCadete.IDPedido,
                    IDEstadoDePedido = estadoEnCamino.IDEstadoDePedido,
                    IDUsuario = usuarioCadete.IDUsuario,
                    fecha_hora_inicio = DateTime.Now,
                    Observaciones = "Pedido retirado por cadete Carlos"
                });

                context.SaveChanges();
            }

            Console.WriteLine("--- Semillado completo: Usuarios, Pedido Admin y Pedido Cadete creados ---");
        }
    }
}