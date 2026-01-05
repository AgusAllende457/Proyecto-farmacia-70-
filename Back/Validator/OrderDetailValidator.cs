using FluentValidation;
using Back.DTOs;

namespace Back.Validators
{
    public class OrderDetailValidator : AbstractValidator<OrderDetailDTO>
    {
        public OrderDetailValidator()
        {
            RuleFor(x => x.IDProducto)
                .NotEmpty().WithMessage("El ID del producto es obligatorio.");

            RuleFor(x => x.Cantidad)
                .GreaterThan(0).WithMessage("La cantidad debe ser mayor a 0.");

            RuleFor(x => x.PrecioUnitario)
                .GreaterThan(0).WithMessage("El precio debe ser un valor positivo.");
        }
    }
}