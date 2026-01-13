using System.ComponentModel.DataAnnotations;

namespace Back.DTOs
{
    public class AssignDeliveryDTO
    {
        [Required(ErrorMessage = "El ID del pedido es obligatorio")]
        public int PedidoId { get; set; }

        [Required(ErrorMessage = "El ID del cadete es obligatorio")]
        public int CadeteId { get; set; }
    }
}