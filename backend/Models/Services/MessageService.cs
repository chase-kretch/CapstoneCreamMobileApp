using System.Collections;
using backend.Data;
using backend.Models.Services.Dtos;

namespace backend.Models.Services;

public class MessageService: IMessageService
{
    private readonly ICreamRepo _repo;
    private readonly DtoMapper _mapper;
    
    public MessageService(ICreamRepo repo, DtoMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }
    
    public ServiceResponse<IEnumerable<DirectionalMessageDto>> GetChatHistoryBetweenUsers(int userId, int recipientId)
    {
        Console.WriteLine($"Fetching chat history for User ID: {userId} and Recipient ID: {recipientId}");

        var user = _repo.GetUserById(userId);
        var recipient = _repo.GetUserById(recipientId);
        
        if (user == null)
        {
            Console.WriteLine("User not found.");
            return ServiceResponse<IEnumerable<DirectionalMessageDto>>.NotFound($"Use with id {userId} not found.");
        }
        
        if (userId == recipientId)
        {
            Console.WriteLine("Users must be different.");
            return ServiceResponse<IEnumerable<DirectionalMessageDto>>.BadRequest("Users must be different.");
        }
        
        if (recipient == null)
        {
            Console.WriteLine("Recipient not found.");
            return ServiceResponse<IEnumerable<DirectionalMessageDto>>.NotFound("Recipient not found.");
        }

        var messages = _repo.GetChatHistoryBetweenUsers(userId, recipientId);
        Console.WriteLine("messages " + messages);
        // If a collection is empty we should just return an empty list, not a 404.
        // if (messages == null || messages.Count == 0)
        // {
        //     Console.WriteLine("No messages found between the users.");
        //     return NotFound("No messages found between the users.");
        // }

        Console.WriteLine($"{messages.Count} messages found between the users.");

        foreach (var message in messages)
        {
            Console.WriteLine($"Message from {message.SenderId} to {message.ReceiverId} at {message.Time}: {message.Body}");
        }
        
        var messageDtos = messages.Select(m => _mapper.MessageToDirectionalMessageDto(m, userId)).ToList();

        foreach (var msg in messageDtos)
        {
            Console.WriteLine($"Message from {msg.SenderId} to {msg.ReceiverId} at {msg.Time}: {msg.Body}");
        }

        return ServiceResponse<IEnumerable<DirectionalMessageDto>>.Ok(messageDtos);
    }
}