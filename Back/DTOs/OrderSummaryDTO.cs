public class OrderSummaryDTO
{
    public int IDPedido { get; set; }
    public DateTime Fecha { get; set; }
    public decimal Total { get; set; }

    public int IDEstadoDePedido { get; set; }
    public string EstadoNombre { get; set; } = string.Empty;
    public string ClienteNombre { get; set; } = string.Empty;
    public string ResponsableNombre { get; set; } = string.Empty;

    public DateTime FechaEntregaEstimada { get; set; }
    public DateTime? FechaEntregaReal { get; set; }
    
    // Cambiado: Ahora permite set para que el Repository pueda asignar el valor
    public bool EstaDemorado { get; set; }
}