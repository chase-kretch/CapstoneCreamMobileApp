namespace backend.Models.Services.Dtos;

public class DirectionalMessageDto: MessageDto
{
    public bool IsFromCurrentUser { get; set; }
}