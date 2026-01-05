using FluentValidation;
using Back.DTOs;

namespace Back.Validators
{
    public class CreateOrderValidator : AbstractValidator<CreateOrderDTO>
    {
        public CreateOrderValidator()
        {
            RuleFor(x => x.IDCliente)
                .NotEmpty().WithMessage("El cliente es obligatorio.");

            RuleFor(x => x.IDSucursal)
                .NotEmpty().WithMessage("La sucursal es obligatoria.");

            RuleFor(x => x.FormaDePago)
                .NotEmpty().WithMessage("Debe especificar una forma de pago.");

            // Validar que la lista de detalles no esté vacía (Importante para el RF17)
            RuleFor(x => x.Detalles)
                .NotEmpty().WithMessage("El pedido debe tener al menos un producto.")
                .Must(d => d.Count > 0).WithMessage("La lista de productos no puede estar vacía.");

            // Esto aplica las reglas de OrderDetailDTOValidator a cada ítem de la lista
            RuleForEach(x => x.Detalles).SetValidator(new OrderDetailValidator());
        }
    }
}
