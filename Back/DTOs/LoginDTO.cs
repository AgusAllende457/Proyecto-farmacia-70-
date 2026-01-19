using System.ComponentModel.DataAnnotations;

namespace Back.DTOs
{
    public class LoginDTO
    {
    public string UsuarioNombre { get; set; } 
    public string Contraseña { get; set; }
    }

    // Ref: RF8 - Asignar permisos diferenciados según perfil (Admin, Operario, Cadete).
    // Ref: RF11, RF12 - Especialización de roles en la base de datos.
}
