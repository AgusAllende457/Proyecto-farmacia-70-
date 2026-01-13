using Back.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Back.Models
{
    

    public class Cliente
    {
        [Key]
        public int IDCliente { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string DNI { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Mail { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;

        // Relación obligatoria con Barrio para logística interna
        public int IDBarrio { get; set; }
        [ForeignKey("IDBarrio")] // Esto le dice a EF que use IDBarrio como la FK de esta relación
        public Barrio Barrio { get; set; } = null!;


        // Relación con Localidad
        public int IDLocalidad { get; set; }
        [ForeignKey("IDLocalidad")] // Agregado por consistencia
        public Localidad Localidad { get; set; } = null!;

        // Historial de pedidos del cliente
        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
    }

}