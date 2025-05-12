namespace backend.Models.Services.Dtos;

public class HideDto
{
    public int Id { get; set; }
    public UserDto Hider { get; set; }
    public UserDto Hidden { get; set; }
    public DateTime Timestamp { get; set; }
}