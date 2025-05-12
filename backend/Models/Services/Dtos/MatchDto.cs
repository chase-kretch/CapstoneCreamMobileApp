namespace backend.Models.Services.Dtos;

public class MatchDto
{
    public int Id { get; set; }
    public UserDto User1 { get; set; }
    public UserDto User2 { get; set; }
    public DateTime Timestamp { get; set; }
}