using backend.Models.Services.Dtos;
using backend.Helpers;
using backend.Models.Entities;

namespace backend.Models.Services;

public interface IUserService
{
    ServiceResponse<UserDto> GetUser(int id);
    ServiceResponse<UserSensitiveInfoDto> GetUserSensitiveInfo(int id);
    ServiceResponse<UserSensitiveInfoDto> RegisterUser(RegisterUserRequestDto registerUserRequest);
    ServiceResponse<IEnumerable<UserDto>> GetUsers();
    ServiceResponse<PaginatedList<UserDto>> GetUsersPaginated(int pageNumber, int pageSize);
    ServiceResponse<PaginatedList<LikeDto>> GetLikesGivenByUserPaginated(int userId, int pageNumber, int pageSize);
    ServiceResponse<PaginatedList<LikeDto>> GetLikesReceivedByUserPaginated(int userId, int pageNumber, int pageSize);
    ServiceResponse<PaginatedList<DirectionalMatchDto>> GetMatchesByUserPaginated(int userId, int pageNumber, int pageSize);
    ServiceResponse<PaginatedList<HideDto>> GetHidesByUserPaginated(int userId, int pageNumber, int pageSize);
    ServiceResponse<UserRelationshipDto> GetUserWithRelationshipStatus(int currentUserId, int otherUserId);
}