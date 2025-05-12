using backend.Data;
using backend.Helpers;
using backend.Models.Entities;
using backend.Models.Services.Dtos;

namespace backend.Models.Services;

public class UserInteractionService: IUserInteractionService
{
    private readonly ICreamRepo _repo;
    private readonly DtoMapper _dtoMapper;

    public UserInteractionService(ICreamRepo repo, DtoMapper dtoMapper)
    {
        _repo = repo;
        _dtoMapper = dtoMapper;
    }
    
    public ServiceResponse<LikeUserResponseDto> LikeUser(int fromUserId, int toUserId)
    {
        User? liker = _repo.GetUserById(fromUserId);
        User? likee = _repo.GetUserById(toUserId);

        if (liker == null)
        {
            return ServiceResponse<LikeUserResponseDto>.NotFound($"User with id {fromUserId} not found.");
        }
        
        if (likee == null)
        {
            return ServiceResponse<LikeUserResponseDto>.NotFound($"User with id {toUserId} not found.");
        }
        
        if (_repo.LikeExistsBetweenUsers(liker, likee))
        {
            return ServiceResponse<LikeUserResponseDto>.Conflict("You have already liked this person.");
        }
        
        if (_repo.LikeExistsBetweenUsers(likee, liker))
        {
            Match match = new Match(liker, likee);
            _RemoveAnyLikeBetweenUsers(liker, likee);
            _repo.AddMatch(match);
            LikeUserResponseDto output = new LikeUserResponseDto { IsMatch = true, Match = _dtoMapper.MatchToMatchDto(match)};
            return ServiceResponse<LikeUserResponseDto>.Ok(output);
        }
        
        Hide? hide = _repo.GetHideByHiderAndHidee(fromUserId, toUserId);
        
        if (hide != null)
        {
            _repo.RemoveHide(hide);
        }
        
        Like like = new Like
        {
            Liker = liker,
            Likee = likee,
            Timestamp = DateTime.UtcNow
        };
        
        liker.LikesGiven.Add(like);
        likee.LikedReceived.Add(like);
        Like l = _repo.AddLikeBetweenUsers(like);
        
        LikeUserResponseDto output2 = new LikeUserResponseDto { IsMatch = false, Like = _dtoMapper.LikeToLikeDto(l) };
        return ServiceResponse<LikeUserResponseDto>.Ok(output2);
    }
    
    public ServiceResponse<HobbyDto> AddHobbyToUser(int userId, string hobby)
    {
        User? user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<HobbyDto>.NotFound($"User with id {userId} not found.");
        }
        
        if (user.Hobbies.Any(h => h.Name == hobby))
        {
            return ServiceResponse<HobbyDto>.Conflict("User already has this hobby.");
        }
        
        Hobby? h = _repo.GetHobbyByName(hobby);
        
        if (h == null)
        {
            h = new Hobby { Name = hobby };
            _repo.AddHobby(h);
        }
        
        user.Hobbies.Add(h);
        h.Users.Add(user);
        // _repo.AddUser(user);
        _repo.SaveChanges();
        
        return ServiceResponse<HobbyDto>.Created(_dtoMapper.HobbyToHobbyDto(h));
    }

    public ServiceResponse<UserDto> EditBio(int userId, string bio)
    {
        User? user = _repo.GetUserById(userId);

        if (user == null)
        {
            return ServiceResponse<UserDto>.NotFound($"User with id {userId} not found.");
        }

        user.Bio = bio;
        _repo.SaveChanges();
        UserDto userDto = _dtoMapper.UserToUserSensitiveInfoDto(user);

        return ServiceResponse<UserDto>.Ok(userDto);

    }
    
    public ServiceResponse<string> DeleteHobbyFromUser(int userId, int hobbyId)
    {
        User? user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<string>.NotFound($"User with id {userId} not found.");
        }
        
        Hobby? hobby = _repo.GetHobbyById(hobbyId);
        
        if (hobby == null)
        {
            return ServiceResponse<string>.NotFound($"Hobby with id {hobbyId} not found.");
        }
        
        if (!user.Hobbies.Contains(hobby))
        {
            return ServiceResponse<string>.Conflict("User does not have this hobby.");
        }
        
        user.Hobbies.Remove(hobby);
        hobby.Users.Remove(user);
        _repo.SaveChanges();
        
        return ServiceResponse<string>.Ok("Hobby deleted successfully.");
    }
    
    public ServiceResponse<string> HideUser(int fromUserId, int toUserId)
    {
        var fromUser = _repo.GetUserById(fromUserId);
        var toUser = _repo.GetUserById(toUserId);

        if (fromUser == toUser)
        {
            return ServiceResponse<string>.BadRequest("You cannot hide yourself.");
        }
        
        if (fromUser == null)
        {
            return ServiceResponse<string>.NotFound($"User with id {fromUserId} not found.");
        }
        
        if (toUser == null)
        {
            return ServiceResponse<string>.NotFound($"User with id {toUserId} not found.");
        }
        
        if (_repo.GetHideByHiderAndHidee(fromUserId, toUserId) != null)
        {
            return ServiceResponse<string>.Conflict("You have already hidden this user.");
        }
        
        _RemoveAnyMatchBetweenUsers(fromUser, toUser);
        _RemoveAnyLikeBetweenUsers(fromUser, toUser);
        
        Hide hide = new Hide
        {
            Hider = fromUser,
            Hidden = toUser,
            Timestamp = DateTime.UtcNow
        };
        
        fromUser.HidesGiven.Add(hide);
        toUser.HidesReceived.Add(hide);
        
        _repo.SaveChanges();
        
        return ServiceResponse<string>.Ok("Hide successful.");
    }
    
    public ServiceResponse<string> UnhideUser(int fromUserId, int hiddenUserId)
    {
        Hide? hide = _repo.GetHideByHiderAndHidee(fromUserId, hiddenUserId);
        
        if (hide == null)
        {
            return ServiceResponse<string>.NotFound($"Hide between {fromUserId} and {hiddenUserId} does not exist.");
        }
        
        _repo.RemoveHide(hide);
        
        return ServiceResponse<string>.Ok("Unhide successful.");
    }
    
    private bool _RemoveAnyMatchBetweenUsers(User user1, User user2)
    {
        Match? match = _repo.GetMatchBetweenUsers(user1.Id, user2.Id);
        
        if (match == null)
        {
            return false;
        }
        
        _repo.RemoveMatch(match);
        
        return true;
    }
    
    private bool _RemoveAnyLikeBetweenUsers(User user1, User user2)
    {
        Like? likeFrom1To2 = _repo.GetLikeBetweenUsersDirectional(user1.Id, user2.Id);
        Like? likeFrom2To1 = _repo.GetLikeBetweenUsersDirectional(user2.Id, user1.Id);
        
        if (likeFrom1To2 == null && likeFrom2To1 == null)
        {
            return false;
        }
        
        if (likeFrom1To2 != null)
        {
            _repo.RemoveLike(likeFrom1To2);
        }
        
        if (likeFrom2To1 != null)
        {
            _repo.RemoveLike(likeFrom2To1);
        }

        return true;
    }
}