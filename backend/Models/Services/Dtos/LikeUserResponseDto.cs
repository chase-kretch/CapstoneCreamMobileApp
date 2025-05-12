namespace backend.Models.Services.Dtos;

public class LikeUserResponseDto
{
    public bool IsMatch { get; set; }
    public MatchDto? Match { get; set; }
    public LikeDto? Like { get; set; }
    
    public UserRelationshipDto? User { get; set; }
}