public class OrderSummaryDTO
{
    public int IDPedido { get; set; }
    public DateTime Fecha { get; set; }
    public decimal Total { get; set; }
    public string EstadoNombre { get; set; } = string.Empty; // Desde EstadoDePedido.Nombre
    public string ClienteNombre { get; set; } = string.Empty; // Desde Cliente.Nombre
    public string ResponsableNombre { get; set; } = string.Empty; // Desde Usuario.Nombre

    // Para el RF14 (Alertas de tiempo)
    public DateTime FechaEntregaEstimada { get; set; }
    public bool EstaDemorado => DateTime.Now > FechaEntregaEstimada && string.IsNullOrEmpty(FechaEntregaReal.ToString());
    public DateTime? FechaEntregaReal { get; set; }
}
