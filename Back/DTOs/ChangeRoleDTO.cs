namespace Back.DTOs
{
    public class ChangeRoleDTO
    {
        // Validamos que no llegue vacío
        public string NewRole { get; set; } = string.Empty;
    }
}
