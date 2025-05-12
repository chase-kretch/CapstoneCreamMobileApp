using backend.Models.Services.Dtos;

namespace backend.Models.Services;

public interface IMessageService
{
    public ServiceResponse<IEnumerable<DirectionalMessageDto>> GetChatHistoryBetweenUsers(int userId, int recipientId);
}