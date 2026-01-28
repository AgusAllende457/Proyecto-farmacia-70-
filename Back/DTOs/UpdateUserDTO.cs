using System.ComponentModel.DataAnnotations;

namespace Back.DTOs
{
    public class UpdateUserDTO
    {
        [Required]
        public int IdUsuario { get; set; }

        [Required(ErrorMessage = "El nombre completo es obligatorio")]
        public string NombreCompleto { get; set; }

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string DNI { get; set; }

        public string Telefono { get; set; }

        [Required]
        public string Rol { get; set; }

        [Required]
        public int IdSucursal { get; set; }

        public bool Activo { get; set; }
    }
}
