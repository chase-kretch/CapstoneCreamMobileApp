namespace backend.Models.Services.Dtos;

public class UserRelationshipDto: UserDto
{
    public required RelationshipStatusDto RelationshipStatus { get; set; } 
}

public enum RelationshipStatusDto
{
    Unrelated,
    CurrentUserHasHidden,
    CurrentUserHasLiked,
    OtherUserHasLiked,
    Matched
}