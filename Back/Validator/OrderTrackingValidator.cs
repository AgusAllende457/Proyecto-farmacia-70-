using FluentValidation;
using Back.DTOs;

namespace Back.Validators
{
    public class OrderTrackingValidator : AbstractValidator<int> // Validamos el ID que entra por la URL
    {
        public OrderTrackingValidator()
        {
            RuleFor(id => id)
                .NotEmpty().WithMessage("El ID del pedido es obligatorio para ver el seguimiento.")
                .GreaterThan(0).WithMessage("El ID del pedido debe ser un número positivo.");
        }
    }
}
