using backend.Models.Entities;

namespace backend.Models.Services.Dtos;

public class LikeDto
{
    public int Id { get; set; }
    public UserDto Liker { get; set; }
    public UserDto Likee { get; set; }
    public DateTime Timestamp { get; set; }
}