using FluentValidation;
using Back.DTOs;

namespace Back.Validators
{
    public class ChangeOrderStatusValidator : AbstractValidator<ChangeOrderStatusDTO>
    {
        public ChangeOrderStatusValidator() // Quitamos el 'sealed' y los paréntesis extra
        {
            RuleFor(x => x.IDPedido)
                .NotEmpty().WithMessage("El ID del pedido es obligatorio.")
                .GreaterThan(0);

            RuleFor(x => x.IDNuevoEstado)
                .NotEmpty().WithMessage("Debe seleccionar un estado.");

            RuleFor(x => x.IDUsuario)
                .NotEmpty().WithMessage("El ID de usuario es obligatorio.");

            // Regla para el RF5.11 (Pedidos Cancelados)
            // Si el ID del estado cancelado en tu BD es el 5:
            RuleFor(x => x.MotivoCancelacion)
                .NotEmpty()
                .When(x => x.IDNuevoEstado == 5)
                .WithMessage("Si cancela el pedido, debe ingresar un motivo.");
        }
    }
}