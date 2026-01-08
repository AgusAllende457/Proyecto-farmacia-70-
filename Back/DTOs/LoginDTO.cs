using System.ComponentModel.DataAnnotations;

namespace Back.DTOs
{
    public class LoginDTO
    {
        public string Usuario { get; set; }
        public string Password { get; set; }
    }

    // Ref: RF8 - Asignar permisos diferenciados según perfil (Admin, Operario, Cadete).
    // Ref: RF11, RF12 - Especialización de roles en la base de datos.
}
