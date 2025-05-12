namespace backend.Models.Services.Dtos;

public class MessageDto
{
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public required string Body { get; set; }
    public DateTime Time { get; set; }
}