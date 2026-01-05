using System.ComponentModel.DataAnnotations;



namespace Back.DTOs
{
    public class CreateOrderDTO
    {
        [Required]
        public int IDCliente { get; set; }

        [Required]
        public int IDSucursal { get; set; }

        [Required]
        public int IDUsuario { get; set; }

        [Required]
        public string FormaDePago { get; set; }

        // Aquí van los detalles del pedido (RF17)
        public List<OrderDetailDTO> Detalles { get; set; } = new List<OrderDetailDTO>();
    }
}