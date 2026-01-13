using System;

namespace Back.DTOs
{
    /// <summary>
    /// Objeto de transferencia para los criterios de búsqueda (RF13)
    /// </summary>
    public class OrderFilterDTO
    {
        public int? IDEstadoDePedido { get; set; }
        public int? IDUsuario { get; set; }
        public int? IDCliente { get; set; }
        public DateTime? FechaDesde { get; set; }
        public DateTime? FechaHasta { get; set; }
    }
}