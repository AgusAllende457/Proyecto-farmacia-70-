using Back.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Back.Models
{
    public class DetalleDePedido
    {
        public int IDDetalleDePedido { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }

        // Relación con Pedido
        public int IDPedido { get; set; }
        [ForeignKey("IDPedido")] 
        public Pedido Pedido { get; set; } = null!;

        // Relación con Producto
        public int IDProducto { get; set; }
        [ForeignKey("IDProducto")] 
        public Producto Producto { get; set; } = null!;


    }
}