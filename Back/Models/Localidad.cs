using Back.Models;
using System.ComponentModel.DataAnnotations;

namespace Back.Models
{
    public class Localidad
    {
        [Key]
        public int IDLocalidad { get; set; }
        public string CodigoPostal { get; set; } = string.Empty;
        public string Ciudad { get; set; } = "Córdoba";
        public string Provincia { get; set; } = "Córdoba";

        // Relación: Una ciudad tiene muchos barrios para el sistema de envíos local
        public ICollection<Barrio> Barrios { get; set; } = new List<Barrio>();

        // Relación directa con clientes por si se requiere filtrado rápido
        public ICollection<Cliente> Clientes { get; set; } = new List<Cliente>();
    }
}
