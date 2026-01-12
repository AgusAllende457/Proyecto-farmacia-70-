using System.ComponentModel.DataAnnotations;

namespace Back.Models
{
    public class Barrio
   
    {
            [Key]
            public int IDBarrio { get; set; }
            public string Nombre { get; set; } = string.Empty;

            // FK a Localidad (Córdoba)
            public int IDLocalidad { get; set; }
            public Localidad Localidad { get; set; } = null!;

            // Relación: En un barrio viven muchos clientes
            public ICollection<Cliente> Clientes { get; set; } = new List<Cliente>();
    }


    

}
