namespace backend.Models.Services.Dtos;

public class DirectionalMatchDto
{
    public required int Id { get; set; }
    public required UserDto MatchedUser { get; set; }
    public required DateTime Timestamp { get; set; }
}