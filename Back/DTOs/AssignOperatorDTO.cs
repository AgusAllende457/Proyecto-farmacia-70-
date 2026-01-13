using System.ComponentModel.DataAnnotations;

namespace Back.DTOs
{
    public class AssignOperatorDTO
    {
        [Required(ErrorMessage = "El ID del pedido es obligatorio")]
        public int PedidoId { get; set; }

        [Required(ErrorMessage = "El ID del operario es obligatorio")]
        public int OperarioId { get; set; }
    }
}