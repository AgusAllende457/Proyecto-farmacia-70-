using System.ComponentModel.DataAnnotations;

namespace Back.DTOs
{
    public class RegisterUserDTO
    {
        [Required(ErrorMessage = "El nombre completo es obligatorio")]
        public string NombreCompleto { get; set; }

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato de email inválido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        public string Password { get; set; }

        [Required(ErrorMessage = "El DNI es obligatorio")]
        public string DNI { get; set; }

        public string Telefono { get; set; }

        [Required(ErrorMessage = "El rol es obligatorio")]
        // Los valores deben coincidir con tu lógica de Front: "Administrador", "Operario", "Cadete"
        public string Rol { get; set; }

        [Required(ErrorMessage = "La sucursal es obligatoria")]
        public int IdSucursal { get; set; }
    }
}
