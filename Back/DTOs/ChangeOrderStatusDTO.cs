using System.ComponentModel.DataAnnotations;

namespace Back.DTOs 
{
    public class ChangeOrderStatusDTO
    {
        [Required(ErrorMessage = "El ID del pedido es obligatorio")]
        public int IDPedido { get; set; }

        [Required(ErrorMessage = "El ID del nuevo estado es obligatorio")]
        public int IDNuevoEstado { get; set; }

        [Required(ErrorMessage = "El ID del usuario es obligatorio para la trazabilidad")]
        public int IDUsuario { get; set; }

        public string? Observaciones { get; set; }

        // Campo específico para el reporte RF5.11 (Pedidos Cancelados)
        public string? MotivoCancelacion { get; set; }
    }
}