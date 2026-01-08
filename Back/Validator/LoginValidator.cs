using FluentValidation;
using Back.DTOs;

namespace Back.Validators
{
    public class LoginValidator : AbstractValidator<LoginDTO>
    {
        public LoginValidator()
        {
            // Validación para el nombre de usuario
            // Ref: RF7 - El sistema debe permitir la autenticación de usuarios.
            RuleFor(x => x.Usuario)
                .NotEmpty().WithMessage("El nombre de usuario es obligatorio.")
                .MinimumLength(4).WithMessage("Por seguridad, el usuario debe tener al menos 4 caracteres.");

            // Validación para la contraseña
            // Ref: RF2 - Auditoría: Garantiza que no entren registros vacíos al historial.
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("La contraseña es obligatoria.");
        }
    }
}
