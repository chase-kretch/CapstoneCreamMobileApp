using backend.Models.Services.Dtos;

namespace backend.Models.Services;

public interface IUserInteractionService
{
    ServiceResponse<LikeUserResponseDto> LikeUser(int fromUserId, int toUserId);
    ServiceResponse<string> HideUser(int fromUserId, int toUserId);
    ServiceResponse<string> UnhideUser(int fromUserId, int hiddenUserId);
    ServiceResponse<HobbyDto> AddHobbyToUser(int userId, string hobby);
    ServiceResponse<string> DeleteHobbyFromUser(int userId, int hobbyId);
    ServiceResponse<UserDto> EditBio(int userId, string bio);
}